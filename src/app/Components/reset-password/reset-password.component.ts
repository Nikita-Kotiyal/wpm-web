import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Validation from 'src/app/Utlis/validation/validation.component';
import { Location } from '@angular/common';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  date = new Date().getFullYear();
  submitted = false;
  authKey: any;
  resetPassForm: FormGroup = new FormGroup({
    password: new FormControl(''),
    re_password: new FormControl(''),
  })

  constructor(
    private formBuilder: FormBuilder,
    private _location: Location,
    private apiService: ApiServiceService,
    private _router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService) { }
 
    passwordRegex = "^(?=.{8,})((?=.*[^a-zA-Z\s])(?=.*[a-z])(?=.*[A-Z])| (?=.*[^a-zA-Z0-9\s])(?=.*\d)(?=.*[a-zA-Z])).*$";

  ngOnInit(): void {
    this.authKey = localStorage.getItem("jwt");
    this.resetPassForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern(this.passwordRegex)]],
      re_password: ['', Validators.required],
    },
      {
        validators: [Validation.match('password', 're_password')]
      });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.resetPassForm.controls;
  }
  submit(): void {
    this.resetPassForm.markAllAsTouched();
    this.submitted = true;
    if (this.resetPassForm.invalid) {
      return;
    }
    let data = {
      code: this.route.snapshot.queryParams['code'],
      password: this.resetPassForm.get('password')?.value,
      passwordConfirmation: this.resetPassForm.get('re_password')?.value
    }
    this.apiService.resetPassword(data).subscribe(res => {
      if (res.error) {
        this.toastr.error(res.error.error.message);
      } else {
        localStorage.setItem("jwt", res.jwt)
        localStorage.setItem("user", JSON.stringify(res.user))
        this._router.navigate([""])
      }
    })
  }

  backClicked() {
    this._location.back();
  }
}


