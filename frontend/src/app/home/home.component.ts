import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Korisnik } from '../models/korisnik';
import { Firma } from '../models/firma';
import { FirmeService } from '../services/firme.service';
import { UsersService } from '../services/users.service';
import { ZakazivanjaService } from '../services/zakazivanja.service';
import { Zakazivanje } from '../models/zakazivanje';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private ruter: Router,
      private firmeServis: FirmeService,
      private korisniciServis: UsersService,
      private zakazivanjaServis: ZakazivanjaService
  ) {}

  ulogovan: Korisnik = new Korisnik();
  firme: Firma[] = [];
  dekorateri: Korisnik[] = [];
  zakazivanja: Zakazivanje[] = [];
  brDekoratera: number = 0;
  brVlasnika: number = 0;
  brDan: number = 0;
  brNedelja: number = 0;
  brMesec: number = 0;
  
  ngOnInit(): void {
    let korisnik = localStorage.getItem('ulogovan');
    if (korisnik != null) {
      this.ulogovan = JSON.parse(korisnik);
      this.ruter.navigate([this.ulogovan.tip]);
    } else {
      this.firmeServis.getFirme().subscribe(f => {
        if (f) {
          this.firme = f;
        }
      })
      this.korisniciServis.getDekorteri().subscribe(k => {
        if (k) {
          this.dekorateri = k;
          this.brDekoratera = this.dekorateri.length;
        }
      })
      this.zakazivanjaServis.getZakazivanja().subscribe(z => {
        if (z) {
          this.zakazivanja = z;
          this.brZakazanih();
        }
      })
      this.korisniciServis.getVlasnici().subscribe(k => {
        if (k) {
          this.brVlasnika = k.length;
        }
      })
    }
  }

  aktivniDekorateriFirme(f: string) {
    let fir = this.dekorateri.filter(d => d.firma == f);
    return fir.filter(d => d.odobren == true);
  }

  // ZA PRETRAGU

  filterNaziv: string = '';
  filterAdresa: string = '';
  
  // ZA SORTIRANJE

   po: string = 'naziv';
   pravac: 'asc' | 'desc' = 'asc';
 

  filter() {
    return this.firme.filter( f => 
    (!this.filterNaziv || f.naziv.toLowerCase().includes(this.filterNaziv.toLowerCase())) &&
    (!this.filterAdresa || f.adresa.toLowerCase().includes(this.filterAdresa.toLowerCase()))
    )
    .sort((x,y) => {
      const xx = this.po == 'naziv' ? x.naziv : x.adresa;
      const yy = this.po == 'naziv' ? y.naziv : y.adresa;
      const compare = xx.localeCompare(yy);
      return this.pravac == 'asc' ? compare : -compare;
    })
  }

  sortBy(s: string) {
    if (this.po == s) {
      this.pravac = this.pravac == 'asc' ? 'desc' : 'asc';
    } else {
      this.po = s;
      this.pravac = 'asc';
    }
  }

  brZakazanih() {
    let sad = new Date();
    const dan = new Date(sad.getTime() - 24*60*60*1000);
    const nedelja = new Date(sad.getTime() - 7*24*60*60*1000);
    const mesec = new Date(sad.getTime() - 30*24*60*60*1000);
    
    let cntDan = 0;
    let cntNedelja = 0;
    let cntMesec = 0;

    this.zakazivanja.forEach(z => {
      const dz = new Date(z.datumZakazivanja);
      if (dz >= dan) {
        cntDan++;
      }
      if (dz >= nedelja) {
        cntNedelja++;
      }
      if (dz >= mesec) {
        cntMesec++;
      }
    });

    this.brDan = cntDan;
    this.brNedelja = cntNedelja;
    this.brMesec = cntMesec;
  }
}
