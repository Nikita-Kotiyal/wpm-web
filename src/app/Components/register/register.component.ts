import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import Validation from 'src/app/Utlis/validation/validation.component';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
// import axios from 'axios';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  // emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  passwordRegex =
    '^(?=.{8,})((?=.*[^a-zA-Zs])(?=.*[a-z])(?=.*[A-Z])| (?=.*[^a-zA-Z0-9s])(?=.*d)(?=.*[a-zA-Z])).*$';
  date = new Date().getFullYear();
  registerForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    re_password: new FormControl(''),
    // agreeTerm: new FormControl(''),
  });

  submitted = false;
  authkey: any;

  constructor(
    private formBuilder: FormBuilder,
    private _location: Location,
    private toastr: ToastrService,
    private _router: Router,
    private apiService: ApiServiceService
  ) {}

  ngOnInit(): void {
    let auth = localStorage.getItem('jwt');
    if (auth) {
      this.authkey = auth;
      this._router.navigate(['']);
    }

    this.registerForm = this.formBuilder.group(
      {
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
        password: [
          '',
          [Validators.required, Validators.pattern(this.passwordRegex)],
        ],
        re_password: ['', Validators.required],
        // agreeTerm: [false, Validators.requiredTrue]
      },
      {
        validators: [Validation.match('password', 're_password')],
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  submitForm(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid) {
      return;
    }

    let data = {
      name: this.registerForm.get('username')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
    };
    this.apiService.signupUser(data).subscribe((res) => {
      if (res.error) {
        this.toastr.error(res.error.error.message);
      } else {
        this.toastr.success(
          'An email was just sent to you for account confirmation. Please confirm your email address by clicking the link in the email.'
        );
        this._router.navigate(['/login']);
      }
    });
  }
  backClicked() {
    this._location.back();
  }
  signInWithGoogle() {
    window.location.href = 'http://localhost:1337/api/connect/google';
  }
}
