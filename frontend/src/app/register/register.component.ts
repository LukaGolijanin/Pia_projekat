import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { Korisnik } from '../models/korisnik';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private ruter: Router, private korisniciServis: UsersService) {}

  kor_ime: string = "";
  lozinka: string = "";
  ime: string = "";
  prezime: string = "";
  pol: string = "";
  adresa: string = "";
  tel: string = "";
  email: string = "";
  profile_pic: File | null = null;
  credit_card: string = "";

  poslat: boolean = false;
  pic_err: string = "";
  pass_err: string = "";
  cardType: string = "";
  err: string = "";

  registracija(form: NgForm) {

    if (form.valid) {
      if (this.passwordValidator(this.lozinka)) {
        const pc = this.profile_pic;

        if (pc) {
          this.korisniciServis.posaljiZahtev(this.kor_ime, this.lozinka,
            this.ime, this.prezime, this.pol, this.adresa, this.tel, this.email,
            this.credit_card, 'vlasnik' ,pc).subscribe((resp) => {
              if ((resp as any)['message']=='poslat') {
                alert('OK');
                this.poslat = true;
              } else if ((resp as any)['message']=='kor_ime'){
                alert('ERROR');
                this.err = "Korisničko ime je zauzeto!"
              } else if ((resp as any)['message']=='email') {
                alert('ERROR');
                this.err = "E-mail adresa je već iskorišćena!"
              } else {
                alert('ERROR');
                this.err = "Nije moguće poslati zahtev!"
              }
            })
        } else {
          this.korisniciServis.posaljiZahtev(this.kor_ime, this.lozinka,
            this.ime, this.prezime, this.pol, this.adresa,this.tel,this.email,
            this.credit_card, 'vlasnik').subscribe((resp) => {
              if ((resp as any)['message']=='poslat') {
                alert('OK');
                this.poslat = true;
              } else if ((resp as any)['message']=='kor_ime'){
                alert('ERROR');
                this.err = "Korisničko ime je zauzeto!"
              } else if ((resp as any)['message']=='email') {
                alert('ERROR');
                this.err = "E-mail adresa je već iskorišćena!"
              } else {
                alert('ERROR');
                this.err = "Nije moguće poslati zahtev!"
              }
            })
        }
      } else {
        alert('Unesite pravilnu lozinku!')
      }
    } else {
      alert('Proverite da li ste pravilno uneli sva polja!');
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
      this.pass_err = "Lozinka mora da ima izmedju 6 i 10 karaktera, minimum 1 veliko slovo, 3 mala slova, 1 cifru i 1 specijalan karakter, kao i da počinje slovom.";
    }
    return yes;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // VALIDACIJA
      const tipovi = ['image/jpeg', 'image/png'];
      if (!tipovi.includes(file.type)) {
        this.pic_err = 'Odaberite PNG ili JPG format slike!'
        return;
      }

      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const { width, height } = img;
        if (width < 100 || width > 300 || height < 100 || height > 300) {
          this.pic_err = 'Dimenzije slike nisu odgovarajuće! Izaberite sliku dimenzija izmedju 100px*100px i 300px*300px!';
        } else {
          this.profile_pic = file;
          this.pic_err = '';
          console.log('Sacuvana slika.');
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onCreditCardInput() {
    const num = this.credit_card.replace(/\D/g,'');

    if (num.length == 15 && /^(300|301|302|303|36|38)\d{0,13}$/.test(num)) {
      this.cardType = 'diners';
    } else if (num.length == 16) {
      if (/^(4539|4556|4916|4532|4929|4485|4716)\d{0,12}$/.test(num)) {
        this.cardType = 'visa';
      } else if (/^(51|52|53|54|55)\d{0,14}$/.test(num)) {
        this.cardType = 'master';
      } else {
        this.cardType = '';
      }
    } else {
      this.cardType = '';
    }
  }

  getIcon() {
    return this.cardType;
  }

  invalidCard(card: string): boolean {
    if (this.cardType == '')
      return true;
    else return false;
  }

  nazad() {
    this.ruter.navigate(['']);
  }
}