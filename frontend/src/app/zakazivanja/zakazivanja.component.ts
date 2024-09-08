import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../models/korisnik';
import { ZakazivanjaService } from '../services/zakazivanja.service';
import { Zakazivanje } from '../models/zakazivanje';

@Component({
  selector: 'app-zakazivanja',
  templateUrl: './zakazivanja.component.html',
  styleUrls: ['./zakazivanja.component.css']
})
export class ZakazivanjaComponent implements OnInit {

  ulogovan: Korisnik = new Korisnik();
  trenutnaZakazivanja: Zakazivanje[] = [];
  arhivaZakazivanja: Zakazivanje[] = [];

  constructor(private zakazivanjaServis: ZakazivanjaService) {}

  ngOnInit(): void {
      let korisnik = localStorage.getItem('ulogovan');
    if (korisnik != null) {
      this.ulogovan = JSON.parse(korisnik);
      this.zakazivanjaServis.getMojaTrenutnaZakazivanja(this.ulogovan.kor_ime).subscribe(z => {
        if (z) {
          this.trenutnaZakazivanja = z;
        }
      });
      this.zakazivanjaServis.getMojaArhivaZakazivanja(this.ulogovan.kor_ime).subscribe(z => {
        if (z) {
          this.arhivaZakazivanja = z;
        }
      })
    }
  }

  otkazivanje(d: Date) {
    const sad = new Date();
    const danUBuducnosti = new Date(sad.getTime() + 24*60*60*1000);
    const taj = new Date(d);

    return (taj >= danUBuducnosti);
  }

  otkazi(d: Date) {
    let dat = new Date(d);
    const data = {
      vlasnik: this.ulogovan.kor_ime,
      datumD: dat
    }
    this.zakazivanjaServis.otkazi(data).subscribe((resp: any) => {
      if (resp['message'] == 'uspesno') {
        this.zakazivanjaServis.getMojaTrenutnaZakazivanja(this.ulogovan.kor_ime).subscribe(z => {
          if (z) {
            this.trenutnaZakazivanja = z;
          }
        });
      } else {
        alert('Brisanje nije uspelo.');
      }
    })
  }
}
