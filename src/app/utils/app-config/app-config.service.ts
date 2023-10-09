import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  public baseURI = 'https://silver-swords.northeurope.cloudapp.azure.com/api/';
  // public baseURI = 'http://localhost:8000/api/';
  
  public login = `${this.baseURI}login`;

  public createReports = `${this.baseURI}create`;
  public reports = `${this.baseURI}reports/all`;
  public deleteReports = `${this.baseURI}delete`;
  public updateReports = `${this.baseURI}update`;
}
