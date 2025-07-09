import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { NgxCaptchaService } from '@binssoft/ngx-captcha';

@Component({
  selector: 'app-my-meetups-view',
  templateUrl: './my-meetups-view.component.html',
  styleUrls: ['./my-meetups-view.component.css'],
})
export class MyMeetupsViewComponent {
  emailRegex = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  authkey: any;
  viewData: any;
  myMeetups: any = [];
  viewDataId: any;
  userDetail: any;
  userData: any;
  aFormGroup: FormGroup | any;
  captchaStatus: any = '';

  captchaConfig: any = {
    type: 1,
    length: 6,
    cssClass: 'custom',
    back: {
      stroke: '#2F9688',
      solid: '#f2efd2',
      width: '20px',
    },
    font: {
      color: '#000000',
      size: '25px',
    },
  };
  messageForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    message: new FormControl(''),
  });
  constructor(
    private apiService: ApiServiceService,
    public activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private captchaService: NgxCaptchaService
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.viewDataId = JSON.parse(params['id']);
    });

    this.captchaService.captchStatus.subscribe((status) => {
      this.captchaStatus = status;
      if (status == false) {
        alert('Opps!\nCaptcha mismatch');
      } else if (status == true) {
        alert('Success!\nYou are right');
      }
    });
  }

  ngOnInit(): void {
    let user = localStorage.getItem('user') || '{}';
    this.userData = JSON.parse(user);
    console.log(this.userData);

    this.authkey = localStorage.getItem('jwt');
    this.messageForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      message: ['', [Validators.required]],
    });

    if (this.viewDataId) {
      this.getMeetUpData();
    }
    if (this.authkey) {
      this.getUserAllMeetup();
    }
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required],
    });
    if (this.authkey) {
      this.getSearchAllMeetup();
    }
  }
  get f(): { [key: string]: AbstractControl } {
    return this.messageForm.controls;
  }

  getUserAllMeetup() {
    this.apiService
      .getUserAllMeetup(this.userData.id, this.authkey)
      .subscribe((res: any) => {
        this.userDetail = res;
      });
  }

  getMeetUpData() {
    this.apiService.getAllMeetups().subscribe((res: any) => {
      this.myMeetups = res.data;
      res.data.map((ele: any) => {
        if (this.viewDataId === ele.id) {
          this.viewData = ele;
        } else {
          if (this.authkey) {
            this.getSearchAllMeetup();
          }
        }
      });
    });
  }
  getSearchAllMeetup() {
    this.apiService.getSearchMeetup(this.authkey).subscribe((res: any) => {
      res.data.map((ele: any) => {
        if (this.viewDataId === ele.id) {
          this.viewData = ele;
        }
      });
    });
  }
  addToMeetup() {
    let meetupData = {
      name: this.viewData.attributes.name,
      sport: this.viewData.attributes.sport.data.id,
      league: this.viewData.attributes.league.data.id,
      team: this.viewData.attributes.team.data.id,
      invitees: this.viewData.attributes.invitees.data.id,
      thumbnail: this.viewData.attributes.thumbnail.data.id,
      banner: this.viewData.attributes.banner.data.id,
      Attendees_Can_Connect: this.viewData.attributes.Attendees_Can_Connect,
      start_time: this.viewData.attributes.start_time,
      description: this.viewData.attributes.description,
      location: this.viewData.attributes.location.data.id,
      owners: this.userData.id,
      what_to_bring: this.viewData.attributes.what_to_bring,
    };
    this.apiService
      .addMeetup(this.authkey, meetupData)
      .subscribe((res: any) => {
        if (res.data) {
          this.router.navigate(['/myaccount']);
        }
      });
  }
  sendMessage() {
    this.messageForm.markAllAsTouched();
    let meetupData = {
      message: this.messageForm.get('message')?.value,
      meetup: this.viewDataId,
      users_permissions_user: this.userData.id,
    };
    this.apiService
      .sendMessage(this.authkey, meetupData)
      .subscribe((res: any) => {});
  }

  OpenInfowindowForMarker(index: any) {
    // google.maps.event.trigger(markers[index], 'click');
  }
}
