import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { FirmeService } from '../services/firme.service';
import { Firma } from '../models/firma';
import { Korisnik } from '../models/korisnik';
import { NgForm } from '@angular/forms';
import * as L from 'leaflet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private map: L.Map | undefined;
  private marker: L.Marker |  null = null;
  private markerLocation: { lat: number; lng: number } | null = null;

  initMap() {
    this.map = L.map('map', {
      center: [44.8176, 20.4633], // Center on Belgrade
      zoom: 13, // Initial zoom level
      maxZoom: 18, // Maximum zoom level
      minZoom: 10, // Minimum zoom level
      zoomControl: true, // Enable zoom control
      dragging: true, // Enable dragging
    }).setView([44.8176, 20.4633], 13); // BEOGRAD

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    if (this.map)
      this.map.on('click', (event: L.LeafletEvent) => this.onMapClick(event));
  }

  private onMapClick(event: L.LeafletEvent): void {
    const latlng = (event as L.LeafletMouseEvent).latlng;
    this.updateMarker(latlng);
  }

  private updateMarker(latlng: L.LatLng): void {
    if (this.map) {
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      const redIcon = L.icon({
        iconUrl: 'assets/pinn.png', 
        iconSize: [20, 20], 
        iconAnchor: [10, 25], 
        popupAnchor: [0, -20] 
      });

      this.marker = L.marker([latlng.lat, latlng.lng], {icon: redIcon})
        .addTo(this.map)
        .bindPopup('Izabrana lokacija')
        .openPopup();

      this.markerLocation = { lat: latlng.lat, lng: latlng.lng };
    }
  }

  onNavigate(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      
      const elPos = el.getBoundingClientRect();
      const elTop = elPos.top + window.pageYOffset;

      const offset = 100;
      const scrollToPos = elTop - offset;

      window.scrollTo({
        top: scrollToPos,
        behavior: 'smooth'
      });
    }
  }

  ulogovan: Korisnik = new Korisnik();

  constructor(private korisniciServis: UsersService, 
    private firmeServis: FirmeService,
    private ruter: Router) {}

  firme: Firma[] = [];
  dekorateri: Korisnik[] = [];
  vlasnici: Korisnik[] = [];

  kor_ime: string = "";
  lozinka: string = "";
  ime: string = "";
  prezime: string = "";
  pol: string = "";
  adresa: string = "";
  tel: string = "";
  email: string = "";
  firma: string = "";
  profile_pic: File | null = null;

  cardTypeV: string = "";

  err: string = "";
  pass_err: string = "";
  pic_err: string = "";
  err_text: string = "";

  noviD: boolean = false;
  dugmeDekorater: boolean = true;

  editingVlasnik: Korisnik | null = null;
  editingDekorater: Korisnik | null = null;

  upVlasnik: Korisnik = new Korisnik();
  upDekorater: Korisnik = new Korisnik();

  profile_picV: File | null = null;
  profile_picD: File | null = null;
  pic_errV: string = "";
  pic_errD: string = "";
  errD1: string = "";
  errD2: string = "";

  novaF: boolean = false;
  dugmeFirma: boolean = true;
  noviD1: Korisnik = new Korisnik();
  noviD2: Korisnik = new Korisnik();
  novaFirma: Firma = new Firma();

  profile_picD1: File | null = null;
  profile_picD2: File | null = null;
  pic_errD1: string = "";
  pic_errD2: string = "";
  pass_errD1: string = "";
  pass_errD2: string = "";
  
  ngOnInit(): void {
    let korisnik = localStorage.getItem('ulogovan');
    if (korisnik != null) {
      this.ulogovan = JSON.parse(korisnik);
      if (this.ulogovan.tip != 'admin') {
        this.ruter.navigate(['home']);
      }
      this.korisniciServis.getDekorteri().subscribe(k => {
        if (k) {
          this.dekorateri = k;
        }
      });
      this.korisniciServis.getVlasnici().subscribe(k => {
        if (k) {
          this.vlasnici = k;

        }
      });
      this.firmeServis.getFirme().subscribe(f => {
        if (f) {
          this.firme = f;
        }
      })
      this.dugmeDekorater = true;
    } 
    this.ocistiNizove();
    this.initMap();
  }

  logout() {
    localStorage.clear();
    this.ruter.navigate([''])
  }

  odustani() {
    this.noviD = false;
    this.dugmeDekorater = true;
    this.kor_ime = "";
    this.lozinka = "";
    this.ime = "";
    this.prezime = "";
    this.pol = "";
    this.adresa = "";
    this.tel = "";
    this.email = "";
    this.firma = "";
    this.profile_pic = null;
  }

  dodaj() {
    this.noviD = true;
    this.dugmeDekorater = false;
  }

  odustaniOdFirme(form: NgForm) {
    this.novaFirma.adresa = '';
    this.novaFirma.cenovnik = [];
    this.novaFirma.naziv = '';
    this.novaFirma.odmor_kraj = new Date();
    this.novaFirma.odmor_pocetak = new Date();
    this.novaFirma.tel = '';
    this.novaFirma.usluge = [];
    this.ocistiNizove();
    form.resetForm();
    if (this.map) {
      this.marker = null;
      this.map.off();
      this.map.remove(); 
    }

    // Reinitialize the map
    this.initMap();
    
  }

  promeniStatus(kor_ime: string, tip: string) {
    this.korisniciServis.promeniStatus(kor_ime).subscribe((resp) => {
      if ((resp as any)['message'] == 'uspesno') {
        if (tip == 'vlasnik') {
          this.korisniciServis.getVlasnici().subscribe(k => {
            if (k) {
              this.vlasnici = k;
            }
          });
        } else {
          this.korisniciServis.getDekorteri().subscribe(k => {
            if (k) {
              this.dekorateri = k;
            }
          });
        }
      }
    })
  }

  novaFirmaSubmit(form: NgForm) {
    if (form.valid) {
      if (this.nepostojecaFirma(this.novaFirma.naziv)) {
        if (this.usl.length == 0 || this.usl[0] == '') {
          alert('Dodajte barem 1 uslugu!');
          return;
        }
        if (this.cene.length == 0 || this.cene[0] <= 0) {
          alert('Cena usluge mora biti veća od 0');
          return;
        }
        if (this.markerLocation == null) {
          alert('Morate označiti lokaciju firme!');
          return;
        }
        if (this.postojeciKorisnik(this.noviD1.kor_ime) || this.postojeciKorisnik(this.noviD2.kor_ime)
        || this.postojeciMail(this.noviD1.email) || this.postojeciMail(this.noviD1.email)) {
          alert('Proverite korisnička imena i e-mail adrese novih dekoratera!');
          return;
        }
        if (!this.passwordValidator(this.noviD1.lozinka,0) || !this.passwordValidator(this.noviD2.lozinka,0)) {
          alert('Proverite lozinke dekoratera!');
          return;
        }
        let pocetak = new Date(this.novaFirma.odmor_pocetak);
        let kraj = new Date(this.novaFirma.odmor_kraj); 
        this.firmeServis.registrujFirmu(this.novaFirma.naziv,this.novaFirma.adresa,
          this.novaFirma.tel,this.usl,this.cene,this.markerLocation.lat,
          this.markerLocation.lng,pocetak,kraj)
          .subscribe((resp => {
            if ((resp as any)['message'] == 'registrovana') {
              if (this.profile_picD1) {
                this.korisniciServis.posaljiZahtev(this.noviD1.kor_ime, this.noviD1.lozinka,
                  this.noviD1.ime,this.noviD1.prezime,this.noviD1.pol,
                  this.noviD1.adresa,this.noviD1.tel,this.noviD1.email,this.novaFirma.naziv,
                  'dekorater',this.profile_picD1).subscribe(resp => {
                    if ((resp as any)['message']=='poslat') {
                      //alert('OK');
                      this.korisniciServis.getDekorteri().subscribe(k => {
                        if (k) {
                          this.dekorateri = k;
                        }
                      });
                      
                    } else {
                      alert('ERROR');
                      this.errD1 = "Nije moguće poslati zahtev!"
                    }
                  })
              } else {
                this.korisniciServis.posaljiZahtev(this.noviD1.kor_ime, this.noviD1.lozinka,
                  this.noviD1.ime,this.noviD1.prezime,this.noviD1.pol,
                  this.noviD1.adresa,this.noviD1.tel,this.noviD1.email,this.novaFirma.naziv,
                  'dekorater').subscribe(resp => {
                    if ((resp as any)['message']=='poslat') {
                      //alert('OK');
                      this.korisniciServis.getDekorteri().subscribe(k => {
                        if (k) {
                          this.dekorateri = k;
                        }
                      });
                    } else {
                      alert('ERROR');
                      this.errD1 = "Nije moguće poslati zahtev!"
                    }
                  })
              }
              if (this.profile_picD2) {
                this.korisniciServis.posaljiZahtev(this.noviD2.kor_ime, this.noviD2.lozinka,
                  this.noviD2.ime,this.noviD2.prezime,this.noviD2.pol,
                  this.noviD2.adresa,this.noviD2.tel,this.noviD2.email,this.novaFirma.naziv,
                  'dekorater',this.profile_picD2).subscribe(resp => {
                    if ((resp as any)['message']=='poslat') {
                      //alert('OK');
                      this.korisniciServis.getDekorteri().subscribe(k => {
                        if (k) {
                          this.dekorateri = k;
                        }
                      });
                    } else {
                      alert('ERROR');
                      this.errD2 = "Nije moguće poslati zahtev!"
                    }
                  })
              } else {
                this.korisniciServis.posaljiZahtev(this.noviD2.kor_ime, this.noviD2.lozinka,
                  this.noviD2.ime,this.noviD2.prezime,this.noviD2.pol,
                  this.noviD2.adresa,this.noviD2.tel,this.noviD2.email,this.novaFirma.naziv,
                  'dekorater').subscribe(resp => {
                    if ((resp as any)['message']=='poslat') {
                      //alert('OK');
                      this.korisniciServis.getDekorteri().subscribe(k => {
                        if (k) {
                          this.dekorateri = k;
                        }
                      });
                      
                    } else {
                      alert('ERROR');
                      this.errD2 = "Nije moguće poslati zahtev!"
                    }
                  })
              }
              this.firmeServis.getFirme().subscribe(f => {
                if (f) {
                  this.firme = f;
                }
              })
              this.odustaniOdFirme(form);
              alert('Firma je registrovana!');
            } else {
              alert('ERROR');
            }
          }));
        
      } else {
        alert('Firma sa odabranim nazivom već postoji!');
      }
    } else {
      alert('Proverite sve podatke!');
    }
  }

  noviDekorater(form: NgForm) {
    if (form.valid) {
      if (this.passwordValidator(this.lozinka,0)) {
        const pc = this.profile_pic;
        if (this.nepostojecaFirma(this.firma)) {
          alert('Unesite postojeću firmu');
          return;
        }
        if (pc) {
          this.korisniciServis.posaljiZahtev(this.kor_ime, this.lozinka, this.ime,
            this.prezime, this.pol, this.adresa, this.tel,
            this.email , this.firma, 'dekorater', pc).subscribe((resp) => {
              if ((resp as any)['message']=='poslat') {
                alert('OK');
                this.korisniciServis.getDekorteri().subscribe(k => {
                  if (k) {
                    this.dekorateri = k;
                  }
                });
                this.noviD = false;
                this.dugmeDekorater = true;
                this.kor_ime = "";
                this.lozinka = "";
                this.ime = "";
                this.prezime = "";
                this.pol = "";
                this.adresa = "";
                this.tel = "";
                this.email = "";
                this.profile_pic = null;
                this.firma = "";
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
          this.korisniciServis.posaljiZahtev(this.kor_ime, this.lozinka, this.ime,
            this.prezime, this.pol, this.adresa, this.tel,
            this.email, this.firma, 'dekorater').subscribe((resp) => {
              if ((resp as any)['message']=='poslat') {
                alert('OK');
                this.korisniciServis.getDekorteri().subscribe(k => {
                  if (k) {
                    this.dekorateri = k;
                  }
                })
                this.noviD = false;
                this.dugmeDekorater = true;
                this.kor_ime = "";
                this.lozinka = "";
                this.ime = "";
                this.prezime = "";
                this.pol = "";
                this.adresa = "";
                this.tel = "";
                this.email = "";
                this.profile_pic = null;
                this.firma = "";
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
        alert('Unesite ispravnu lozinku!');
      }  
    } else {
      alert('Proverite sve podatke!');
    }    
  }

  passwordValidator(password: string, c: number): boolean {
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
      switch(c) {
        case 1:
          this.pass_err = "Lozinka mora da ima izmedju 6 i 10 karaktera, minimum 1 veliko slovo, 3 mala slova, 1 cifru i 1 specijalan karakter, kao i da počinje slovom.";
          break;
        case 2:
          this.pass_errD1 = "Lozinka mora da ima izmedju 6 i 10 karaktera, minimum 1 veliko slovo, 3 mala slova, 1 cifru i 1 specijalan karakter, kao i da počinje slovom.";
          break;
        case 3:
          this.pass_errD2 = "Lozinka mora da ima izmedju 6 i 10 karaktera, minimum 1 veliko slovo, 3 mala slova, 1 cifru i 1 specijalan karakter, kao i da počinje slovom.";
          break;
      }
    }
    return yes;
  }

  onFileChange(event: Event, c: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // VALIDACIJA
      const tipovi = ['image/jpeg', 'image/png'];
      if (!tipovi.includes(file.type)) {
        switch(c) {
          case 1:
            this.pic_err = 'Odaberite PNG ili JPG format slike!'
            break;
          case 2:
            this.pic_errD = 'Odaberite PNG ili JPG format slike!'
            break;
          case 3:
            this.pic_errV = 'Odaberite PNG ili JPG format slike!'
            break;
          case 4:
            this.pic_errD1 = 'Odaberite PNG ili JPG format slike!'
            break;
          case 5:
            this.pic_errD2 = 'Odaberite PNG ili JPG format slike!'
        }
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
          switch(c) {
            case 1:
              this.pic_err = 'Dimenzije slike nisu odgovarajuće! Izaberite sliku dimenzija izmedju 100px*100px i 300px*300px!';
              break;
            case 2:
              this.pic_errD = 'Dimenzije slike nisu odgovarajuće! Izaberite sliku dimenzija izmedju 100px*100px i 300px*300px!';
              break;
            case 3:
              this.pic_errV = 'Dimenzije slike nisu odgovarajuće! Izaberite sliku dimenzija izmedju 100px*100px i 300px*300px!';
              break;
            case 4:
              this.pic_errD1 = 'Dimenzije slike nisu odgovarajuće! Izaberite sliku dimenzija izmedju 100px*100px i 300px*300px!';
              break;
            case 5:
              this.pic_errD2 = 'Dimenzije slike nisu odgovarajuće! Izaberite sliku dimenzija izmedju 100px*100px i 300px*300px!';
              break;
          }
        } else {
          switch(c) {
            case 1:
              this.profile_pic = file;
              this.pic_err = '';
              break;
            case 2:
              this.profile_picD = file;
              this.pic_errD = '';
              break;
            case 3:
              this.profile_picV = file;
              this.pic_errV = '';
              break;
            case 4:
              this.profile_picD1 = file;
              this.pic_errD1 = '';
              break;
            case 5:
              this.profile_picD2 = file;
              this.pic_errD2 = '';
              break;
          }
          console.log('Sacuvana slika.');
        }
      };
      reader.readAsDataURL(file);
    }
  }

  confirmV(kor: Korisnik) {
    this.korisniciServis.updateProfile(kor.kor_ime,this.upVlasnik.ime,this.upVlasnik.prezime,this.upVlasnik.adresa,
      this.upVlasnik.email,this.upVlasnik.tel,this.upVlasnik.credit_card,'vlasnik',this.profile_picV).subscribe((resp) => {
        if ((resp as any)['message'] == 'email greska') {
          this.err_text = 'E-mail adresa je već iskorišćena!';
        } else if ((resp as any)['message'] == 'uspesno') {
          
          this.korisniciServis.getUserData(kor.kor_ime).subscribe({ // Upozorenje - depricated???
            next: (user: Korisnik) => {
              let k = this.vlasnici.find(p => p.kor_ime = user.kor_ime);
              if (k) {
                k.ime = user.ime;
                k.prezime = user.prezime;
                k.adresa = user.adresa;
                k.email = user.email;
                k.tel = user.tel;
                k.pol = user.pol;
                k.profile_pic = user.profile_pic;
              }
              this.upVlasnik.ime = '';
              this.upVlasnik.prezime = '';
              this.upVlasnik.adresa = '';
              this.upVlasnik.email = '';
              this.upVlasnik.tel = '';
              this.upVlasnik.pol = '';
              this.upVlasnik.credit_card = '';
              this.profile_picV = null;
              this.editingVlasnik = null;
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

  confirmD(kor: Korisnik) {
    if (!this.nepostojecaFirma(this.upDekorater.firma)) {
      this.korisniciServis.updateProfile(kor.kor_ime,this.upDekorater.ime,this.upDekorater.prezime,this.upDekorater.adresa,
        this.upDekorater.email,this.upDekorater.tel,this.upDekorater.firma,'dekorater',this.profile_picD).subscribe((resp) => {
          if ((resp as any)['message'] == 'email greska') {
            this.err_text = 'E-mail adresa je već iskorišćena!';
          } else if ((resp as any)['message'] == 'uspesno') {
            
            this.korisniciServis.getUserData(kor.kor_ime).subscribe({ // Upozorenje - depricated???
              next: (user: Korisnik) => {
                let k = this.dekorateri.find(p => p.kor_ime = user.kor_ime);
                if (k) {
                  k.ime = user.ime;
                  k.prezime = user.prezime;
                  k.adresa = user.adresa;
                  k.email = user.email;
                  k.tel = user.tel;
                  k.pol = user.pol;
                  k.profile_pic = user.profile_pic;
                  k.firma = user.firma;
                }
                this.upDekorater.ime = '';
                this.upDekorater.prezime = '';
                this.upDekorater.adresa = '';
                this.upDekorater.email = '';
                this.upDekorater.tel = '';
                this.upDekorater.pol = '';
                this.upDekorater.firma = '';
                this.profile_picD = null;
                this.editingDekorater = null;
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
  }

  editingV(kor: Korisnik) {
    if (this.editingVlasnik != kor) {
      this.editingVlasnik = kor;
    } else {
      this.editingVlasnik = null;
    }
    if (this.editingVlasnik != kor) {
      this.upVlasnik.ime = '';
      this.upVlasnik.prezime = '';
      this.upVlasnik.email = '';
      this.upVlasnik.tel = '';
      this.upVlasnik.adresa = '';
      this.upVlasnik.credit_card = '';
      this.profile_picV = null;
    }
  }

  editingD(kor: Korisnik) {
    if (this.editingDekorater != kor) {
      this.editingDekorater = kor;
    } else {
      this.editingDekorater = null;
    }
    if (this.editingDekorater != kor) {
      this.upDekorater.ime = '';
      this.upDekorater.prezime = '';
      this.upDekorater.email = '';
      this.upDekorater.tel = '';
      this.upDekorater.adresa = '';
      this.upDekorater.firma = '';
      this.profile_picD = null;
    }
  }
  onCreditCardInput() {
    
    const num = this.upVlasnik.credit_card.replace(/\D/g,'');

    if (num.length == 15 && /^(300|301|302|303|36|38)\d{0,13}$/.test(num)) {
      this.cardTypeV = 'diners';
    } else if (num.length == 16) {
      if (/^(4539|4556|4916|4532|4929|4485|4716)\d{0,12}$/.test(num)) {
        this.cardTypeV = 'visa';
      } else if (/^(51|52|53|54|55)\d{0,14}$/.test(num)) {
        this.cardTypeV = 'master';
      } else {
        this.cardTypeV = '';
      }
    } else {
      this.cardTypeV = '';
    }
  }

  invalidCard(): boolean {
    if (this.cardTypeV == '')
      return true;
    else return false;
  }

  nepostojecaFirma(naziv: string): boolean {
    if (this.firme.find(f => f.naziv == naziv) != null) {
      return false;
    } else {
      return true;
    }
  }

  postojeciKorisnik(kor_ime: string): boolean {
    if ((this.dekorateri.find(f => f.kor_ime == kor_ime) != null)
  || (this.vlasnici.find(f => f.kor_ime == kor_ime) != null)) {
      return true;
    }
    return false;
  }

  postojeciMail(email: string): boolean {
    if ((this.dekorateri.find(f => f.email == email) != null)
    || (this.vlasnici.find(f => f.email == email) != null)) {
      return true;
    }
    return false;
  }

  usluge: { id: number, val1: string, val2: number }[] = [];
  nextU: number = 1;

  usl: string[] = [];
  cene: number[] = [];

  dodajUslugu() {
    const newId = this.usluge.length ? this.usluge[this.usluge.length - 1].id + 1 : 1;
    this.usluge.push({ id: newId, val1: '', val2: 0 });
  }

  azurirajVal(id: number, event: Event, type: 'val1' | 'val2') {
    const inputEvent = event as InputEvent;
    const target = inputEvent.target as HTMLInputElement;

    if (target) {
      const val = target.value;
      const input = this.usluge.find(input => input.id == id);
      if (input) {
        if (type == 'val1') {
          input.val1 = val;
        } else {
          input.val2 = Number(val);
        }
        this.azurirajNizove();
      }
    }
  }

  azurirajNizove() {
    this.usl = this.usluge.map(input => input.val1);
    this.cene = this.usluge.map(input => input.val2);
  }

  ocistiNizove() {
    this.usluge = [];
    this.usl = [];
    this.cene = [];
  }

  validateDates(form: NgForm) {
    const startDate = new Date(this.novaFirma.odmor_pocetak);
    const endDate = new Date(this.novaFirma.odmor_kraj);

    if (startDate > endDate) {
      form.controls['start'].setErrors({ invalidDateRange: true });
      form.controls['end'].setErrors({ invalidDateRange: true });
    } else {
      form.controls['start'].setErrors(null);
      form.controls['end'].setErrors(null);
    }
  }

  getParovi(f: Firma) {
    return Array.from({ length: Math.max(f.usluge.length, f.cenovnik.length)}, (_, i) => i);
  }
}
