import { Component, OnInit } from '@angular/core';
import { ReportModel } from 'src/app/models/reports-model';
import { ReportType } from 'src/app/models/type-enum';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ReportsService } from 'src/app/services/reports/reports.service';

@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.css']
})
export class ReportCardComponent implements OnInit {
  report = new ReportModel({ type: 1, report_amount: 2, description: "2", lat: 30.987051, lng: 34.947929, time: new Date(), id: 1 });
  reportTypes = Object.keys(ReportType).filter((reportType) => isNaN(Number(reportType)));

  constructor(private reportService: ReportsService) { }
  ngOnInit(): void {
    this.reportService.reportChanges.subscribe((report) => {            
      this.report = report;
    });  
  }
}
