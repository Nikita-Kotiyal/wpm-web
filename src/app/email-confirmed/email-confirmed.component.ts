import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-email-confirmed',
  templateUrl: './email-confirmed.component.html',
  styleUrls: ['./email-confirmed.component.css'],
})
export class EmailConfirmedComponent {
  constructor(private toastr: ToastrService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('confirmation');

    console.log('Confirmation token:', token); // ✅ Debug

    if (token && token.trim() !== '') {
      this.toastr.success('✅ Email has been confirmed!');
    }
    // else {
    //   this.toastr.error('❌ Invalid confirmation link.');
    // }
  }
}
