import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [StatusBar]
})
export class AppComponent implements OnInit {
  constructor(private statusBar: StatusBar) { }
  ngOnInit() {
    // this.statusBar.overlaysWebView(false);
    // this.statusBar.backgroundColorByHexString('#031b36');
  }
}
