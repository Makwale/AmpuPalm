import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { LoadingController } from '@ionic/angular';
import { MapboxStyleSwitcherControl } from 'mapbox-gl-style-switcher';
import { AngularFirestore } from '@angular/fire/firestore';
declare let mapboxgl: any;
// eslint-disable-next-line @typescript-eslint/naming-convention
declare let MapboxDirections;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  map;
  loading;
  marker;
  direction;
  id;
  busMarker: any;
  watchId;
  constructor(
    private ts: TrackingService,
    private dbs: DatabaseService,
    public loadingController: LoadingController,
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore) {

  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFudWVsbWFrd2FsZSIsImEiOiJja2hsc3lmYWUyZzRnMnRsNnY2NWIyeGR6In0.1MGnfpXj_dV2QBO3SchfqA';

    this.map = new mapboxgl.Map({
      container: 'map',
      countries: 'za',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [28.162400726, -25.731898523],
      zoom: 8,

    });

    // Set marker options.

    this.direction = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      profile: 'mapbox/driving',
      alternatives: true,
      congestion: true,
      unit: 'metric',
      controls: { instructions: true },

    });

    this.map.addControl(this.direction, 'bottom-left');
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.addControl(new mapboxgl.FullscreenControl());

    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));
    this.locateUser();
  }

  ionViewWillLeave() {
  }

  locateUser() {
    console.log(this.dbs.userRequestId);
    // const options: LaunchNavigatorOptions = {
    //   start: 'London, ON',
    //   app: this.launchNavigator.APP.GOOGLE_MAPS
    // };

    // this.launchNavigator.navigate('Toronto, ON', options)
    //   .then(
    //     success => this.dbs.ourToast('Launched navigator', 'success'),
    //     error => this.dbs.ourToast('Error launching navigator', 'danger')
    //   );
    this.watchId = navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      this.direction.setOrigin([lon, lat]);
    });
    this.dbs.locateUser().subscribe((data: any) => {
      console.log(data.geo);
      this.afs.collection('user').doc(data.userId).valueChanges().subscribe((userdata: any) => {
        this.busMarker = new mapboxgl.Marker({
          color: '#04081f'
        }).setLngLat([data.geo[1], data.geo[0]]).addTo(this.map);
        new mapboxgl.Popup({
          closeButton: false,
          anchor: 'top',
          closeOnClick: false
        }).setText(
          `Made by: ${userdata?.firstname} ${userdata?.lastname}. Reason being ${data?.reason}`
        ).setLngLat([data.geo[1], data.geo[0]]).addTo(this.map);
        this.direction.setDestination([data.geo[1], data.geo[0]]);
      });
    });
  }


}

