import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  public baseURI = 'http://localhost:3001/api/';
  
  public auth = `${this.baseURI}auth/`;
  public login = `${this.auth}login`;

  public reports = `${this.baseURI}reports/`;

}
