import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vlasnik',
  templateUrl: './vlasnik.component.html',
  styleUrls: ['./vlasnik.component.css']
})
export class VlasnikComponent {

  constructor(private router: Router) {}

  logout() {
    localStorage.clear()
    this.router.navigate([''])
  }
}
