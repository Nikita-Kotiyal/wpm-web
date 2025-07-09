import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-navbar',
  templateUrl: './auth-navbar.component.html',
  styleUrls: ['./auth-navbar.component.css']
})
export class AuthNavbarComponent {
  showMenu = false;
  auth: string | null = null;

  constructor(private _router: Router) { }

  ngOnInit(): void {
    this.auth = localStorage.getItem("jwt");
  }
  toggleNavbar() {
    this.showMenu = !this.showMenu;
  }

  logout() {
    window.location.replace('');
    this._router.navigate([''])
    localStorage.clear();
  }
}
