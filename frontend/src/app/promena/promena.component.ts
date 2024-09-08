import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Korisnik } from '../models/korisnik';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-promena',
  templateUrl: './promena.component.html',
  styleUrls: ['./promena.component.css']
})
export class PromenaComponent implements OnInit {

  constructor(private ruter: Router, private servis: UsersService) {}

  ulogovan: Korisnik = new Korisnik();

  stara: string = "";
  nova: string = "";
  nova1: string = "";

  st_err: string = "";
  n_err: string = "";
  n1_err: string = "";

  ngOnInit(): void {
    let korisnik = localStorage.getItem('ulogovan');
    if (korisnik != null) {
      this.ulogovan = JSON.parse(korisnik);
    } else {
      alert('ERROR: Korisnik nije ulogovan!');
      this.ruter.navigate(['']);
    }
  }

  promeniLozinku(form: NgForm) {
    if (form.valid) {
      if (this.passwordValidator(this.nova) && this.nova == this.nova1) {
        this.servis.promeniLozinku(this.ulogovan.kor_ime,this.nova,this.stara).subscribe((resp) => {
          if ((resp as any)['message'] == 'Uspesno') {
            localStorage.clear();
            this.ruter.navigate(['login']);
            alert('Lozinka je uspešno promenjena!');
          } else if ((resp as any)['message'] == 'interna greska') {
            alert('Promena lozinke nije uspela. Pokušajte ponovo.');
          } else if ((resp as any)['message'] == 'lozinka greska') {
            this.st_err = 'Stara lozinka nije ispravna.';
          } else {
            alert('Greška prilikom pronalaska korisnika.');
            localStorage.clear();
            this.ruter.navigate(['login']);
          }
        })
      }
    }
  }

  passwordValidator(password: string): boolean {
    const minLength = 6;
    const maxLength = 10;

    const upper = /[A-Z]/.test(password);
    const lower = /[a-z].*[a-z].*[a-z]/.test(password);
    const digit = /\d/.test(password);
    const speci = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const start = /^[A-Za-z]/.test(password);
    const len = password.length >= minLength && password.length <= maxLength;

    let yes: boolean = upper && lower && digit && speci && start && len;
    if (!yes) {
      this.n_err = "Lozinka mora da ima izmedju 6 i 10 karaktera, minimum 1 veliko slovo, 3 mala slova, 1 cifru i 1 specijalan karakter, kao i da počinje slovom.";
    }
    return yes;
  }

  sameValidator1(password1: string, password2: string): boolean {
    let ret = (password1 == password2);
    if (!ret) {
      this.n1_err = 'Potvrdite istu lozinku.';
    }
    return ret;
  }

}
