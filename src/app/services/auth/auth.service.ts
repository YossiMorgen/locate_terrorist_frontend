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
  public role: number = 2;

  constructor(
    private http: HttpClient,
    private config: AppConfigService,
    private router: Router
  ) {
    const token = window.sessionStorage.getItem('token') || null;
    if (token) this.setUser(token);
  }

  public async login(credentials: CredentialsModel): Promise<void> {
    const observable = this.http.post<string>(this.config.login, credentials);
    const token = await firstValueFrom(observable);
    this.setUser(token);
  }

  public logout(): void {
    this.token = '';
    window.sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): boolean {
    return this.token != null;
  }

  public getToken(): string {
    return this.token;
  }

  private setUser(token: string): void {
    this.token = token;
    window.sessionStorage.setItem('token', token);
    const decode: any = jwtDecode(token);
    this.role = decode.role;
  }
}
