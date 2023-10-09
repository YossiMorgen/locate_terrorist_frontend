import { ReportType } from "./type-enum";

export class ReportModel {
  public type: ReportType;
  public description: string;
  public lat: number;
  public lng: number;
  public created_at: Date;
  public id: number;
  public report_amount: number;  

  constructor(reportModel?: ReportModel) {
    if(reportModel) {
      this.type = reportModel.type;
      this.description = reportModel.description;
      this.lat = reportModel.lat;
      this.lng = reportModel.lng;
      this.created_at = reportModel.created_at;
      this.id = reportModel.id;
      this.report_amount = reportModel.report_amount;
    }
  }
}
