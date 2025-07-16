import { Component } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent {
  cardsData: any = [];

  constructor(
    private apiService: ApiServiceService,
  ) { }

  ngOnInit(): void {
    this.apiService.getMeetupCards().subscribe((res: any) => {
      this.cardsData = res.data;
    });


  }
}
