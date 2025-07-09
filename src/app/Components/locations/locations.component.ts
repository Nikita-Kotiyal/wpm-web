import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent {
  meetupSearchData: any;
  authkey: any;
  onSave = new EventEmitter();
  locationForm: FormGroup = new FormGroup({
    streetAdd: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    address2: new FormControl(''),
    postcode: new FormControl(''),
  })

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<LocationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private apiService: ApiServiceService,) {
  }

  ngOnInit(): void {
    this.authkey = localStorage.getItem("jwt");
    this.locationForm = this.formBuilder.group({
      address1: [''],
      streetAdd: [''],
      city: [''],
      state: [''],
      postcode: [''],
    });
  };
  closeModal() {
    this.dialogRef.close();
  }
  async updateSearchedlocationDetail() {
    if (
      this.locationForm.get('address1')?.value == '' &&
      this.locationForm.get('streetAdd')?.value == '' &&
      this.locationForm.get('city')?.value == '' &&
      this.locationForm.get('state')?.value == '' &&
      this.locationForm.get('postcode')?.value == ''
    ) {
      this.toastr.error('Please! fill atleast one field.');
      return;
    }
    let address1 = "filters[address1][$eq]=" + this.locationForm.get('address1')?.value + "&"
    let address2 = "filters[address2][$eq]=" + this.locationForm.get('streetAdd')?.value + "&"
    let city = "filters[city][$eq]=" + this.locationForm.get('city')?.value + "&"
    let postcode = "filters[postcode][$eq]=" + this.locationForm.get('postcode')?.value + "&"
    let state = "filters[state][$eq]=" + this.locationForm.get('state')?.value + "&"
    this.meetupSearchData =
      "locations?"

    if (this.locationForm.get('address1')?.value) {
      this.meetupSearchData = this.meetupSearchData + address1
    } if (this.locationForm.get('streetAdd')?.value) {
      this.meetupSearchData = this.meetupSearchData + address2
    } if (this.locationForm.get('city')?.value) {
      this.meetupSearchData = this.meetupSearchData + city
    } if (this.locationForm.get('postcode')?.value) {
      this.meetupSearchData = this.meetupSearchData + postcode
    } if (this.locationForm.get('state')?.value) {
      this.meetupSearchData = this.meetupSearchData + state
    }

    this.apiService.getSearchedLocations(this.authkey, this.meetupSearchData).subscribe((res: any) => {
      if (res.data.length >= 1) {
        this.dialogRef.close();
        this.data = res.data;
        this.onSave.emit(this.data)
      } else {
        this.toastr.warning('Searched Location not Available.');
      }
    })
  }
}
