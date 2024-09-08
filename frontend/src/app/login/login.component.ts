import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { Korisnik } from '../models/korisnik';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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
    this.korisniciServis.login(this.kor_ime, this.lozinka, this.tip).subscribe((k: any) => {
      if (k['message'] == 'lozinka') {
        this.poruka = 'Pogrešna lozinka!';
      } else if (k['message'] == 'korisnik') {
        this.poruka = 'Loši podaci!'
      } else if (k && k.kor_ime == this.kor_ime) {
        if (k.odobren == false) {
          this.poruka = "Vaš nalog još uvek nije verifikovan. Pokušajte kasnije."
          return;
        }
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
      this.ruter.navigate([this.ulogovan.tip]);
    }
  }

  nazad() {
    this.ruter.navigate(['']);
  }
}
