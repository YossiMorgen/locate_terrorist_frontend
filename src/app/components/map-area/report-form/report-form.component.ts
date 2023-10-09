import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  
  public formGroup: FormGroup;
  public reportModel: ReportModel;
  public reportTypesSelect: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ReportModel,
    public reportService: ReportsService,
    private formBuilder : FormBuilder,
    private toast: ToastifyNotificationsService,
  ) {
    this.reportModel = data;
  }

  ngOnInit() { 
    this.formGroup = this.formBuilder.group({
      type: [this.reportModel.type || 1, [Validators.required]],
      description: [this.reportModel.description || ' '],
      lat: [this.reportModel.lat, [Validators.required]],
      lng: [this.reportModel.lng, [Validators.required]],
      report_amount: [this.reportModel.report_amount || 1, [Validators.required,  Validators.pattern('([0-9]+)')]],
      time: [this.reportModel.time || new Date()],
      id: [this.reportModel.id || null]
    });

    this.reportTypesSelect = Object.keys(ReportType).filter((key) => isNaN(Number(key)));
  }

  submitReport() {
    try {
      if(this.data.id){
        this.reportService.updateReport(this.formGroup.value as ReportModel);
        this.toast.success('הדיווח עודכן בהצלחה');
      } else {
        this.reportService.createReport(this.formGroup.value as ReportModel);
        this.toast.success('הדיווח נשלח בהצלחה');
      }
    } catch (error: any) {
      this.toast.error(error.message);
    }
  }

}
