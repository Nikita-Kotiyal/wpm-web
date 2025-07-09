import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiServiceService } from 'src/app/Services/api-service.service';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  authkey: any;
  public thumbnail: any = null;
  public banner: any = null;
  public allLocations: any = null;
  allSports: any;
  allLeague: any;
  allTeam: any;
  showModal = true;
  selectedSport: any;
  updateMeetup: any;
  imageURL: any[] = [];
  bannerImageURL: any[] = [];

  editForm: FormGroup = new FormGroup({
    eventName: new FormControl(''),
    OtherThree: new FormControl(''),
    location: new FormControl(''),
    copyMeetup: new FormControl(''),
    sport: new FormControl(''),
    league: new FormControl(''),
    team: new FormControl(''),
    OtherOne: new FormControl(''),
    OtherTwo: new FormControl(''),
    suggestedLocation: new FormControl(''),
    streetAdd: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    zip: new FormControl(''),
    attend: new FormControl(''),
    choose: new FormControl(''),
    upload: new FormControl(''),
    thumbnail: new FormControl(''),
    banner: new FormControl(''),
    chooseOne: new FormControl(''),
    uploadOne: new FormControl(''),
    radio: new FormControl('')

  });
  imagePath: any;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiServiceService,
    private formBuilder: FormBuilder,) {
  }

  ngOnInit(): void {
    this.authkey = localStorage.getItem('jwt');
    if (this.data) {
      this.setDefault();
    }
    this.updateMeetup = this.data.id;
    this.apiService.getTeam().subscribe((res: any) => {
      this.allTeam = res.data;
    });
    this.apiService.getLeagues().subscribe((res: any) => {
      this.allLeague = res.data;
    });
    this.apiService.getSports().subscribe((res: any) => {
      this.allSports = res.data;
    });
    this.apiService.getLocations(this.authkey).subscribe((res: any) => {
      this.allLocations = res.data;
    })
    // this.imageURL.push(this.data.attributes['thumbnail'].data.attributes.url)
    // this.bannerImageURL.push(this.data.attributes['thumbnail'].data.attributes.url)
    return;

  }

  onSportChanged(event: any) {
    this.apiService.getSports().subscribe((res: any) => {
      this.allSports = res.data;
      this.allSports.map((ele: any) => {
        const selectedSport = ele['attributes'].name == event.target.value;
      });
    });
  }

  setDefault() {
    let contact = {
      copyMeetup: this.data.attributes['name'],
      eventName: this.data.attributes.name,
      sport: this.data.attributes.sport.data.id,
      league: this.data.attributes.league.data.id,
      team: this.data.attributes.team.data.id,
      OtherOne: 'OtherOne',
      OtherTwo: 'OtherTwo',
      OtherThree: 'OtherThree',
      location: this.data.attributes.location.data.attributes.address1,
      suggestedLocation: this.data.attributes.location.data.id,
      streetAdd: this.data.attributes.location.data.attributes.address2,
      city: this.data.attributes.location.data.attributes.city,
      state: this.data.attributes.location.data.attributes.state,
      zip: this.data.attributes.location.data.attributes.zip,
      // thumbnail: this.data.attributes.thumbnail.data.attributes.url,
      // attend: this.data.attributes['name'],
      // banner: '',
    };
    this.editForm.patchValue(contact);
  }

  // toggleModal() {
  //   this.editForm = this.formBuilder.group(
  //     {
  //       eventName: ['',],
  //       OtherThree: [''],
  //       copyMeetup: [''],
  //       sport: [''],
  //       league: [''],
  //       team: [''],
  //       OtherOne: [''],
  //       OtherTwo: [''],
  //       location: [''],
  //       suggestedLocation: [''],
  //       streetAdd: [''],
  //       city: [''],
  //       state: [''],
  //       zip: [''],
  //       attend: [''],
  //       thumbnail: [''],
  //       banner: ['',],
  //       radio: ['',]
  //     }
  //   );
  // }
  get f(): { [key: string]: AbstractControl } {
    return this.editForm.controls;
  }

  onChangeSavedLocation(selectedVal: any) {
    if (selectedVal.target.value == "") {
      this.editForm.patchValue({
        location: '',
        streetAdd: '',
        city: '',
        state: '',
        zip: '',

      });
    } else {
      let result = this.allLocations?.filter((location: any) => {
        if (location.id == selectedVal.target.value) {
          return location
        }
      });

      this.editForm.patchValue({
        location: result[0].attributes.address1,
        streetAdd: result[0].attributes.address2,
        city: result[0].attributes.city,
        state: result[0].attributes.state,
        zip: result[0].attributes.zip,
      });
    }
  }
  submitted(): void {
    this.editForm.markAllAsTouched();
    if (this.editForm.invalid) {
      return;
    }
    let meetupData = {
      copyMeetup: this.editForm.get('copyMeetup')?.value,
      name: this.editForm.get('eventName')?.value,
      sport: this.editForm.get('sport')?.value,
      league: this.editForm.get('league')?.value,
      team: this.editForm.get('team')?.value,
      OtherOne: this.editForm.get('OtherOne')?.value,
      OtherTwo: this.editForm.get('OtherTwo')?.value,
      OtherThree: this.editForm.get('OtherThree')?.value,
      locations: this.editForm.get('suggestedLocation')?.value,
      attend: this.editForm.get('attend')?.value,
      thumbnail: this.thumbnail,
      banner: this.banner,
    }
    this.apiService.updateMeetup(this.authkey, meetupData, this.updateMeetup).subscribe((res: any) => {
      this.dialogRef.close(true);
    })
  }

  thumbnailUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.set("files", file)
      this.apiService.fileUpload(formData).subscribe((res: any) => {
        this.thumbnail = res[0].id;
        this.imageURL.push(res[0].url);
      })
    }
  }
  removeSelectedFile(index: any) {
    this.imageURL.splice(index, 1);
  }
  bannerUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.set("files", file)
      this.apiService.fileUpload(formData).subscribe((res: any) => {
        this.banner = res[0].id;
        this.bannerImageURL.push(res[0].url);
      })
    }
  }
  removeSelectedBannerFile(index: any) {
    this.bannerImageURL.splice(index, 1);
  }
  closeModal() {
    this.dialogRef.close(false);
  }
}
