import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-pop-up',
  templateUrl: './confirmation-pop-up.component.html',
  styleUrls: ['./confirmation-pop-up.component.css']
})
export class ConfirmationPopUpComponent {
  showModal = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { data: { meetup: boolean } }) { }

  ngOnInit(): void { }

  toggleModal() {
    this.showModal = this.data['data'].meetup;
  }
}
