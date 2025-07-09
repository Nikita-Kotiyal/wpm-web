
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { switchMap } from 'rxjs';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent {
  url: any = "http://54.186.187.165:1337"
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  ZipRegex = /^[a-zA-Z0-9\s]{0,10}$/;
  radio: '' | undefined;
  allMeetups: any | [] = [];
  AllSports: any = null;
  allLeague: any = null;
  allTeam: any = null;
  searchControlName: string | undefined;
  meetupSearchData: any;
  searchedData: any;
  data: any;
  searchDataId: any;
  serchedDta: any = [];
  userIP: any;
  optionName: any;

  searchForm: FormGroup = new FormGroup({
    sport: new FormControl(''),
    league: new FormControl(''),
    team: new FormControl(''),
    dateRange: new FormControl(''),
    zipCode: new FormControl(''),
    keywords: new FormControl(''),
    firstDate: new FormControl(''),
    exact: new FormControl(''),
    radio: new FormControl(''),
    saveSearch: new FormControl(''),
  })
  dataSource: any;
  allData: any;
  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  pageEvent!: PageEvent;
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  myImgUrl: any;
  allLeagues: any;
  allTeams: any;
  authkey: any;
  curretUser: any;
  allEvents: any;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ApiServiceService,
    public activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,) {
  }

  ngOnInit(): void {
    this.optionName = 'Team';
    this.authkey = localStorage.getItem("jwt");
    let user: any = localStorage.getItem("user");
    this.curretUser = JSON.parse(user);
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params['id']) {
          this.searchDataId = JSON.parse(params['id']);
        }
      });
    if (this.searchDataId) {
      if (this.authkey) {
        this.apiService.getSearchMeetup(this.authkey)
          .subscribe((res: any) => {
            this.allMeetups = res.data;
          });
      }
    }

    this.myImgUrl = '../../../assets/logo-party (1).png';
    this.apiService.getSports().subscribe((res: any) => {
      if (res.data) {
        this.AllSports = res.data.sort((a: any, b: any) => a.attributes.name.localeCompare(b.attributes.name))
      }
    });

    this.apiService.getLeagues().subscribe((res: any) => {
      this.allLeagues = res.data;

    });

    this.apiService.getTeam().subscribe((res: any) => {
      this.allTeams = res.data;
    });

    this.apiService.getEvents().subscribe((res: any) => {
      this.allEvents = res.data;
    })
    this.searchForm = this.formBuilder.group(
      {
        sport: [''],
        league: [''],
        team: [''],
        dateRange: [''],
        zipCode: ['', [Validators.pattern(this.ZipRegex), Validators.minLength(3)]],
        keywords: ['',],
        firstDate: [''],
        exact: [''],
        radio: [''],
        saveSearch: ['']
      }
    )

    this.apiService.getAllMeetups().subscribe((res: any) => {
      this.allData = res.data;
      this.allMeetups = res.data;
      this.dataSource = new MatTableDataSource<any>(res.data);
    });

    this.loadIp();

  }
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }
  loadIp() {
    this.httpClient.get('https://api.bigdatacloud.net/data/client-ip')
      .pipe(
        switchMap((value: any) => {
          this.userIP = value.ipString;
          localStorage.setItem('ip', value.ipString)
          let url = `http://ip-api.com/json/` + value.ipString
          return this.httpClient.get(url);
        })
      ).subscribe(
        (value: any) => {
          localStorage.setItem('latitude', value.lat)
          localStorage.setItem('longitude', value.lon)
        },
        err => {
        }
      );
  }
  getSearchAllMeetup() {
    this.apiService.getSearchMeetup(this.authkey)
      .subscribe((res: any) => {
        res.data.map((ele: any) => {
          if (this.searchDataId === ele.id) {
            this.serchedDta = ele
            this.patchSearchValue();
          }
        });
      })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.searchForm.controls;
  }

  getMeetupUserLocation(_data: any) {
    var poslat: any = localStorage.getItem('latitude');
    var poslng: any = localStorage.getItem('longitude');
    let miles = this.searchForm.get('radio')?.value;

    let dst = _data;
    let html: any = [];

    for (var i = 0; i < dst.length; i++) {
      if (this.distance(poslat, poslng, dst[i].attributes.location.data.attributes.lat_coord, dst[i].attributes.location.data.attributes.long_coord, "M") <= miles) {
        html[i] = dst[i];
      }
    }
    this.allMeetups.push(html);

  }

  getSearchData(): void {
    this.searchForm.markAllAsTouched();
    if (
      this.searchForm.get('firstDate')?.value == '' &&
      this.searchForm.get('sport')?.value == '' &&
      this.searchForm.get('team')?.value == '' &&
      this.searchForm.get('league')?.value == '' &&
      this.searchForm.get('zipCode')?.value == '' &&
      this.searchForm.get('sport')?.value == '' &&
      this.searchForm.get('dateRange')?.value == ''
    ) {
      this.toastr.error('Please! fill atleast one field.');
      return;
    }
    let firstDate = "filters[createdAt][$gte]=" + this.searchForm.get('firstDate')?.value + "&"
    let endDate = "filters[createdAt][$lte]=" + this.searchForm.get('dateRange')?.value + "&"
    let sport = "filters[sport][name][$eq]=" + this.searchForm.get('sport')?.value + "&"
    let team = "filters[team][name][$eq]=" + this.searchForm.get('team')?.value + "&"
    let league = "filters[league][name][$eq]=" + this.searchForm.get('league')?.value + "&"
    let postcode = "filters[location][postcode][$eq]=" + this.searchForm.get('zipCode')?.value + "&"
    // let miles = "&filters[location][postcode][$eq]=" + this.searchForm.get('radio')?.value

    this.meetupSearchData =
      "meetups?"

    if (this.searchForm.get('firstDate')?.value) {
      this.meetupSearchData = this.meetupSearchData + firstDate
    }
    if (this.searchForm.get('dateRange')?.value) {
      this.meetupSearchData = this.meetupSearchData + endDate
    } if (this.searchForm.get('sport')?.value) {
      this.meetupSearchData = this.meetupSearchData + sport
    } if (this.searchForm.get('team')?.value) {
      this.meetupSearchData = this.meetupSearchData + team
    } if (this.searchForm.get('league')?.value) {
      this.meetupSearchData = this.meetupSearchData + league
    } if (this.searchForm.get('zipCode')?.value) {
      this.meetupSearchData = this.meetupSearchData + postcode
    }

    this.apiService.getSearchedMeetup(this.meetupSearchData).subscribe((res: any) => {
      if (this.searchForm.get('radio')?.value) {
        this.getMeetupUserLocation(res.data);
      }
      this.allMeetups = res.data;
      this.data = res.data;
      if (this.searchedData == 'on') {
        let searchMeetupData = {
          league: this.searchForm.get('league')?.value,
          sport: this.searchForm.get('sport')?.value,
          team: this.searchForm.get('team')?.value,
          startTime: this.searchForm.get('firstDate')?.value,
          endTime: this.searchForm.get('dateRange')?.value,
          miles: this.searchForm.get('radio')?.value,
          latitude: localStorage.getItem('latitude'),
          longitude: localStorage.getItem('longitude'),
          ip: localStorage.getItem('ip'),
          users_permissions_user: this.curretUser.id
        }
        this.apiService.saveSearchedMeetup(searchMeetupData, this.authkey).subscribe((res: any) => {
        })
      }
    })
  }

  onItemChange(event: any) {
    this.searchedData = event.target.value;
  }
  private formatDate(date: string | number | Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  patchSearchValue() {
    let contact = {
      league: this.serchedDta.attributes['league'],
      sport: this.serchedDta.attributes['sport'],
      team: this.serchedDta.attributes['team'],
      firstDate: this.formatDate(new Date(this.serchedDta.attributes['startTime'])),
      dateRange: this.formatDate(new Date(this.serchedDta.attributes['endTime'])),
      description: this.serchedDta.attributes['description'],
      location: this.serchedDta.attributes['location'],
      radio: this.serchedDta.attributes['miles'],
    }
    this.searchForm.patchValue(contact);
    this.getSearchData();
  }
  distance(lat1: number, lon1: number, lat2: number, lon2: number, unit: string) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
  }

  meetupViewClick(meetup: any) {
    this.router.navigate(['meetup-view'], { queryParams: { id: JSON.stringify(meetup.id) } });
  };
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }
  onChangeSavedSports(event: any) {
    this.allTeam = null;
    this.AllSports?.filter((sport: any) => {
      this.searchForm.controls['league'].setValue('');
      this.searchForm.controls['team'].setValue('');
      if (sport.attributes.name == event.target.value) {
        this.allLeague = sport.attributes.leagues.data.sort((a: any, b: any) => a.attributes.name.localeCompare(b.attributes.name));
        sport;
      }
    });
  }

  onChangeSavedLeague(event: any) {
    this.allLeagues?.filter((league: any) => {
      if (league.attributes.name == event.target.value) {
        if (league.attributes.teams.data.length == 0) {
          this.optionName = 'Event';
          this.allTeam = league.attributes.events.data.sort((a: any, b: any) => a.attributes.name.localeCompare(b.attributes.name));
        } else {
          this.optionName = 'Team';
          this.allTeam = league.attributes.teams.data.sort((a: any, b: any) => a.attributes.name.localeCompare(b.attributes.name));
        }
      }
    });
    this.searchForm.controls['team'].setValue('');
  }
}
