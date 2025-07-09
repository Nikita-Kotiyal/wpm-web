// import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { ToastrService } from 'ngx-toastr';
import { NgxCaptchaService } from '@binssoft/ngx-captcha';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
})
export class ContactUsComponent {
  authkey: any;
  captchaStatus: any = '';
  captchaConfig: any = {
    type: 1,
    length: 6,
    cssClass: 'custom',
    font: {
      color: '#000000',
      size: '30px',
    },
    back: {
      stroke: '#2F9688',
      solid: '#f2efd2',
      width: '6px',
    },
  };

  contactUsForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    name: new FormControl(''),
    Subject: new FormControl(''),
    message: new FormControl(''),
  });
  curretUser: any;
  constructor(
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    private apiService: ApiServiceService,
    private _router: Router,
    private captchaService: NgxCaptchaService
  ) {
    this.captchaService.captchStatus.subscribe((status) => {
      this.captchaStatus = status;
      if (status == false) {
        alert('Opps!\nCaptcha mismatch');
      } else if (status == true) {
        alert('Success!\nYou are right');
      }
    });
  }

  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  nameRegex = '^[a-zA-Z ]*$';

  ngOnInit(): void {
    let auth = localStorage.getItem('jwt');
    this.authkey = auth;
    let user: any = localStorage.getItem('user');
    this.curretUser = JSON.parse(user);
    this.contactUsForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(this.nameRegex)]],
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      Subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
      recaptcha: ['', Validators.required],
    });

    if (this.curretUser) {
      this.patchValues();
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.contactUsForm.controls;
  }
  patchValues() {
    let contact = {
      email: this.curretUser.email,
      name: this.curretUser.name,
    };
    this.contactUsForm.patchValue(contact);
  }

  submitted(): void {
    this.contactUsForm.markAllAsTouched();
    const data = {
      email: this.contactUsForm.get('email')?.value,
      name: this.contactUsForm.get('name')?.value,
      subject: this.contactUsForm.get('Subject')?.value,
      message: this.contactUsForm.get('message')?.value,
    };

    this.apiService.contactUs(data).subscribe((res) => {
      if (res.data) {
        if (res.error) {
          this.toaster.error(res.error.error.message);
        } else {
          const userName = this.contactUsForm.get('name')?.value;
          this.toaster.success(
            `Thank you for reaching out, ${userName}! Your message has been sent successfully.`
          );
        }
        this._router.navigate(['']);
      }
    });
  }
}
