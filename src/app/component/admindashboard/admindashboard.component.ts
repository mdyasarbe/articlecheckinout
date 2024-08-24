import { Component, ViewChild } from '@angular/core';
import { CheckinComponent } from '../checkin/checkin.component';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.css'
})
export class AdmindashboardComponent {
  tabfocused = 0;

  
  tabClicked(event:any){
    this.tabfocused = event.index;
  
  }
}
