import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Slot } from 'src/app/modells/slot.model';
import { DatabaseService } from 'src/app/services/database.service';
import { TrackingService } from 'src/app/services/tracking.service';
import { LoadingController } from '@ionic/angular';
import { MapboxStyleSwitcherControl } from 'mapbox-gl-style-switcher';

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
  constructor(private ts: TrackingService, private dbs: DatabaseService,
    public loadingController: LoadingController) {

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
      controls: { instructions: false },

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
  }

  ionViewWillLeave() {
  }

}
