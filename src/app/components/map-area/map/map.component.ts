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
export class MapComponent implements AfterViewInit {
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  tempReports: Leaflet.LatLng[] = [];

  constructor(
    public reportsService: ReportsService,
    public toastify: ToastifyNotificationsService
  ) {}

  options: Leaflet.MapOptions = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
    ],
    zoom: 0,
    center: { lat: 28.626137, lng: 79.821603 }
  };

  ngAfterViewInit(): void {
    this.map?.setZoom(0);
    setTimeout(() => {
      this.map?.setZoom(8.5);
    }, 0);
  }

  async initMarkers() {
    try {
      await this.reportsService.getReports();
    } catch (error: any) {
      this.toastify.error(error.message);
    }
    let initialMarkers = this.reportsService.reports.map(
      (report: ReportModel) => {
        return {
          position: new Leaflet.LatLng(report.lat, report.lng),
          draggable: false,
          id: report.id,
          ...report
        };
      }
    );

    for (let index = 0; index < initialMarkers.length; index++) {
      const data = initialMarkers[index];
      const marker = this.generateMarker(data, data.id);
      marker.addTo(this.map).bindPopup(`<b>${data.lat},  ${data.lng}</b>`);
      console.log('hi');
      this.map.panTo({ lat: data.lat, lng: data.lng });
      this.markers.push(marker);
    }
    console.log(this.markers);
  }

  generateMarker(data: any, index: number) {
    return Leaflet.marker(data.position, {
      draggable: data.draggable,
      title: data.title
    })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.map.setView(new Leaflet.LatLng(30.987051, 34.947929), 8);
    this.initMarkers();
  }

  mapClicked($event: Leaflet.LeafletMouseEvent) {
    console.log($event.latlng.lat, $event.latlng.lng);
    const marker = this.genereateLocalMarker($event);
    marker.addTo(this.map);
    this.tempReports.push(
      new Leaflet.LatLng($event.latlng.lat, $event.latlng.lng)
    );
  }

  onCloseFormPerMarker(isTemp: boolean, index: number) {
    if (isTemp) {
      this.tempReports.splice(index, 1);
    }
  }

  genereateLocalMarker($event: Leaflet.LeafletMouseEvent) {
    return Leaflet.marker($event.latlng);
  }

  markerClicked($event: any, index: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  }
}
