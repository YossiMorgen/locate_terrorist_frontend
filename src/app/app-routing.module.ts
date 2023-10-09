import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/layout-area/home/home.component';
import { LoginComponent } from './components/auth-area/login/login.component';
import { PageNotFoundComponent } from './components/layout-area/page-not-found/page-not-found.component';
import { LoggedInService } from './utils/logged_in/logged-in.guard';
import { MapComponent } from './components/map-area/map/map.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // { path: 'reports', component: MapComponent },
  { path: 'reports', component: MapComponent, canActivate: [LoggedInService]  },
  { path: '', redirectTo: '/reports', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
