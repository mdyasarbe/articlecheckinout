import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(private router: Router, private authservice: AuthService) {}

  ngOnInit() {}
  ngAfterViewInit() {
    if (this.authservice.userValue) {
      this.router.navigate(['/admindashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
