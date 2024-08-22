import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CheckoutComponent } from './component/checkout/checkout.component';
import { LoginComponent } from './component/login/login.component';
import { CheckinComponent } from './component/checkin/checkin.component';
import { SearchComponent } from './component/search/search.component';
import { AdmindashboardComponent } from './component/admindashboard/admindashboard.component';
import { AuthGuardService } from './shared/authguard.service';
import { DashboardComponent } from './component/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admindashboard', component: AdmindashboardComponent, canActivate: [AuthGuardService] },
  { path: 'checkin', component: CheckinComponent, canActivate: [AuthGuardService] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
