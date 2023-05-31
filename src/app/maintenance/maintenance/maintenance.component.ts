import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit, OnDestroy {

  siteName = window.location.hostname;

  mainInterval;

  constructor(private router: Router, private authService: TokenService) { }

  ngOnInit(): void {
    this.mainInterval = setInterval(() => {

      let maintain = this.authService.getMaintanance();
      if (maintain == '1') {
        // this.router.navigate(['change_pass']);
      } else if (maintain == '2') {
        this.router.navigate(['/']);

      } else {
        this.router.navigate(['maintenance']);

      }
    }, 1000)
  }

  ngOnDestroy(): void {
    if (this.mainInterval) {
      clearInterval(this.mainInterval);
    }
  }

}
