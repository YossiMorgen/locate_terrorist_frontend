import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReportsService } from '../services/reports/reports.service';
import { ReportModel } from '../models/reports-model';
import { NgForm } from '@angular/forms';
import { LatLng } from 'leaflet';

@Component({
  selector: 'new-report-form',
  templateUrl: './new-report-form.component.html',
  styleUrls: ['./new-report-form.component.css']
})
export class NewReportFormComponent implements OnInit {
  @Input() index: number = 0;
  @Input() latLng: LatLng;
  @Output() onFormReportClosed = new EventEmitter<number>();

  constructor(public reportsService: ReportsService) {}
  ngOnInit(): void {
    this.initReport();
  }
  report: ReportModel;
  initReport() {
    this.report = {
      type: '',
      description: '',
      lat: this.latLng.lat,
      lng: this.latLng.lng,
      //@ts-ignore
      time: new Date().toISOString().slice(0, 16), // Initialize with current date and time
      id: null
    };
  }

  onClickClose() {
    this.onFormReportClosed.emit(this.index);
  }

  async onFormSubmit(form: NgForm) {
    try {
      console.log(form.value); // This  will contain the form values
      console.log({
        ...this.report,
        time: new Date(this.report.time)
      });

      await this.reportsService.createReport({
        ...this.report,
        time: new Date(this.report.time)
      });
      this.onClickClose();
    } catch (error) {
      console.error(error);
    }
  }
}
