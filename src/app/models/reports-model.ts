import { ReportType } from "./type-enum";

export class ReportModel {
  public type: ReportType;
  public description: string;
  public lat: number;
  public lng: number;
  public time: Date;
  public id: number;
  public amount: number;  

  constructor(reportModel?: ReportModel) {
    {
      this.type = reportModel.type;
      this.description = reportModel.description;
      this.lat = reportModel.lat;
      this.lng = reportModel.lng;
      this.time = reportModel.time;
      this.id = reportModel.id;
      this.amount = reportModel.amount;
    }
  }
}
