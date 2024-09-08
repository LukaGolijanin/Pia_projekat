import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Korisnik } from '../models/korisnik';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminloginComponent {

  constructor(private ruter: Router, private korisniciServis: UsersService) {}

  kor_ime: string = "";
  lozinka: string = "";
  tip: string = "";
  poruka: string = "";
  ulogovan: Korisnik = new Korisnik();

  prijavaNaSistem() {
    if (this.kor_ime == "" || this.lozinka == "") {
      this.poruka = "Niste uneli sve podatke!";
      return;
    }
    this.poruka = "";
    this.korisniciServis.login(this.kor_ime, this.lozinka, 'admin').subscribe((k: any) => {
      if (k['message'] == 'lozinka') {
        this.poruka = 'Pogrešna lozinka!';
      } else if (k['message'] == 'korisnik') {
        this.poruka = 'Loši podaci!'
      } else if (k && k.kor_ime == this.kor_ime) {
        localStorage.setItem('ulogovan', JSON.stringify(k));
        this.ruter.navigate([k.tip]);
      } else {
        this.poruka = "Losi podaci!";
        return;
      }
    })
  }

  ngOnInit(): void {
    let korisnik = localStorage.getItem('ulogovan');
    if (korisnik != null) {
      this.ulogovan = JSON.parse(korisnik);
      if (this.ulogovan.tip == 'admin') {
        this.ruter.navigate(['admin']);
      } else {
        this.ruter.navigate([this.ulogovan.tip]);
      }
    }
  }
}
