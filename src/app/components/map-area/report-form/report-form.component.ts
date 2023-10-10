import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  public reportTypesSelect: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public reportModel: ReportModel,
    public reportService: ReportsService,
    private formBuilder : FormBuilder,
    private toast: ToastifyNotificationsService,
    public dialogRef: MatDialogRef<ReportFormComponent>,
  ) {  }

  ngOnInit() { 
    this.formGroup = this.formBuilder.group({
      type: [this.reportModel.type || 1, [Validators.required]],
      description: [this.reportModel.description || ' '],
      lat: [this.reportModel.lat, [Validators.required]],
      lng: [this.reportModel.lng, [Validators.required]],
      report_amount: [this.reportModel.report_amount || 1, [Validators.required,  Validators.pattern('([0-9]+)')]],
      time: [this.reportModel.time || new Date().getTime(), [Validators.required]],
      id: [this.reportModel.id || null]
    });

    this.reportTypesSelect = Object.keys(ReportType).filter((key) => isNaN(Number(key)));
  }

  submitReport() {
    try {
      if(this.reportModel.id){
        this.reportService.updateReport(this.formGroup.value as ReportModel);
        this.toast.success('הדיווח עודכן בהצלחה');
      } else {
        this.reportService.createReport(this.formGroup.value as ReportModel);
        this.toast.success('הדיווח נשלח בהצלחה');
      }
      this.dialogRef.close(true);
    } catch (error: any) {
      this.toast.error(error.message);
    }
  }

  cancelReport() {
    try {
      this.reportService.deleteReport(this.reportModel.id);
      this.toast.success('הדיווח בוטל בהצלחה');
      this.dialogRef.close(true);
    } catch (error: any) {
      this.toast.error(error.message);
    }
  }

}
