import { Component } from '@angular/core';
import { SearchComponent } from './component/search/search.component';
import { CheckinComponent } from './component/checkin/checkin.component';
import { CheckoutComponent } from './component/checkout/checkout.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'articlecheckinout';
}
