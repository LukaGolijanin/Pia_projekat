import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dekorater',
  templateUrl: './dekorater.component.html',
  styleUrls: ['./dekorater.component.css']
})
export class DekoraterComponent {

  constructor(private router: Router) {}

  logout() {
    localStorage.clear()
    this.router.navigate([''])
  }
}
