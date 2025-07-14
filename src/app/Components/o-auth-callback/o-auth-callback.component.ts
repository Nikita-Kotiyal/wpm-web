import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface AuthResponse {
  jwt: string;
  user: any;
}

@Component({
  selector: 'app-o-auth-callback',
  templateUrl: './o-auth-callback.component.html',
  styleUrls: ['./o-auth-callback.component.css']
})
export class OAuthCallbackComponent {
  public provider: string | null = null;
  public token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Get provider from route param (like 'google' or 'facebook')
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.provider = params.get('provider');
    });

    // Get access token from query param
    this.route.queryParams.subscribe(params => {
      this.token = params['access_token'] || params['id_token'] || null;

      if (this.token && this.provider) {
        this.fetchJwtAndRedirect();
      }
    });
  }

  fetchJwtAndRedirect(): void {
    const callbackURL = `http://localhost:1337/api/auth/${this.provider}/callback?access_token=${this.token}`;

    this.http.get<AuthResponse>(callbackURL).subscribe({
      next: (res: AuthResponse) => {
        localStorage.setItem('jwt', res.jwt);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('OAuth callback error:', err);
        // You can redirect to an error page or show a toast here
      }
    });
  }
}
