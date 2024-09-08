import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Zakazivanje } from '../models/zakazivanje';

@Injectable({
  providedIn: 'root'
})
export class ZakazivanjaService {

  private uri = "http://localhost:4000/zakazivanja" 

  constructor(private http: HttpClient) { }

  zakazi(data: any) {
    return this.http.post(`${this.uri}/zakazi`, data);
  }

  getZakazivanja() {
    return this.http.get<Zakazivanje[]>(`${this.uri}/getZakazivanja`)
  }

  getMojaTrenutnaZakazivanja(kor_ime: string) {
    return this.http.get<Zakazivanje[]>(`${this.uri}/getMojaTrenutnaZakazivanja/${kor_ime}`);
  }

  getMojaArhivaZakazivanja(kor_ime: string) {
    return this.http.get<Zakazivanje[]>(`${this.uri}/getMojaArhivaZakazivanja/${kor_ime}`);
  }

  getFirminaZakazivanja(firma: string) {
    return this.http.get<Zakazivanje[]>(`${this.uri}/getFirminaZakazivanja/${firma}`);
  }

  getPotvrdjenaZakazivanja(kor_ime: string) {
    return this.http.get<Zakazivanje[]>(`${this.uri}/getPotvrdjenaZakazivanja/${kor_ime}`);
  }

  otkazi(data: any) {
    return this.http.post(`${this.uri}/otkazi`, data);
  }

  promeniStatus(data: any) {
    return this.http.post(`${this.uri}/promeniStatus`, data);
  }

  getZavrsenaZakazivanja(kor_ime: string) {
    return this.http.get<Zakazivanje[]>(`${this.uri}/getZavrsenaZakazivanja/${kor_ime}`);
  }

  getMojaServisiranja(kor_ime: string) {
    return this.http.get<Zakazivanje[]>(`${this.uri}/getMojaServisiranja/${kor_ime}`);
  }

  getZahteviServisa(firma: string) {
    return this.http.get<Zakazivanje[]>(`${this.uri}/getZahteviServisa/${firma}`);
  }

  zakaziServis(data: any) {
    return this.http.post(`${this.uri}/zakaziServis`, data)
  }

  potvrdiServis(data: any) {
    return this.http.post(`${this.uri}/potvrdiServis`, data);
  }
}
