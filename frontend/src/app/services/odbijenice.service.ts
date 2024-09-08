import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Odbijenica } from '../models/odbijenica';

@Injectable({
  providedIn: 'root'
})
export class OdbijeniceService {

  private uri = "http://localhost:4000/odbijenice"

  constructor(private http: HttpClient) { }

  sacuvajOdbijenicu(dekorater: string, datum: Date, komentar: string) {
    const data = {
      dekorater: dekorater,
      datum: datum,
      komentar: komentar
    }
    return this.http.post(`${this.uri}/sacuvajOdbijenicu`, data);
  }

  getOdbijenice(dekorater: string) {
    return this.http.get<Odbijenica[]>(`${this.uri}/getOdbijenice/${dekorater}`)
  }
}
