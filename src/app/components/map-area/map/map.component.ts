import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as Leaflet from 'leaflet';
import { ReportModel } from 'src/app/models/reports-model';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ToastifyNotificationsService } from 'src/app/services/toastify-notifications/toastify-notifications.service';
import { ReportFormComponent } from '../report-form/report-form.component';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];

  layer = 0;
  layers = [
    { name: 'הכל' },
    { name: 'טרוריסטים', icon: this.getSvgLocation(1), enabled: true },
    { name: 'אזרחים', icon: this.getSvgLocation(2), enabled: true }
  ];

  constructor(
    public reportsService: ReportsService,
    public dialog: MatDialog,
    public toast: ToastifyNotificationsService,
    private zone: NgZone,
    public auth: AuthService
  ) {
    this.handleGeoLocation();
  }

  options: Leaflet.MapOptions = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 0,
    center: { lat: 28.626137, lng: 79.821603 }
  };

  myLatLng: Leaflet.LatLng | null = null;

  handleGeoLocation() {
    if (!navigator.geolocation.getCurrentPosition) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lon = position.coords.longitude;
        const lat = position.coords.latitude;
        this.myLatLng = new Leaflet.LatLng(lat, lon);
        console.log(this.myLatLng);
      },
      (error) => {
        this.toast.message('אין גישה למיקום שלך');
      }
    );
  }
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.map?.setZoom(0);
    setTimeout(() => {
      this.map?.setZoom(8.5);
    }, 0);
  }

  async initMarkers() {
    const lat = this.myLatLng?.lat;
    const lng = this.myLatLng?.lng;
    console.log('myLatLng', { lat, lng });

    try {
      await this.reportsService.getReports();
    } catch (error: any) {
      this.toast.error(error.message);
      return;
    }

    let theClosestReport = {
      distance: 0,
      id: ''
    };

    let initialMarkers = this.reportsService.reports
      .map((report: ReportModel) => {
        if (this.layer != 0) {
          if (this.layer != report.type) {
            return null;
          }
        }
        if (lat && lng) {
          const distance = Math.sqrt(
            Math.pow(report.lat - lat, 2) + Math.pow(report.lng - lng, 2)
          );
          if (
            theClosestReport.distance == 0 ||
            distance < theClosestReport.distance
          ) {
            theClosestReport.distance = distance;
            theClosestReport.id = report.id;
          }
        }
        return {
          position: new Leaflet.LatLng(report.lat, report.lng),
          draggable: true,
          ...report
        };
      })
      .filter((marker) => marker !== null);

    for (let index = 0; index < initialMarkers.length; index++) {
      const data = initialMarkers[index];
      const marker = this.generateMarker(data, data.id);

      let popupText = '';
      if (this.auth.role == 1) {
        popupText = `<b>${data.report_amount || ''} ${
          this.layers[data.type].name
        }</b>`;
      } else {
        popupText = '';
        if (this.auth.role == 1) {
          popupText = `<b>${data.report_amount || ''} ${
            this.layers[data.type].name
          }</b>`;
        } else {
          popupText = `<mat-card *ngIf="report.id">
                          <mat-card-header>
                              <mat-card-title>${data.report_amount || ''} ${
                                this.layers[data.type].name
                              }</mat-card-title>
                          </mat-card-header>
                          <mat-card-content>
                              <p>${data.description}</p>
                              <p>קישור למפות: <a href="https://www.google.com/maps/search/?api=1&query=${
                                data.lat
                              },${data.lng}">View on Google Maps</a></p>
                              <mat-card-subtitle> דווח בשעה: ${
                                data.time
                              }</mat-card-subtitle>
                          </mat-card-content>
                      </mat-card>`;
        }
      }

      if (data.id == theClosestReport.id) {
        marker.addTo(this.map).bindPopup(popupText).openPopup();
      } else {
        marker.addTo(this.map).bindPopup(popupText);
      }
      this.map.panTo({ lat: data.position.lat, lng: data.position.lng });
      this.markers.push(marker);
    }

    if (lat && lng && this.auth.role != 1) {
      const markerIcon = Leaflet.divIcon({
        html: this.getSvgLocation(4)
      });

      const marker = Leaflet.marker(
        { lat: lat, lng: lng },
        { draggable: false, icon: markerIcon }
      );
      marker.addTo(this.map).bindPopup(`<b>המיקום שלך</b>`);
      this.markers.push(marker);
      this.map.panTo({ lat: lat, lng: lng });
    }
  }

  generateMarker(data: any, index: string) {
    const markerIcon = Leaflet.divIcon({
      html: this.layers[data.type].icon
    });

    const marker = Leaflet.marker(data.position, {
      draggable: this.auth.role == 1 ? true : false,
      icon: markerIcon
    });
    return marker
      .on('click', (event) => this.markerClicked(event, index, marker))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.map.setView(new Leaflet.LatLng(30.987051, 34.947929), 8);
    setTimeout(() => {
      this.initMarkers();
    }, 200);

    if (this.auth.role != 1) {
      setInterval(
        async () => {
          try {
            await this.reportsService.getReports();
          } catch (error: any) {
            this.toast.error(error.message);
            return;
          }

          this.updateMarkers();
        },
        1000 * 60 * 2
      );
    }
  }

  updateMarkers() {
    this.initMarkers();
  }

  mapClicked($event: Leaflet.LeafletMouseEvent) {
    if (this.auth.role == 1) {
      let rep = new ReportModel();
      rep.lat = $event.latlng.lat;
      rep.lng = $event.latlng.lng;
      this.showDialog(rep);
    }
  }

  markerClicked($event: any, id: string, marker: any) {
    const report = this.reportsService.reports.find(
      (report) => report.id === id
    );
    if (this.auth.role != 1) {
      this.reportsService.reportChanges.next(report);
      // close marker popup
      marker.closePopup();
    } else {
      this.showDialog(report);
    }
  }

  markerDragEnd($event: any, id: string) {
    if (this.auth.role == 1) {
      const report = this.reportsService.reports.find(
        (report) => report.id === id
      );
      const latlng = $event.target.getLatLng();
      report.lat = latlng.lat;
      report.lng = latlng.lng;
      this.showDialog(report);
    }
  }

  getSvgLocation(type: number): string {
    const svgArray = [
      '<svg style="color: red; width: 40px; position: absolute; bottom: 0; left: -20px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="red" d="M288 896h448q32 0 32 32t-32 32H288q-32 0-32-32t32-32z"></path><path fill="red" d="M800 416a288 288 0 1 0-576 0c0 118.144 94.528 272.128 288 456.576C705.472 688.128 800 534.144 800 416zM512 960C277.312 746.688 160 565.312 160 416a352 352 0 0 1 704 0c0 149.312-117.312 330.688-352 544z"></path><path fill="red" d="M544 384h96a32 32 0 1 1 0 64h-96v96a32 32 0 0 1-64 0v-96h-96a32 32 0 0 1 0-64h96v-96a32 32 0 0 1 64 0v96z"></path></svg>',
      '<svg style="color: blue; width: 40px; position: absolute; bottom: 0; left: -20px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="blue" d="M288 896h448q32 0 32 32t-32 32H288q-32 0-32-32t32-32z"></path><path fill="blue" d="M800 416a288 288 0 1 0-576 0c0 118.144 94.528 272.128 288 456.576C705.472 688.128 800 534.144 800 416zM512 960C277.312 746.688 160 565.312 160 416a352 352 0 0 1 704 0c0 149.312-117.312 330.688-352 544z"></path><path fill="blue" d="M544 384h96a32 32 0 1 1 0 64h-96v96a32 32 0 0 1-64 0v-96h-96a32 32 0 0 1 0-64h96v-96a32 32 0 0 1 64 0v96z"></path></svg>',
      '<svg style="width: 40px; position: absolute; bottom: 0; left: -20px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M288 896h448q32 0 32 32t-32 32H288q-32 0-32-32t32-32z"/><path fill="currentColor" d="M800 416a288 288 0 1 0-576 0c0 118.144 94.528 272.128 288 456.576C705.472 688.128 800 534.144 800 416zM512 960C277.312 746.688 160 565.312 160 416a352 352 0 0 1 704 0c0 149.312-117.312 330.688-352 544z"/><path fill="currentColor" d="M544 384h96a32 32 0 1 1 0 64h-96v96a32 32 0 0 1-64 0v-96h-96a32 32 0 0 1 0-64h96v-96a32 32 0 0 1 64 0v96z"/></svg>',
      '<svg style="color: yellow; width: 40px; position: absolute; bottom: 0; left: -20px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M288 896h448q32 0 32 32t-32 32H288q-32 0-32-32t32-32z"/><path fill="currentColor" d="M800 416a288 288 0 1 0-576 0c0 118.144 94.528 272.128 288 456.576C705.472 688.128 800 534.144 800 416zM512 960C277.312 746.688 160 565.312 160 416a352 352 0 0 1 704 0c0 149.312-117.312 330.688-352 544z"/><path fill="currentColor" d="M544 384h96a32 32 0 1 1 0 64h-96v96a32 32 0 0 1-64 0v-96h-96a32 32 0 0 1 0-64h96v-96a32 32 0 0 1 64 0v96z"/></svg>'
    ];

    return svgArray[type - 1];
  }

  changeLayer(index: number) {
    this.layer = index;
    this.markers.forEach((marker) => {
      this.map.removeLayer(marker);
    });
    this.markers = [];
    this.updateMarkers();
  }

  public showDialog(report: ReportModel) {
    let dialogRef: MatDialogRef<any>;

    this.zone.run(() => {
      dialogRef = this.dialog.open(ReportFormComponent, {
        width: '45vh',
        enterAnimationDuration: '300',
        exitAnimationDuration: '200',
        data: report
      });
    });

    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        setTimeout(() => {
          this.changeLayer(this.layer);
        }, 1000);
      }
    });
  }
}
