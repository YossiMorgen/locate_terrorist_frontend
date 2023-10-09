import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import CredentialsModel from 'src/app/models/credentials-model';
import { AppConfigService } from 'src/app/utils/app-config/app-config.service';
import { ToastifyNotificationsService } from '../toastify-notifications/toastify-notifications.service';
import { HttpClient } from '@angular/common/http';
import { Subject, firstValueFrom } from 'rxjs';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string = null;
  public role: string = 'admin';

  constructor( 
      private http: HttpClient, 
      private config: AppConfigService, 
      private router : Router,
  ){ 
    this.token = window.localStorage.getItem('token') || null;
  }

  public async login( credentials: CredentialsModel): Promise<void> {
    const observable = this.http.post<string>( this.config.login, credentials );    
    const token = await firstValueFrom(observable);
    window.localStorage.setItem('token', token );
    this.token = token;
    this.router.navigate(['/reports']);
  }

  public logout():void{        
      this.token = '';
      window.localStorage.removeItem('token')
      this.router.navigate(['/login']);
  }

  public isLoggedIn():boolean{
      return this.token != null;
  }

  public getToken():string{
      return this.token;
  }
}
