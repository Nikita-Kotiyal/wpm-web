import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactUsComponent } from './Components/contact-us/contact-us.component';
import { CreatemeetupComponent } from './Components/createmeetup/createmeetup.component';
import { LandingpageComponent } from './Components/landingpage/landingpage.component';
import { LoginComponent } from './Components/login/login.component';
import { MyaccountComponent } from './Components/myaccount/myaccount.component';
import { RegisterComponent } from './Components/register/register.component';
import { MyMeetupsViewComponent } from './Components/my-meetups-view/my-meetups-view.component';
import { ForgotPasswordComponent } from './Components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DataDeletionComponent } from './data-deletion/data-deletion.component';
import { OAuthCallbackComponent } from './Components/o-auth-callback/o-auth-callback.component';
import { SponsorComponent } from './Components/sponsor/sponsor.component';
import { PaymentSuccessComponent } from './Components/payment-success/payment-success.component';
import { EmailConfirmedComponent } from './email-confirmed/email-confirmed.component';

const routes: Routes = [
  { path: '', component: LandingpageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'myaccount', component: MyaccountComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'createmeetup', component: CreatemeetupComponent },
  { path: 'meetup-view', component: MyMeetupsViewComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'data-deletion', component: DataDeletionComponent },
  { path: 'sponsor', component: SponsorComponent },
  { path: 'payment-success', component: PaymentSuccessComponent }, // Show payment success page
  { path: 'cancel', component: SponsorComponent }, // Redirect back to sponsor page if canceled
    { path: 'email-confirmed', component: EmailConfirmedComponent },
  {
    path: 'auth/:provider/callback',
    component: OAuthCallbackComponent, // ✅ Already set up
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
