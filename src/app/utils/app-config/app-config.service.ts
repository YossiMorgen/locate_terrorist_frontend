import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
<<<<<<< HEAD
  public baseURI = 'https://silver-swords.israelcentral.cloudapp.azure.com/';
  
=======
  public baseURI = 'https://silver-swords.wooden-puppy.xyz/';

>>>>>>> f771355a97365898f0bd4263cdc22976126fc85a
  public auth = `${this.baseURI}auth/`;
  public login = `${this.auth}login`;

  public createReports = `${this.baseURI}create`;
  public reports = `${this.baseURI}reports/all`;
  public deleteReports = `${this.baseURI}delete`;
  public updateReports = `${this.baseURI}update`;
}
