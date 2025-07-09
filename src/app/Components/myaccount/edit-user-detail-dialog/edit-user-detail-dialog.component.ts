import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import Validation from 'src/app/Utlis/validation/validation.component';

@Component({
  selector: 'app-edit-user-detail-dialog',
  templateUrl: './edit-user-detail-dialog.component.html',
  styleUrls: ['./edit-user-detail-dialog.component.css']
})
export class EditUserDetailDialogComponent {
  authkey: any;
  updateUser: any;
  constructor(
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditUserDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiServiceService,
    private toastr: ToastrService,) {
  }

  emailRegex = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  passwordRegex = "^(?=.{8,})((?=.*[^a-zA-Z\s])(?=.*[a-z])(?=.*[A-Z])| (?=.*[^a-zA-Z0-9\s])(?=.*\d)(?=.*[a-zA-Z])).*$";

  editForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    address1: new FormControl(''),
    address2: new FormControl(''),
    streetAdd: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    education: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    recent_password: new FormControl(''),
    re_password: new FormControl('')
  });

  ngOnInit(): void {
    this.authkey = localStorage.getItem("jwt")
    this.updateUser = this.data?.user?.id
    this.editForm = this.formBuilder.group({
      email: ['', [Validators.pattern(this.emailRegex)]],
      password: ['', [Validators.pattern(this.passwordRegex)]],
      recent_password: ['', [Validators.pattern(this.passwordRegex)]],
      re_password: [''],
      name: [''],
      address1: [''],
      address2: [''],
      streetAdd: [''],
      city: [''],
      state: [''],
      education: [''],
    },
      {
        validators: [Validation.match('password', 're_password')]
      });
    this.patchUserDetailValue();
  };

  get f(): { [key: string]: AbstractControl } {
    return this.editForm.controls;
  }

  closeModal() {
    this.dialogRef.close();
  }

  patchUserDetailValue() {
    let contact = {
      name: this.data?.user?.name,
      address1: this.data?.user?.location?.address1,
      streetAdd: this.data?.user?.location?.address2,
      city: this.data?.user?.location?.city,
      state: this.data?.user?.location?.state,
      education: this.data?.user?.education,
      email: this.data?.user?.email,
    };
    this.editForm.patchValue(contact);
  }

  updateUserDetail() {
    if (this.data?.role == 'password') {
      let meetupData = {
        currentPassword: this.editForm.get('recent_password')?.value,
        password: this.editForm.get('password')?.value,
        passwordConfirmation: this.editForm.get('re_password')?.value
      }
      this.apiService.changePassword(meetupData, this.authkey).subscribe((res: any) => {
        if (res.error) {
          this.toastr.error(res.error.error.message)
        } else {
          localStorage.setItem("user", JSON.stringify(res));
          this.dialogRef.close();
        }
      });
    }
    if (this.data?.role == 'email') {
      let meetupData = { email: this.editForm.get('email')?.value }
      this.apiService.updateUserDetail(this.authkey, meetupData, this.updateUser).subscribe((res: any) => {
        if (res) {
          localStorage.setItem("user", JSON.stringify(res));
          this.dialogRef.close();
        }
      });
    }
    if (this.data?.role == 'userDetail') {
      if (this.editForm.get('address2')?.value == '') {
        let location = {
          address1: this.editForm.get('address1')?.value,
          address2: this.editForm.get('streetAdd')?.value,
          postcode: this.editForm.get('postcode')?.value,
          city: this.editForm.get('city')?.value,
          state: this.editForm.get('state')?.value,
        }
        this.apiService.myLocation(this.authkey, location).subscribe((res: any) => {
          if (res.data) {
            this.editForm.patchValue({
              address2: res.data.id,
            });
            this.updateUserAddress();
          }
        });
      }
      if (this.editForm.get('address2')?.value) {
        this.updateUserAddress();
      }
    }
  }

  updateUserAddress() {
    console.log(this.editForm.get('name')?.value);
    
    let meetupData = {
      name: this.editForm.get('name')?.value,
      location: this.editForm.get('address2')?.value,
      education: this.editForm.get('education')?.value,
    }
    this.apiService.updateUserDetail(this.authkey, meetupData, this.updateUser).subscribe((res: any) => {
      if (res) {
        localStorage.setItem("user", JSON.stringify(res));
        this.dialogRef.close();
      }
    });
  }
}
