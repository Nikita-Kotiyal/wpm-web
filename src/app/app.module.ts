import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingpageComponent } from './Components/landingpage/landingpage.component';
import { AuthNavbarComponent } from './navbars/auth-navbar/auth-navbar.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { MyaccountComponent } from './Components/myaccount/myaccount.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactUsComponent } from './Components/contact-us/contact-us.component';
import { FooterComponent } from './footers/footer/footer.component';
import { CreatemeetupComponent } from './Components/createmeetup/createmeetup.component';
import { MapComponent } from './map/map.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';
import { CardsComponent } from './Components/cards/cards.component';
import { DialogComponent } from './Components/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationPopUpComponent } from './Components/confirmation-pop-up/confirmation-pop-up.component';
import { MyMeetupsViewComponent } from './Components/my-meetups-view/my-meetups-view.component';
import { RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './Components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DdMmYYYYDatePipe } from './dd-mm-yyyy-date.pipe';
import { TruncatePipe } from './truncate.pipe';
import { EditUserDetailDialogComponent } from './Components/myaccount/edit-user-detail-dialog/edit-user-detail-dialog.component';
import { DatePipe } from '@angular/common';
import { NgxCaptchaModule } from '@binssoft/ngx-captcha';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ToastrModule } from 'ngx-toastr';
import {
  FacebookLoginProvider,
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { LocationsComponent } from './Components/locations/locations.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DataDeletionComponent } from './data-deletion/data-deletion.component';
import { SponsorComponent } from './Components/sponsor/sponsor.component';
import { PaymentSuccessComponent } from './Components/payment-success/payment-success.component';
import { EmailConfirmedComponent } from './email-confirmed/email-confirmed.component';


@NgModule({
  declarations: [
    AppComponent,
    LandingpageComponent,
    AuthNavbarComponent,
    LoginComponent,
    RegisterComponent,
    MyaccountComponent,
    ContactUsComponent,
    FooterComponent,
    CreatemeetupComponent,
    MapComponent,
    CardsComponent,
    DialogComponent,
    ConfirmationPopUpComponent,
    MyMeetupsViewComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    DdMmYYYYDatePipe,
    TruncatePipe,
    EditUserDetailDialogComponent,
    LocationsComponent,
    PrivacyPolicyComponent,
    DataDeletionComponent,
    SponsorComponent,
    PaymentSuccessComponent,
    EmailConfirmedComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularEditorModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      closeButton: false,
      timeOut: 30000,
      tapToDismiss: true,
      enableHtml: true,
    }),
    NgSelectModule,
    NgxCaptchaModule,
    GoogleMapsModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    MatPaginatorModule,
    MatTableModule,
    SocialLoginModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
  ],

  providers: [
    DatePipe,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('948723349498076'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
