import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ConfirmationPopUpComponent } from '../confirmation-pop-up/confirmation-pop-up.component';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { EditUserDetailDialogComponent } from './edit-user-detail-dialog/edit-user-detail-dialog.component';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';
@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css'],
})
export class MyaccountComponent {
  showModal = false;
  myMeetups: any = [];
  userData: any;
  userDetail: any = [];
  serachedData: any = [];
  savedSearches: any = [];
  saveSearchChecked: boolean = false;
  currentUser: any;
  auth: any;
  constructor(
    private socialAuthService: SocialAuthService,
    private router: Router,
    private apiService: ApiServiceService,
    public dialog: MatDialog
  ) {}
  ngOnInit() {
   let user = localStorage.getItem("user") || "{}";
  this.userData = JSON.parse(user);
  this.auth = localStorage.getItem("jwt");
  if (!this.auth) {
    this.router.navigate(["/login"]);
  }

  this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  if (this.userData && this.userData.id) {
    this.apiService.getUserSavedSearches(this.userData.id).subscribe((res: any) => {
      // Sort by createdAt in descending order (newest first)
      this.savedSearches = res.data.sort((a: any, b: any) => {
        return new Date(b.attributes.createdAt).getTime() - new Date(a.attributes.createdAt).getTime();
      });

      this.serachedData = this.savedSearches;
      console.log('✅ Saved searches loaded:', this.savedSearches);
    });
  }

  this.getUserAllMeetup();
  this.getMeetUpData();

  }
  getMeetUpData() {
    this.apiService.getAllMeetup(this.auth).subscribe((res: any) => {
      if (res.data) {
        res.data.map((ele: any) => {
          console.log(ele?.attributes?.owners?.data[0]?.attributes?.email);
          console.log(this.userData.email, ele);
          if (ele?.attributes?.owners?.data[0]?.attributes?.email) {
            if (
              ele?.attributes?.owners?.data[0]?.attributes?.email ===
              this.userData.email
            ) {
              this.myMeetups = [...this.myMeetups, ele];
            }
          }
        });
      }
    });
  }
  getUserAllMeetup() {
    this.apiService
      .getUserAllMeetup(this.userData.id, this.auth)
      .subscribe((res: any) => {
        this.userDetail = res;
      });
  }
    getSearchAllMeetup() {
    this.serachedData = [];

    this.apiService.getSearchMeetup(this.auth).subscribe((res: any) => {
      if (res.data) {
        this.serachedData = res.data.filter((ele: any) =>
          ele?.attributes?.users_permissions_user?.data?.attributes?.email === this.userData.email
        );
      }
    });
  }


  createMeetupClick() {
    this.router.navigateByUrl('createmeetup');
  }
  confirmationDialog(meetup: any, data: any) {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      data: { data: data, meetup: meetup },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.apiService
          .deleteMeetup(data.id, this.auth)
          .subscribe((res: any) => {
            this.getMeetUpData();
          });
      }
    });
  }
  deleteSearchMeetup(meetup: any, data: any) {
    const dialogRef = this.dialog.open(ConfirmationPopUpComponent, {
      data: { data: data, meetup: meetup },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.apiService
          .deleteSearchMeetup(data.id, this.auth)
          .subscribe((res: any) => {
            this.getSearchAllMeetup();
          });
      }
    });
  }
  editMeetupDetail(data: any) {
    const dialogRef = this.dialog.open(DialogComponent, { data: data });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getMeetUpData();
      }
    });
  }
  meetupViewClick(meetup: any) {
    this.router.navigate(['meetup-view'], {
      queryParams: { id: JSON.stringify(meetup.id) },
    });
  }
  onEdit(user: any, text: any) {
    const dialogRef = this.dialog.open(EditUserDetailDialogComponent, {
      data: { user: user, role: text },
      panelClass: 'backdropBackground',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getUserAllMeetup();
      this.getMeetUpData();
    });
  }
  getRunSearchMeetup(data: any) {
    this.router.navigate([''], {
      queryParams: { id: JSON.stringify(data.id) },
    });
  }
  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}
