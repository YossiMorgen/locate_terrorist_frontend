import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ReportModel } from 'src/app/models/reports-model';
import { AppConfigService } from 'src/app/utils/app-config/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  public reports: ReportModel[] = [];

  constructor(
    private http: HttpClient,
    private config: AppConfigService
  ) {}

  public async getReports(): Promise<void> {
    const observable = this.http.get<ReportModel[]>(this.config.reports);
    this.reports = await firstValueFrom(observable);
  }

  public async createReport(report: ReportModel): Promise<void> {
    const observable = this.http.post<ReportModel>(
      this.config.createReports,
      report
    );
    const newReport = await firstValueFrom(observable);
    this.reports.push(newReport);
  }

  public async updateReport(report: ReportModel): Promise<void> {
    const observable = this.http.put<ReportModel>(
      this.config.updateReports,
      report
    );
    await firstValueFrom(observable);
    this.reports = this.reports.map((rep) => {
      if (rep.id === report.id) {
        rep = report;
      }
      return rep;
    });
  }

  public async deleteReport(id: number): Promise<void> {
    const observable = this.http.delete<ReportModel>(
      `${this.config.deleteReports}${id}`
    );
    await firstValueFrom(observable);
    this.reports = this.reports.map((report, index) => {
      if (report.id === id) {
        this.reports.splice(index, 1);
      }
      return report;
    });
  }
}
