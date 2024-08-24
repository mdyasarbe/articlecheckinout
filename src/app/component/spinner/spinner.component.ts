import { Component } from '@angular/core';
import { SpinnerService } from '../../shared/spinner.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  spinnerVisible: Observable<boolean>;

  constructor(private spinnerService: SpinnerService) {
    this.spinnerVisible = this.spinnerService.spinner$;
  }
}
