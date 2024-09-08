import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../models/korisnik';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  constructor(private servis: UsersService) {}

  ulogovan: Korisnik = new Korisnik();

  profilePicURL: string | undefined;
  edit: boolean = false;
  dugme: string = '';

  ime: string = '';
  prezime: string = '';
  adresa: string = '';
  email: string = '';
  tel: string = '';
  credit_card: string = '';
  profile_pic: File | null = null;
  pic_err: string = '';
  cardType: string = '';
  err: boolean = false;
  err_text: string = '';

  ngOnInit(): void {
    let korisnik = localStorage.getItem('ulogovan');
    if (korisnik != null) {
      this.ulogovan = JSON.parse(korisnik);
      this.profilePicURL = `http://localhost:4000/uploads/${this.ulogovan.profile_pic}`;
    }
  }

  editing() {
    this.edit  = !this.edit;
    if (this.edit == false) {
      this.ime = '';
      this.prezime = '';
      this.email = '';
      this.tel = '';
      this.credit_card = '';
      this.profile_pic = null;
    }
  }

  confirm() {
    this.servis.updateProfile(this.ulogovan.kor_ime,this.ime,this.prezime,this.adresa,
      this.email,this.tel,this.credit_card,this.ulogovan.tip,this.profile_pic).subscribe((resp) => {
        if ((resp as any)['message'] == 'email greska') {
          this.err_text = 'E-mail adresa je već iskorišćena!';
        } else if ((resp as any)['message'] == 'uspesno') {
          
          this.servis.getUserData(this.ulogovan.kor_ime).subscribe({ // Upozorenje - depricated???
            next: (user: Korisnik) => {
              this.ulogovan = user;
              localStorage.setItem('ulogovan', JSON.stringify(this.ulogovan));
              this.profilePicURL = `http://localhost:4000/uploads/${this.ulogovan.profile_pic}`;
              this.edit = false;
              
              this.ime = '';
              this.prezime = '';
              this.adresa = '';
              this.email = '';
              this.tel = '';
              this.credit_card = '';
              this.profile_pic = null;
            },
            error: (error: any) => {
              console.error('Failed to fetch', error);
              alert('GRESKA PRI PONOVNOM UCITAVANJU!');
            }
          });
        } else if ((resp as any)['message'] == 'update greska') {
          alert('Uredjivanje profila nije uspelo - pokušajte ponovo!');
        } else {
          alert('GREŠKA U SISTEMU!');
        }
      })
  
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // VALIDACIJA
      const tipovi = ['image/jpeg', 'image/png'];
      if (!tipovi.includes(file.type)) {
        this.pic_err = 'Odaberite PNG ili JPG format slike!'
        this.err = true;
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
          this.err = true;
          return;
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

  invalidCard(card: string): boolean {
    if (this.cardType == '')
      return true;
    else return false;
  }
}
