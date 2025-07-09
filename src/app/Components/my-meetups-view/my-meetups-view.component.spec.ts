import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMeetupsViewComponent } from './my-meetups-view.component';

describe('MyMeetupsViewComponent', () => {
  let component: MyMeetupsViewComponent;
  let fixture: ComponentFixture<MyMeetupsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyMeetupsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyMeetupsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
