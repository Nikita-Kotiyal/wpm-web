import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiServiceService, SponsorPayload } from 'src/app/Services/api-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { environment } from 'src/environments/env';

@Component({
  selector: 'app-sponsor',
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.css'],
})
export class SponsorComponent implements OnInit {
  stripePromise = loadStripe(environment.stripePublicKey);
  sponsorForm: FormGroup;
  submitted = false;
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;
  productId: string = 'prod_ShgpTOREUyswye'; // Default product ID
  amount: number = 0;
  product: any = null;
  price: any = null;
  isLoading: boolean = false;
  retryCount: number = 0;
  maxRetries: number = 3;
  lastError: any = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private apiService: ApiServiceService,
    private toaster: ToastrService,
    private _router: Router
  ) {
    // Initialize form
    this.sponsorForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      amount: ['', [Validators.required, Validators.min(1)]],
      note: ['']
    });
  }

  ngOnInit(): void {
    // Initialize Stripe
    this.initializeStripe();

    // Get product details
    this.getStripeProduct();
  }

getStripeProduct() {
  const stripeProductId = this.productId; // Use the class property

  this.apiService.getProductById(stripeProductId).subscribe({
    next: (response) => {
      console.log('Stripe Product:', response);

      // Handle the API response format
      if (response && response.data) {
        this.product = response.data;

        // Get price from default_price if available
        if (this.product.default_price && typeof this.product.default_price === 'object') {
          this.price = this.product.default_price;
          this.amount = (this.price.unit_amount || 0) / 100;
        } else {
          // Fallback to name-based pricing
          this.amount = 10; // Default amount
        }

        this.sponsorForm.patchValue({
          amount: this.amount
        });
      } else {
        console.error('Invalid product response format');
        this.toaster.error('Failed to load product information', 'Error');
      }
    },
    error: (err) => {
      console.error('Error fetching product:', err);
      this.toaster.error('Failed to load product information', 'Error');
    }
  });
}


  async initializeStripe() {
    try {
      const stripe = await this.stripePromise;
      if (!stripe) {
        console.error('Stripe failed to load');
        this.toaster.error('Payment system failed to load', 'Error');
        return;
      }

      this.stripe = stripe;

      // Create Stripe Elements instance
      this.elements = this.stripe.elements();

      // Create and mount the Card Element
      this.cardElement = this.elements.create('card', {
        style: {
          base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
          }
        }
      });

      // Wait for DOM to be ready
      setTimeout(() => {
        this.cardElement?.mount('#card-element');

        // Handle real-time validation errors from the card Element
        this.cardElement?.on('change', (event) => {
          const displayError = document.getElementById('card-errors');
          if (displayError) {
            displayError.textContent = event.error ? event.error.message : '';
          }
        });
      }, 100);

    } catch (error) {
      console.error('Error initializing Stripe:', error);
      this.toaster.error('Payment system initialization failed', 'Error');
    }
  }

  get f() {
    return this.sponsorForm.controls;
  }



  // Helper method to determine if an error is retryable
  shouldRetry(error: any): boolean {
    // Retry on network errors, card errors that can be fixed with retry
    const retryableErrors = [
      'network_error',
      'card_declined',
      'processing_error',
      'authentication_required'
    ];

    return retryableErrors.includes(error.code);
  }

  // Method to retry payment with the same client secret
  async retryPayment(clientSecret: string | undefined): Promise<void> {
    if (!this.cardElement || !this.stripe || !clientSecret) {
      this.toaster.error('Payment system not available', 'Error');
      this.isLoading = false;
      return;
    }

    try {
      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: this.sponsorForm.get('fullName')?.value || '',
            email: this.sponsorForm.get('email')?.value || ''
          }
        }
      });

      const { error, paymentIntent } = result;

      if (error) {
        console.error(`Retry ${this.retryCount} failed:`, error);
        this.lastError = error;

        // Check if we should retry again
        if (this.retryCount < this.maxRetries && this.shouldRetry(error)) {
          this.retryCount++;
          this.toaster.warning(`Payment attempt failed. Retrying (${this.retryCount}/${this.maxRetries})...`, 'Retrying');

          // Wait a moment before retrying
          setTimeout(() => {
            this.retryPayment(clientSecret);
          }, 1500);
        } else {
          // No more retries
          this.toaster.error(error.message || 'Payment failed after multiple attempts', 'Error');
          this.isLoading = false;
        }
      } else {
        // Payment succeeded on retry
        this.toaster.success('Payment successful!', 'Paid');

        // Create sponsor record after successful payment
        const sponsorData: SponsorPayload = {
          fullName: this.sponsorForm.get('fullName')?.value || '',
          Email: this.sponsorForm.get('email')?.value || '',
          Amount: this.sponsorForm.get('amount')?.value || 0,
          Note: this.sponsorForm.get('note')?.value || '',
          transactionId: paymentIntent?.id || '',
          paymentStatus: 'Paid'
        };

        // Save the sponsor data
        this.apiService.submitSponsor(sponsorData).subscribe({
          next: (response) => {
            console.log('Sponsor data saved:', response);
            this._router.navigate(['/payment-success']);
          },
          error: (err) => {
            console.error('Error saving sponsor data:', err);
            // Still redirect to success page since payment was successful
            this._router.navigate(['/payment-success']);
          }
        });
      }
    } catch (err: any) {
      console.error('Payment retry error:', err);
      this.toaster.error('Payment processing error', 'Error');
      this.isLoading = false;
    }
  }

  async makePayment(): Promise<void> {
    this.submitted = true;
    this.isLoading = true;
    this.retryCount = 0; // Reset retry count
    this.submitted = true;
    this.isLoading = true;

    if (this.sponsorForm.invalid) {
      this.isLoading = false;
      return;
    }

    try {
      if (!this.stripe || !this.cardElement) {
        this.toaster.error('Payment system not available', 'Error');
        this.isLoading = false;
        return;
      }

      // Skip creating sponsor record first due to API limitations
      // Proceed directly to payment intent creation


      // Prepare payment data
      const paymentData = {
        productId: this.productId,
        amount: this.sponsorForm.get('amount')?.value,
        fullName: this.sponsorForm.get('fullName')?.value,
        email: this.sponsorForm.get('email')?.value,
        note: this.sponsorForm.get('note')?.value
      };

          // Create payment intent on server
          this.apiService.createPaymentIntent(paymentData).subscribe({
        next: async (response) => {
          console.log('Payment intent created:', response);

          // Extract client secret from response
          let clientSecret: string | undefined;
          if (response.data && response.data.clientSecret) {
            clientSecret = response.data.clientSecret;
          } else if (response.clientSecret) {
            clientSecret = response.clientSecret;
          }

          if (!clientSecret) {
            this.toaster.error('Invalid payment intent', 'Error');
            this.isLoading = false;
            return;
          }

          // Process payment with card details entered by user
          if (!this.cardElement || !this.stripe) {
            this.toaster.error('Card information is required', 'Error');
            this.isLoading = false;
            return;
          }

          const result = await this.stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: this.cardElement,
              billing_details: {
                name: this.sponsorForm.get('fullName')?.value || '',
                email: this.sponsorForm.get('email')?.value || ''
              }
            }
            // Note: metadata can only be added when creating the PaymentIntent on the server
          });

          const { error, paymentIntent } = result;

          if (error) {
            console.error('Payment failed:', error);
            this.lastError = error;

            // Check if we should retry
            if (this.retryCount < this.maxRetries && this.shouldRetry(error)) {
              this.retryCount++;
              this.toaster.warning(`Payment attempt failed. Retrying (${this.retryCount}/${this.maxRetries})...`, 'Retrying');

              // Wait a moment before retrying
              setTimeout(() => {
                this.retryPayment(clientSecret);
              }, 1500);
              return;
            } else {
              // No more retries or non-retryable error
              this.toaster.error(error.message || 'Payment failed', 'Error');
              this.isLoading = false;
            }
          } else {
            // Payment succeeded
            this.toaster.success('Payment successful!', 'Success');

            // Create sponsor record after successful payment
            const sponsorData: SponsorPayload = {
              fullName: this.sponsorForm.get('fullName')?.value || '',
              Email: this.sponsorForm.get('email')?.value || '',
              Amount: this.sponsorForm.get('amount')?.value || 0,
              Note: this.sponsorForm.get('note')?.value || '',
              transactionId: paymentIntent?.id || '',
              paymentStatus: 'Paid'
            };

            // Save the sponsor data
            this.apiService.submitSponsor(sponsorData).subscribe({
              next: (response) => {
                console.log('Sponsor data saved:', response);
                this.toaster.success('Payment successful!', 'Success');
                // Redirect to success page
                this._router.navigate(['/payment-success']);
              },
              error: (err) => {
                console.error('Error saving sponsor data:', err);
                // Still redirect to success page since payment was successful
                this.toaster.success('Payment successful! (Data sync pending)', 'Success');
                this._router.navigate(['/payment-success']);
              }
            });
          }
        },
        error: (error) => {
          console.error('Error creating payment intent:', error);
          this.toaster.error('Payment processing failed', 'Error');
          this.isLoading = false;
        }
      });
    } catch (err: any) {
      console.error('Payment error:', err);
      this.toaster.error('Payment processing error', 'Error');
      this.isLoading = false;
    }
  }
}
