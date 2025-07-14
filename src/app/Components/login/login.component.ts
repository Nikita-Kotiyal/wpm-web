import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  date = new Date().getFullYear();
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  authkey: any;
  userId: any;
  currentUser: any;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _router: Router,
    private apiService: ApiServiceService
  ) {}

  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  passwordRegex =
    '^(?=.{8,})((?=.*[^a-zA-Zs])(?=.*[a-z])(?=.*[A-Z])| (?=.*[^a-zA-Z0-9s])(?=.*d)(?=.*[a-zA-Z])).*$';

  ngOnInit(): void {
    let auth = localStorage.getItem('jwt');
    if (auth) {
      this.authkey = auth;
      this._router.navigate(['']);
      if (this._router.url) {
        localStorage.removeItem('route');
      }
    }
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      password: [
        '',
        [Validators.required, Validators.pattern(this.passwordRegex)],
      ],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  submitted(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }
    let data = {
      identifier: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };
    this.apiService.loginUser(data).subscribe((res) => {
      if (res.error) {
        this.toastr.error(
          'You must validate your Email address and Password before logging in'
        );
      } else {
        this.currentUser = res.user;
        localStorage.setItem('jwt', res.jwt);
        localStorage.setItem('user', JSON.stringify(res.user));
        console.log(localStorage.getItem('route'));

        if (localStorage.getItem('route')) {
          this._router.navigate([localStorage.getItem('route')]);
          localStorage.removeItem('route');
        } else {
          this._router.navigate(['']);
        }
      }
    });
  }

  signInWithGoogle() {
    window.location.href = 'http://localhost:1337/api/connect/google'; // ✅ Use your backend URL
  }
 signInWithFacebook(): void {
  window.location.href = 'http://localhost:1337/api/connect/facebook';
}

}
