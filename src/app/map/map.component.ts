import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Observable, catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  apiLoaded: Observable<boolean>;
  @ViewChild(GoogleMap, { static: false })
  map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false })
  info!: MapInfoWindow;

  zoom = 12;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID]
    },
    streetViewControl: false,
    maxZoom: 15,
    minZoom: 8,
  };
  markers: any = [];
  infoContent = '';

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

  constructor(httpClient: HttpClient) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyCUffCnMgi2qrA6a5fNnVRwXCLUQ_oq5e8', 'callback')
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      );

  }

  addMarker(event: google.maps.MapMouseEvent) {
    this.markers.push({
      position: {
        lat: this.center.lat + ((Math.random() - 0.5) * 2) / 10,
        lng: this.center.lng + ((Math.random() - 0.5) * 2) / 10,
      },
      label: {
        color: 'red',
        text: 'Marker label ' + (this.markers.length + 1),
      },
      title: 'Marker title ' + (this.markers.length + 1),
      info: 'Marker info ' + (this.markers.length + 1),
      options: {
        animation: google.maps.Animation.BOUNCE,
      },
    });
  }

  openInfo(content: any) {
    this.infoContent = content;
    //   this.info.open(marker);
  }


  // constructor() { }
  // ngOnInit(): void { 

  // console.log(this.markerPositions);
  // }
  // @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  // center: google.maps.LatLngLiteral = {
  //     // lat: 24,
  //     // lng: 12

  //     lat: Number(localStorage.getItem('latitude')),
  //     lng: Number(localStorage.getItem('longitude')),
  // };
  // markerPositions: google.maps.LatLngLiteral[] = [{
  //     // lat: 24,
  //     // lng: 12

  //     lat: Number(localStorage.getItem('latitude')),
  //     lng: Number(localStorage.getItem('longitude'))
  // }];

  // zoom = 4;
  // addMarker(event: google.maps.MapMouseEvent) {
  //     if (event.latLng != null) this.markerPositions.push(event.latLng.toJSON());
  // // this.markerPositions.push({
  // //     position: {
  // //       lat: this.center.lat + ((Math.random() - 0.5) * 2) / 10,
  // //       lng: this.center.lng + ((Math.random() - 0.5) * 2) / 10,
  // //     },
  // //     label: {
  // //       color: 'red',
  // //       text: 'Marker label ' + (this.markerPositions.length + 1),
  // //     },
  // //     title: 'Marker title ' + (this.markerPositions.length + 1),
  // //     options: { animation: google.maps.Animation.BOUNCE },
  // //   });
  // }
  // openInfoWindow(marker: MapMarker) {
  //     console.log(marker);

  //     if (this.infoWindow != undefined) this.infoWindow.open(marker);
  // }
}
