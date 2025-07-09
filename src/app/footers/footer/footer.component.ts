import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  date = new Date().getFullYear();
  auth: string | null | undefined;

  ngOnInit(): void {
    this.auth = localStorage.getItem("jwt");
  }
}
