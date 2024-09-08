import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firma } from '../models/firma';

@Injectable({
  providedIn: 'root'
})
export class FirmeService {

  private uri = "http://localhost:4000/firme" 

  constructor(private http: HttpClient) { }

  getFirme() {
    return this.http.get<Firma[]>(`${this.uri}/getFirme`);
  }

  registrujFirmu(naziv: string, adresa: string, tel: string, usluge: Array<string>,
    cene: Array<number>, lat: number, lng: number,
    pocetak: Date, kraj: Date ) {
    const data = {
      naziv: naziv,
      adresa: adresa,
      tel: tel,
      usluge: JSON.stringify(usluge),
      cene: JSON.stringify(cene),
      lat: lat.toString(),
      lng: lng.toString(),
      pocetak: pocetak.toISOString(),
      kraj: kraj.toISOString()
    }

    console.log('FormData: ', data);

    return this.http.post(`${this.uri}/registrujFirmu`, data);
  }
}
