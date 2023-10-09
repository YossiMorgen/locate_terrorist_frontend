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
    username : ['admin', [Validators.required]],
    password : ['LJ!L6e$s8Za3h2XnEfhM', [Validators.required]]
  })

  public async login():Promise<void>{ 
    try {
      await this.auth.login(this.loginForm.value as CredentialsModel);
      // this.router.navigateByUrl('/reports');
    } catch (error: any) {
      this.toast.error(error);
    }
  }
}
