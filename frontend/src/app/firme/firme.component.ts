import { Component, OnInit } from '@angular/core';
import { Korisnik } from '../models/korisnik';
import { FirmeService } from '../services/firme.service';
import { UsersService } from '../services/users.service';
import { Firma } from '../models/firma';
import { Router } from '@angular/router';

@Component({
  selector: 'app-firme',
  templateUrl: './firme.component.html',
  styleUrls: ['./firme.component.css']
})
export class FirmeComponent implements OnInit {

  ulogovan: Korisnik = new Korisnik();
  
  constructor(private firmeServis: FirmeService,
    private korisniciServis: UsersService,
    private router: Router
  ) {}

  firme: Firma[] = [];
  dekorateri: Korisnik[] = []

  ngOnInit(): void {
    let korisnik = localStorage.getItem('ulogovan');
    if (korisnik != null) {
      this.ulogovan = JSON.parse(korisnik);
      this.firmeServis.getFirme().subscribe(f => {
        if (f) this.firme = f;
      })
      this.korisniciServis.getDekorteri().subscribe(k => {
        if (k) this.dekorateri = k;
      })
    }
  }

  getParovi(f: Firma) {
    return Array.from({ length: Math.max(f.usluge.length, f.cenovnik.length)}, (_, i) => i);
  }

  aktivniDekorateriFirme(f: string) {
    let fir = this.dekorateri.filter(d => d.firma == f);
    return fir.filter(d => d.odobren == true);
  }

  detalji(firma: Firma) {
    localStorage.setItem('firma', JSON.stringify(firma));
    this.router.navigate(['vlasnik/firme/detaljiFirme']);
  }

  generateStars(f: Firma) {
    const rating = f.suma_ocena / f.br_ocena;
    let full = Math.floor(rating);
    const pola = rating % 1 >= 0.25 && rating % 1 <= 0.75;
    let prazna = 5 - Math.ceil(rating);
    if (rating % 1 > 0.75) {
      full++;
    }

    let starsHTML = '';

    for (let i = 0; i < full; i++) {
      starsHTML += '<i class="star fas fa-star"></i>';
    }

    if (pola) {
      starsHTML += '<i class="star fas fa-star-half-alt"></i>';
    }

    for (let i = 0; i < prazna; i++) {
      starsHTML += '<i class="star far fa-star"></i>';
    }

    return starsHTML;
  }

  calcAvg(sum: number, num: number): number {
    return sum/num;
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
}
