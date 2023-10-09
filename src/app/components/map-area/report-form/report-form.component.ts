import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportModel } from 'src/app/models/reports-model';
import { ReportType } from 'src/app/models/type-enum';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { ToastifyNotificationsService } from 'src/app/services/toastify-notifications/toastify-notifications.service';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent implements OnInit {
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public report: ReportModel,
    public reportService: ReportsService,
    private formBuilder : FormBuilder,
    private toast: ToastifyNotificationsService
  ) { }

  reportTypesSelect = Object.keys(ReportType).filter((key) => isNaN(Number(key)));

  reportForm = this.formBuilder.group({
    type: [this.report.type || 1, [Validators.required]],
    description: [this.report.description || ' '],
    lat: [this.report.lat, [Validators.required]],
    lng: [this.report.lng, [Validators.required]],
    report_amount: [this.report.report_amount || 1, [Validators.required,  Validators.pattern('([0-9]+)')]],
    time: [this.report.time || new Date()],
    id: [this.report.id || null]
  });

  ngOnInit(): void {
    console.log(this.report);
  }

  submitReport() {

    try {
      if(this.report.id){
        this.reportService.updateReport(this.reportForm.value as ReportModel);
        this.toast.success('הדיווח עודכן בהצלחה');
      } else {
        this.reportService.createReport(this.reportForm.value as ReportModel);
        this.toast.success('הדיווח נשלח בהצלחה');
      }
    } catch (error: any) {
      this.toast.error(error.message);
    }
  }

}
