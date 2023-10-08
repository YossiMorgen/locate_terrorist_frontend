import { AfterViewInit, Component } from '@angular/core';
import * as Leaflet from 'leaflet'; 
import { ReportModel } from 'src/app/models/reports-model';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ToastifyNotificationsService } from 'src/app/services/toastify-notifications/toastify-notifications.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];

  constructor(
    public reportsService: ReportsService,
    public toastify: ToastifyNotificationsService
  ) {};

  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 16,
    center: { lat: 28.626137, lng: 79.821603 }
  }

  async initMarkers() {    
    // try {
    //   await this.reportsService.getReports();
    // } catch (error: any) {
    //   this.toastify.error(error.message);
    //   return;
    // }
    this.reportsService.reports = [
      new ReportModel({ type: "1", description: "2", lat: 30.987051, lng: 34.947929, time: new Date(), id: 1 }),
      new ReportModel({ type: "1", description: "2", lat: 30.987051, lng: 34.947929, time: new Date(), id: 1 }),
      new ReportModel({ type: "1", description: "2", lat: 30.987051, lng: 34.947929, time: new Date(), id: 1 }),
    ]
    let initialMarkers = this.reportsService.reports.map((report: ReportModel) => { 
      return {
        position: new Leaflet.LatLng(report.lat, report.lng),
        draggable: false,
        id: report.id,
      }
    });

    for (let index = 0; index < initialMarkers.length; index++) {
      const data = initialMarkers[index];
      const marker = this.generateMarker(data, data.id);
      marker.addTo(this.map).bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
      this.map.panTo({ lat: data.position.lat, lng: data.position.lng });
      this.markers.push(marker);
    }
    
  }

  generateMarker(data: any, index: number) {
    return Leaflet.marker(data.position, { draggable: data.draggable })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.map.setView(new Leaflet.LatLng(30.987051, 34.947929), 8);
    this.initMarkers();
  }

  mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerClicked($event: any, index: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  }
}
 