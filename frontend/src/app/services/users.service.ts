import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Korisnik } from '../models/korisnik';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private uri = "http://localhost:4000/users" 

  constructor(private http: HttpClient) { }

  posaljiZahtev(kor_ime: string, lozinka: string,
    ime: string, prezime: string, pol: string,
    adresa: string, tel: string, email: string,
    cr_fir: string, tip: string, profile_pic?: File 
  ) {
    const data = new FormData();
    data.append('kor_ime', kor_ime);
    data.append('lozinka', lozinka);
    data.append('ime', ime);
    data.append('prezime', prezime);
    data.append('pol', pol);
    data.append('adresa', adresa);
    data.append('tel', tel);
    data.append('email', email);
    data.append('tip', tip);
    data.append('credit_card_firma', cr_fir); // ILI FIRMA ZA DEKORATERE!!!
    if (profile_pic) {
      data.append('profile_pic', profile_pic);
    }
    return this.http.post(`${this.uri}/posaljiZahtev`, data)
  }

  updateProfile(kor_ime: string, ime: string, prezime: string, adresa: string,
    email: string, tel: string, credit_card_firma: string, tip: string, profile_pic: File | null) {
      const data = new FormData();
      data.append('kor_ime', kor_ime);
      data.append('ime', ime);
      data.append('prezime', prezime);
      data.append('adresa', adresa);
      data.append('email', email);
      data.append('tel', tel);
      data.append('credit_card_firma', credit_card_firma); // KREDITNA ILI FIRMA
      data.append('tip', tip);
      if (profile_pic) {
        data.append('profile_pic', profile_pic);
      }
      return this.http.post(`${this.uri}/updateProfile`, data)  
  }

  login(kor_ime: string, lozinka: string, tip: string) {
    const data = {
      kor_ime: kor_ime,
      lozinka: lozinka,
      tip: tip
    };
    return this.http.post<Korisnik>(`${this.uri}/login`, data);
  }

  promeniLozinku(kor_ime: string, nova: string, stara: string) {
    const data = {
      kor_ime: kor_ime,
      nova: nova,
      stara: stara
    }
    return this.http.post(`${this.uri}/promeniLozinku`, data)
  }

  getUserData(kor_ime: string) {
    return this.http.get<Korisnik>(`${this.uri}/getUser/${kor_ime}`)
  }

  getDekorteri() {
    return this.http.get<Korisnik[]>(`${this.uri}/getDekorateri`)
  }

  getVlasnici() {
    return this.http.get<Korisnik[]>(`${this.uri}/getVlasnici`)
  }

  promeniStatus(kor_ime: string) {
    const data = {
      kor_ime: kor_ime
    }
    return this.http.post(`${this.uri}/promeniStatus`, data)
  }

  getSlobodniDekorateri(firma: string, datum: Date | null) {
    const data = {
      firma: firma,
      datum: datum ? datum.toISOString() : null
    };
    console.log('Data being sent: ', data);
    return this.http.post<Korisnik[]>(`${this.uri}/getSlobodniDekorateri`, data);
  }

  uzmiPosao(kor_ime: string, datum: Date) {
    const data = {
      kor_ime: kor_ime,
      datum: datum.toISOString()
    }
    return this.http.post(`${this.uri}/uzmiPosao`, data);
  }
  zavrsiPosao(kor_ime: string, datum: Date) {
    const data = {
      kor_ime: kor_ime,
      datum: datum.toISOString()
    }
    return this.http.post(`${this.uri}/zavrsiPosao`, data);
  }
}
