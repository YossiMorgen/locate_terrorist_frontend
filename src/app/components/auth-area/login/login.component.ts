import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastifyNotificationsService } from 'src/app/services/toastify-notifications/toastify-notifications.service';
import CredentialsModel from 'src/app/models/credentials-model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  hide = true;

  public constructor(
    private auth: AuthService,
    public router: Router,
    private formBuilder: FormBuilder,
    private toast: ToastifyNotificationsService
  ) {}

  public loginForm = this.formBuilder.group({
    username : ['a', [Validators.required]],
    password : ['b', [Validators.required]]
  })

  public async login():Promise<void>{ 
    console.log(this.loginForm.value);
    console.log(this.loginForm.value as CredentialsModel);
    
    await this.auth.login({username: 'a', password: 'b'} as CredentialsModel);
    // try {
    //   await this.auth.login(this.loginForm.value as CredentialsModel);
    //   this.router.navigateByUrl('/home');
    // } catch (error: any) {
    //   this.toast.error(error);
    // }
  }
}
