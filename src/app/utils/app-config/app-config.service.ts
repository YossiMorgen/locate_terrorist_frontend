import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  public baseURI = 'https://silver-swords.wooden-puppy.xyz/';
  
  public auth = `${this.baseURI}auth/`;
  public login = `${this.auth}login`;

  public createReports = `${this.baseURI}create`;
  public reports = `${this.baseURI}reports/all`;
  public deleteReports = `${this.baseURI}delete`;
  public updateReports = `${this.baseURI}update`;

}
