import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  date = new Date().getFullYear();
  forgotPassForm: FormGroup = new FormGroup({
    email: new FormControl(''),
  });
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private _route: Router,
    private apiService: ApiServiceService,
    private toaster: ToastrService
  ) {}
  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';

  ngOnInit(): void {
    this.forgotPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.forgotPassForm.controls;
  }

  submit(): void {
    this.forgotPassForm.markAllAsTouched();
    this.submitted = true;

    if (this.forgotPassForm.invalid) {
      return;
    }

    const data = {
      email: this.forgotPassForm.get('email')?.value,
    };

    this.apiService.forgotPassword(data).subscribe((res) => {
      if (res.error) {
        this.toaster.error(res.error.error.message);
      } else {
        const toastRef = this.toaster.success(
          'Please check your e-mail!',
          'Success',
          {
            closeButton: true,
            tapToDismiss: false,
            timeOut: 0,
          }
        );


        toastRef.onHidden.subscribe(() => {
          this._route.navigate(['/login']);
        });
      }
    });
  }
}
