import { AfterViewInit, Component } from '@angular/core';
import * as Leaflet from 'leaflet';
import { ReportModel } from 'src/app/models/reports-model';
import { ReportType } from 'src/app/models/type-enum';
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
    // try {
    //   await this.reportsService.getReports();
    // } catch (error: any) {
    //   this.toastify.error(error.message);
    //   return;
    // }
    this.reportsService.reports = [
      new ReportModel({ type: 1, description: "2", lat: 30.987051, lng: 34.947929, time: new Date(), id: 1 }),
      new ReportModel({ type: 2, description: "2", lat: 30.987051, lng: 34.947929, time: new Date(), id: 1 }),
      new ReportModel({ type: 3, description: "2", lat: 30.987051, lng: 34.947929, time: new Date(), id: 1 }),
    ]
    let initialMarkers = this.reportsService.reports.map((report: ReportModel) => { 
      return {
        position: new Leaflet.LatLng(report.lat, report.lng),
        draggable: false,
        id: report.id,
        };
      }
    );

    for (let index = 0; index < initialMarkers.length; index++) {
      const data = initialMarkers[index];
      const marker = this.generateMarker(data, data.id);
      marker.addTo(this.map).bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
      this.map.panTo({ lat: data.position.lat, lng: data.position.lng });
      this.markers.push(marker);
    }
    
  }

  generateMarker(data: any, index: number) {

    
    const markerIcon = Leaflet.divIcon({
      className: 'custom-marker',
      html: `<div ></div>`,
    });

    return Leaflet.marker(data.position, { draggable: data.draggable, icon: markerIcon })
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
  }

  markerClicked($event: any, id: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, id: number) {
    console.log($event.target.getLatLng());
  }

  getSvgLocation(type: ReportType): string{
    switch (type) {
      case(1):
        return '<svg style="color: blue" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="blue" d="M288 896h448q32 0 32 32t-32 32H288q-32 0-32-32t32-32z"></path><path fill="blue" d="M800 416a288 288 0 1 0-576 0c0 118.144 94.528 272.128 288 456.576C705.472 688.128 800 534.144 800 416zM512 960C277.312 746.688 160 565.312 160 416a352 352 0 0 1 704 0c0 149.312-117.312 330.688-352 544z"></path><path fill="blue" d="M544 384h96a32 32 0 1 1 0 64h-96v96a32 32 0 0 1-64 0v-96h-96a32 32 0 0 1 0-64h96v-96a32 32 0 0 1 64 0v96z"></path></svg>'
      case(2):
        return '<svg style="color: red" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="red" d="M288 896h448q32 0 32 32t-32 32H288q-32 0-32-32t32-32z"></path><path fill="red" d="M800 416a288 288 0 1 0-576 0c0 118.144 94.528 272.128 288 456.576C705.472 688.128 800 534.144 800 416zM512 960C277.312 746.688 160 565.312 160 416a352 352 0 0 1 704 0c0 149.312-117.312 330.688-352 544z"></path><path fill="red" d="M544 384h96a32 32 0 1 1 0 64h-96v96a32 32 0 0 1-64 0v-96h-96a32 32 0 0 1 0-64h96v-96a32 32 0 0 1 64 0v96z"></path></svg>'
      case(3):
        return '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M288 896h448q32 0 32 32t-32 32H288q-32 0-32-32t32-32z"/><path fill="currentColor" d="M800 416a288 288 0 1 0-576 0c0 118.144 94.528 272.128 288 456.576C705.472 688.128 800 534.144 800 416zM512 960C277.312 746.688 160 565.312 160 416a352 352 0 0 1 704 0c0 149.312-117.312 330.688-352 544z"/><path fill="currentColor" d="M544 384h96a32 32 0 1 1 0 64h-96v96a32 32 0 0 1-64 0v-96h-96a32 32 0 0 1 0-64h96v-96a32 32 0 0 1 64 0v96z"/></svg>'
      default: 
        return '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M288 896h448q32 0 32 32t-32 32H288q-32 0-32-32t32-32z"/><path fill="currentColor" d="M800 416a288 288 0 1 0-576 0c0 118.144 94.528 272.128 288 456.576C705.472 688.128 800 534.144 800 416zM512 960C277.312 746.688 160 565.312 160 416a352 352 0 0 1 704 0c0 149.312-117.312 330.688-352 544z"/><path fill="currentColor" d="M544 384h96a32 32 0 1 1 0 64h-96v96a32 32 0 0 1-64 0v-96h-96a32 32 0 0 1 0-64h96v-96a32 32 0 0 1 64 0v96z"/></svg>'
    }
  }
}
