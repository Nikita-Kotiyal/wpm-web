import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatemeetupComponent } from './createmeetup.component';

describe('CreatemeetupComponent', () => {
  let component: CreatemeetupComponent;
  let fixture: ComponentFixture<CreatemeetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatemeetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatemeetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
