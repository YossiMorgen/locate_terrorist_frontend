export class ReportModel {
    
    public type: string;
    public description: string;
    public lat: number;
    public lng: number;
    public time: Date;
    public id: number;
    public position: {
        lat: number,
        lng: number
    }
    public draggable: true;

    constructor(reportModel?: ReportModel) {
        {
            this.type = reportModel.type;
            this.description = reportModel.description;
            this.lat = reportModel.lat;
            this.lng = reportModel.lng;
            this.time = reportModel.time;
            this.id = reportModel.id;
        }
    }
}

