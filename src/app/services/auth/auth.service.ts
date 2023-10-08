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

  public userChanges = new Subject<void>();

  private token: string;

  constructor( 
      private http: HttpClient, 
      private config: AppConfigService, 
      private router : Router,
      private toast: ToastifyNotificationsService
  ){ 
    const token = window.localStorage.getItem('token')
  }

  public async login( credentials: CredentialsModel ): Promise<void> {
      const observable = this.http.post<string>( this.config.login, credentials );
      await firstValueFrom(observable);
  }

  public logout():void{        
      this.token = '';
      window.localStorage.removeItem('token')
      this.router.navigate(['/login']);
  }

  public isLoggedIn():boolean{
      if(this.token && this.token != ''){
          const decode = jwtDecode( this.token ) as any;
          if(decode.exp < Date.now() / 1000) {                
              this.toast.error('Your session has expired, please login again');
              this.logout();
              return false;
          }
          return true
      }

      return false;
  }

  public getToken():string{
      return this.token;
  }}
