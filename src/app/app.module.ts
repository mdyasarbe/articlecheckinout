import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table' 
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { LoginComponent } from './component/login/login.component';
import { SearchComponent } from './component/search/search.component';
import { CheckinComponent } from './component/checkin/checkin.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ReactiveFormsModule } from '@angular/forms';
import { AdmindashboardComponent } from './component/admindashboard/admindashboard.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AuthGuardService } from './shared/authguard.service';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SearchComponent,
    CheckinComponent,
    CheckoutComponent,
    AdmindashboardComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatGridListModule,
    MatPaginatorModule,
    MatPaginator,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  providers: [
    provideClientHydration(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'articlecheckinout',
        appId: '1:499630300804:web:df08113ace2f4beb786cd1',
        storageBucket: 'articlecheckinout.appspot.com',
        apiKey: 'AIzaSyBDuG5K58FJ37V1FOcmVU9xvxZE-7sg67s',
        authDomain: 'articlecheckinout.firebaseapp.com',
        messagingSenderId: '499630300804',
        measurementId: 'G-YYWWBBCNQ8',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnimationsAsync(),
    AuthGuardService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
