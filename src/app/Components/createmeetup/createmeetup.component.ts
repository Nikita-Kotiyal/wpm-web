import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { LocationsComponent } from '../locations/locations.component';



@Component({
  selector: 'app-createmeetup',
  templateUrl: './createmeetup.component.html',
  styleUrls: ['./createmeetup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreatemeetupComponent {
  public allTeam = null;
  public AllSports: any = null;
  public allLeague = null;
  public AllLocations: any = null;
  public thumbnail: any = null;
  public banner: any = null;
  public user: any = null;
  ZipRegex = /^[a-zA-Z0-9\s]{0,10}$/;
  optionName: any;
  data: any = [];
  createMeetupForm: FormGroup = new FormGroup({
    copyMeetup: new FormControl(''),
    name: new FormControl(''),
    sport: new FormControl(''),
    league: new FormControl(''),
    team: new FormControl(''),
    address1: new FormControl(''),
    address2: new FormControl(''),
    streetAdd: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    postcode: new FormControl(''),
    // invitees: new FormControl(''),
    thumbnail: new FormControl(''),
    banner: new FormControl(''),
    radio: new FormControl(''),
    dateTime: new FormControl(''),
    description: new FormControl(''),
    description2: new FormControl(''),
    venueFilterCtrl: new FormControl('')
  });

  authkey: any;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "15rem",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",
    toolbarHiddenButtons: [["bold"]],
    sanitize: false,

    customClasses: [
      {
        name: "quote",
        class: "quote"
      },
      {
        name: "redText",
        class: "redText"
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1"
      }
    ]
  };
  allLeagues: any;
  allTeams: any;
  allEvents: any;
  currentUser: any;
  allUsers: any = [];

  constructor(private formBuilder: FormBuilder,
    private _router: Router,
    private apiService: ApiServiceService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.optionName = "Team";
    let auth = localStorage.getItem("jwt");
    this.authkey = auth;
    if (!auth) {
      this._router.navigate(["/login"]);
      if(this._router.url){
        localStorage.setItem("route", this._router.url);
      }
    }
    this.user = localStorage.getItem("user");
    this.currentUser = JSON.parse(this.user);
    console.log( this.currentUser);

    this.apiService.getTeam().subscribe((res: any) => {
      this.allTeams = res.data;
    })
    if (this.authkey) {
      this.apiService.getAllUsers(this.authkey).subscribe((res: any) => {
        this.allUsers = res;
      });
    }

    this.apiService.getSports().subscribe((res: any) => {
      if (res.data) {
        this.AllSports = res.data.sort((a: any, b: any) => a.attributes.name.localeCompare(b.attributes.name))
      }
    })

    this.apiService.getLeagues().subscribe((res: any) => {
      this.allLeagues = res.data;
    })
    this.apiService.getEvents().subscribe((res: any) => {
      this.allEvents = res.data;
    })

    // this.apiService.getInvitees().subscribe((res: any) => {
    //   this.AllInvitees = res.data;
    // })
    if (this.authkey) {
      this.apiService.getLocations(this.authkey).subscribe((res: any) => {
        this.AllLocations = res.data;
      })
    }
    this.createMeetupForm = this.formBuilder.group(
      {
        copyMeetup: ['', []],
        name: ['', [Validators.required]],
        sport: ['', [Validators.required]],
        league: ['', [Validators.required]],
        team: ['', [Validators.required]],
        address1: ['', [Validators.required]],
        address2: ['', []],
        streetAdd: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        postcode: ['', [Validators.required, Validators.pattern(this.ZipRegex), Validators.minLength(3)]],
        // invitees: [''],
        thumbnail: [this.thumbnail],
        banner: [this.banner],
        radio: [''],
        dateTime: ['', [Validators.required]],
        description: [''],
        description2: [''],
        venueFilterCtrl: [''],
      }
    );
  };

  getsearchLocations() {
    const dialogRef = this.dialog.open(LocationsComponent, {
    });
    dialogRef.componentInstance.onSave.subscribe(data => {
      this.data = data
      this.AllLocations = data;
      console.log( this.AllLocations.length);
      if(this.AllLocations.length == '1'){
        this.AllLocations?.filter((ele: any) => {

        this.createMeetupForm.patchValue({
          address1: ele?.attributes?.address1,
        streetAdd: ele?.attributes?.address2,
        city: ele?.attributes?.city,
        state: ele?.attributes?.state,
        postcode: ele?.attributes?.postcode,
        });
        console.log( this.createMeetupForm.value);
      })
      }else{
        this.createMeetupForm.patchValue({
          address1: '',
          streetAdd: '',
          city: '',
          state: '',
          postcode: '',
        });
      }
    })
  };
  onChangeSavedLocation(selectedVal: any) {
    if (selectedVal.target.value == "") {
      this.createMeetupForm.patchValue({
        address1: '',
        streetAdd: '',
        city: '',
        state: '',
        postcode: '',
      });
    } else {
      let result = this.AllLocations?.filter((location: any) => {
        if (location.id == selectedVal.target.value) {
          return location
        }
      });
      this.createMeetupForm.patchValue({
        address1: result[0]?.attributes?.address1,
        streetAdd: result[0]?.attributes?.address2,
        city: result[0]?.attributes?.city,
        state: result[0]?.attributes?.state,
        postcode: result[0]?.attributes?.postcode,
      });
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.createMeetupForm.controls;
  }

  submitted(): void {
    this.createMeetupForm.markAllAsTouched();
    if (this.createMeetupForm.invalid) {
      return;
    }
    if (this.createMeetupForm.get('address2')?.value == '') {
      let location = {
        address1: this.createMeetupForm.get('address1')?.value,
        address2: this.createMeetupForm.get('address2')?.value,
        postcode: this.createMeetupForm.get('postcode')?.value,
        city: this.createMeetupForm.get('city')?.value,
        state: this.createMeetupForm.get('state')?.value,
      }
      this.apiService.myLocation(this.authkey, location).subscribe((res: any) => {
        if (res.data) {
          this.createMeetupForm.patchValue({
            address2: res.data.id,
          });
          this.createMeetup();
        }
      });
    }
    if (this.createMeetupForm.get('address2')?.value) {
      this.createMeetup();
    }

  }
  createMeetup() {
    let meetupData = {
      name: this.createMeetupForm.get('name')?.value,
      sport: this.createMeetupForm.get('sport')?.value,
      league: this.createMeetupForm.get('league')?.value,
      team: this.createMeetupForm.get('team')?.value,
      // invitees: this.createMeetupForm.get('invitees')?.value,
      thumbnail: this.thumbnail,
      banner: this.banner,
      owners: this.currentUser.id,
      Attendees_Can_Connect: this.createMeetupForm.get('radio')?.value,
      start_time: this.createMeetupForm.get('dateTime')?.value,
      description: this.createMeetupForm.get('description')?.value,
      location: this.createMeetupForm.get('address2')?.value,
      what_to_bring: this.createMeetupForm.get('description2')?.value,
      //USERS_PERMISSIONS_USER: this.user
    }
    this.apiService.addMeetup(this.authkey, meetupData).subscribe((res: any) => {
      if (res.data) {
        this._router.navigate([""])
      }
    });
  }
  thumbnailUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.set("files", file)
      this.apiService.fileUpload(formData).subscribe((res: any) => {
        this.thumbnail = res[0].id;
      });
    }
  }

  bannerUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.set("files", file)
      this.apiService.fileUpload(formData).subscribe((res: any) => {
        this.banner = res[0].id;
      });
    }
  }

  onChangeSavedSports(event: any) {
    this.allTeam = null;
    this.AllSports?.filter((sport: any) => {
      if (sport.id == event.target.value) {
        this.createMeetupForm.controls['league'].setValue('');
        this.createMeetupForm.controls['team'].setValue('');
        this.allLeague = sport.attributes.leagues.data.sort((a: any, b: any) => a.attributes.name.localeCompare(b.attributes.name));
        return sport
      }
    });
  }

  onChangeSavedLeague(event: any) {
    this.allLeagues?.filter((league: any) => {
      if (league.id == event.target.value) {
        if (league.attributes.teams.data.length == 0) {
          this.optionName = 'Event';
          if (league.attributes.events.data) {
            this.allTeam = league.attributes.events.data.sort((a: any, b: any) => a.attributes.name.localeCompare(b.attributes.name));
          }
        } else {
          this.optionName = 'Team';
          if (league.attributes.teams.data) {
            this.allTeam = league.attributes.teams.data.sort((a: any, b: any) => a.attributes.name.localeCompare(b.attributes.name));
          }
        }
      }
    });
    this.createMeetupForm.controls['team'].setValue('');
  }
}

