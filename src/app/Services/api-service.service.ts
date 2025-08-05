import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
// import { Observable } from 'rxjs';

export interface SponsorPayload {
  fullName: string;
  Email: string;
  Amount: number;
  Note?: string;
  transactionId: string;
  paymentStatus: string;
}
@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  // static APIURL = "http://localhost:1337"
  static APIURL = 'https://api.watchpartymeetup.com/api/';
  // static APIURL = 'http://localhost:1337/api/';
  // static APIURL = 'http://54.186.187.165:1337/api/';
  private appmod = '';
  constructor(protected http: HttpClient, protected router: Router) {
    this.appmod = 'login';
  }

  loginUser(data: any) {
    this.appmod = 'auth/local?populate=*';
    return this.http
      .post<any>(
        ApiServiceService.APIURL + this.appmod,
        {
          identifier: data.identifier,
          password: data.password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          params: { type: 'main' },
        }
      )
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }
  changePassword(data: any, session: any) {
    this.appmod = 'auth/change-password';
    return this.http
      .post<any>(
        ApiServiceService.APIURL + this.appmod,
        {
          currentPassword: data.currentPassword,
          password: data.password,
          passwordConfirmation: data.passwordConfirmation,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + session,
          },
          params: { type: 'main' },
        }
      )
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }

  forgotPassword(data: any) {
    this.appmod = 'auth/forgot-password';
    return this.http
      .post<any>(
        ApiServiceService.APIURL + this.appmod,
        {
          email: data.email,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          params: { type: 'main' },
        }
      )
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }
  resetPassword(data: any) {
    this.appmod = 'auth/reset-password';
    return this.http
      .post<any>(
        ApiServiceService.APIURL + this.appmod,
        {
          code: data.code,
          password: data.password,
          passwordConfirmation: data.passwordConfirmation,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          params: { type: 'main' },
        }
      )
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }

  signupUser(data: any) {
    this.appmod = 'auth/local/register';
    return this.http
      .post<any>(
        ApiServiceService.APIURL + this.appmod,
        {
          password: data.password,
          email: data.email,
          username: data.email,
          name: data.name,
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }
  getTeam() {
    this.appmod = 'teams';
    return this.http
      .get<any>(ApiServiceService.APIURL + this.appmod, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }

  // updateTeam(data: any) {
  //   this.appmod = "teams";
  //   return this.http.patch<any>(ApiServiceService.APIURL + this.appmod, data, { headers: { "Content-Type": "application/json" } });
  // }

  getSports() {
    this.appmod = 'sports?populate=*';
    return this.http
      .get<any>(ApiServiceService.APIURL + this.appmod, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }

  getLeagues() {
    this.appmod = 'leagues?populate=*';
    return this.http
      .get<any>(ApiServiceService.APIURL + this.appmod, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }
  getAffiliations() {
    this.appmod = 'affiliations';
    return this.http
      .get<any>(ApiServiceService.APIURL + this.appmod, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }
  getEvents() {
    this.appmod = 'events?populate=*';
    return this.http
      .get<any>(ApiServiceService.APIURL + this.appmod, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }

  // getInvitees() {
  //   this.appmod = "invitees";
  //   return this.http.get<any>(ApiServiceService.APIURL + this.appmod, { headers: { "Content-Type": "application/json" } });
  // }

  //suggested-locations
  getLocations(session: any) {
    this.appmod = 'locations';
    return this.http
      .get<any>(ApiServiceService.APIURL + this.appmod, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session,
        },
        params: { type: 'main' },
      })
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }
  //suggested-locations
  getSearchedLocations(session: any, data: any) {
    this.appmod = data + 'populate=*';
    return this.http
      .get<any>(ApiServiceService.APIURL + this.appmod, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session,
        },
        params: { type: 'main' },
      })
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }
  sendMessage(session: string, data: any) {
    this.appmod = 'messages';
    return this.http
      .post<any>(
        ApiServiceService.APIURL + this.appmod,
        { data: data },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + session,
          },
        }
      )
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }

  addMeetup(session: string, data: any) {
    this.appmod = 'meetups';
    return this.http
      .post<any>(
        ApiServiceService.APIURL + this.appmod,
        { data: data },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + session,
          },
        }
      )
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }
  updateMeetup(session: string, data: any, id: any) {
    this.appmod = 'meetups/' + id;
    return this.http
      .put<any>(
        ApiServiceService.APIURL + this.appmod,
        { data: data },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + session,
          },
        }
      )
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }

  getSearchedMeetup(data: any) {
    this.appmod = data + 'populate=*';
    return this.http
      .get<any>(ApiServiceService.APIURL + this.appmod, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }

  getAllMeetup(session: string): Observable<any> {
    this.appmod = 'meetups?populate=*&sort[0]=createdAt:desc';
    return this.http
      .get<any>(ApiServiceService.APIURL + this.appmod, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session,
        },
      })
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }

  getAllMeetups(): Observable<any> {
    this.appmod = 'meetups?populate=*&sort[0]=createdAt:desc';
    return this.http
      .get<any>(ApiServiceService.APIURL + this.appmod, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }

  deleteMeetup(id: any, session: string) {
    this.appmod = 'meetups/' + id;
    return this.http
      .delete<any>(ApiServiceService.APIURL + this.appmod, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session,
        },
      })
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }

  getUserAllMeetup(data: any, session: any) {
    this.appmod = 'users/' + data + '?populate=*';
    return this.http
      .get<any>(ApiServiceService.APIURL + this.appmod, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session,
        },
      })
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }
  getAllUsers(session: any) {
    this.appmod = 'users';
    return this.http
      .get<any>(ApiServiceService.APIURL + this.appmod, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session,
        },
      })
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }
  updateUserDetail(session: string, data: any, id: any) {
    this.appmod = 'users/' + id;
    return this.http
      .put<any>(
        ApiServiceService.APIURL + this.appmod,
        {
          name: data.name,
          location: data.location,
          education: data.education,
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + session,
          },
        }
      )
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }
  myLocation(session: string, data: any) {
    this.appmod = 'locations';
    return this.http
      .post<any>(
        ApiServiceService.APIURL + this.appmod,
        {
          data: data,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + session,
          },
        }
      )
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }

  fileUpload(file: FormData) {
    return this.http.post<any>(ApiServiceService.APIURL + 'upload', file).pipe(
      tap((data) => data),
      catchError(async (error) => error)
    );
  }

  saveSearchedMeetup(data: any, session: string) {
    this.appmod = 'search-meetups';
    return this.http
      .post<any>(
        ApiServiceService.APIURL + this.appmod,
        { data: data },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + session,
          },
        }
      )
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }
  getSearchMeetup(session: string) {
    this.appmod = 'search-meetups?populate=*';
    return this.http
      .get<any>(ApiServiceService.APIURL + this.appmod, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session,
        },
      })
      .pipe(
        catchError((error) => {
          if (error.status === 401 || error.status === 403) {
            // handle error
          }
          return throwError(error);
        })
      );
  }
  deleteSearchMeetup(id: any, session: string) {
    this.appmod = 'search-meetups/' + id;
    return this.http
      .delete<any>(ApiServiceService.APIURL + this.appmod, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session,
        },
      })
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }
  getMeetupCards() {
    this.appmod = 'blogs?populate=*';
    return this.http
      .get<any>(ApiServiceService.APIURL + this.appmod, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ',
        },
      })
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }

  getHomes(session: any) {
    this.appmod = 'homes';
    return this.http
      .get<any>(ApiServiceService.APIURL + this.appmod, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session,
        },
      })
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }

  contactUs(data: any) {
     alert('Inside contactUs');
    this.appmod = 'contact-uses';
    return this.http
      .post<any>(
        ApiServiceService.APIURL + this.appmod,
        { data: data },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .pipe(
        tap((data) => data),
        catchError(async (error) => error)
      );
  }

  getUserSavedSearches(userId: number): Observable<any> {
    this.appmod = `search-meetups?filters[users_permissions_user][id][$eq]=${userId}&populate=*`;
    return this.http.get(ApiServiceService.APIURL + this.appmod, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    });
  }

  getAllProducts(): Observable<any> {
    this.appmod = 'stripe/products';
    return this.http.get<any>(ApiServiceService.APIURL + this.appmod).pipe(
      catchError((error) => {
        console.error('Error fetching products:', error);
        return throwError(() => error);
      })
    );
  }

  getProductById(productId: string): Observable<any> {
    // Try the direct products endpoint first
    this.appmod = `products/${productId}`;
    return this.http.get<any>(ApiServiceService.APIURL + this.appmod).pipe(
      catchError((error) => {
        console.log('Trying fallback endpoint for product');
        // If that fails, try the stripe/products endpoint
        this.appmod = `stripe/products/${productId}`;
        return this.http.get<any>(ApiServiceService.APIURL + this.appmod);
      }),
      catchError((error) => {
        console.error('Error fetching product from both endpoints:', error);
        return throwError(() => error);
      })
    );
  }

  getStripeProduct(stripeProductId: string): Observable<any> {
    this.appmod = `stripe/products/${stripeProductId}`;
    return this.http.get<any>(ApiServiceService.APIURL + this.appmod).pipe(
      catchError((error) => {
        console.error('Error fetching Stripe product:', error);
        return throwError(() => error);
      })
    );
  }

  createPaymentIntent(paymentData: any): Observable<any> {
    this.appmod = 'payments/create-intent';
    return this.http
      .post<any>(ApiServiceService.APIURL + this.appmod, paymentData, {
        headers: {
          'Content-Type': 'application/json',
          // No authorization header - public access
        },
      })
      .pipe(
        map((response) => {
          console.log('Payment intent response:', response);
          return response;
        }),
        catchError((error) => {
          console.error('Payment intent error:', error);
          return throwError(() => error);
        })
      );
  }

  submitSponsor(payload: SponsorPayload): Observable<any> {
    this.appmod = 'sponsors';

    return this.http
      .post(
        ApiServiceService.APIURL + this.appmod,
        { data: payload },
        {
          headers: {
            'Content-Type': 'application/json',
            // No authorization header - public access
          },
        }
      )
      .pipe(
        tap((data) => data),
        catchError((error) => {
          console.error('Error submitting sponsor:', error);
          return throwError(error);
        })
      );
  }

  updateSponsor(payload: {
    id: string;
    transactionId: string;
    paymentStatus: string;
  }): Observable<any> {
    this.appmod = `sponsors/${payload.id}`;

    return this.http
      .put(
        ApiServiceService.APIURL + this.appmod,
        {
          data: {
            transactionId: payload.transactionId,
            paymentStatus: payload.paymentStatus,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            // No authorization header - public access
          },
        }
      )
      .pipe(
        tap((data) => data),
        catchError((error) => {
          console.error('Error updating sponsor:', error);
          return throwError(error);
        })
      );
  }

  getTopHomeAd() {
    this.appmod = 'home-tops';
    return this.http.get<any>(
      ApiServiceService.APIURL + this.appmod + '?populate=*',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ',
        },
      }
    );
  }

   getMidHomeAd() {
    this.appmod = 'home-mids';
    return this.http.get<any>(
      ApiServiceService.APIURL + this.appmod + '?populate=*',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ',
        },
      }
    );
  }
}
