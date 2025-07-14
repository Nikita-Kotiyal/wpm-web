import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  // static URL = "http://localhost:1337"
  static APIURL = 'http://54.186.187.165:1337/api/';
  // static APIURL = "http://localhost:1337/api/"
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
  contactUs(data: any) {
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
}
