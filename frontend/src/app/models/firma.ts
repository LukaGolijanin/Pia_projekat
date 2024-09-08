export class Firma {
    naziv: string = '';
    adresa: string = '';
    usluge: Array<string> = [];
    cenovnik: Array<number> = [];
    tel: string = '';
    komentari: Array<string> = [];
    br_ocena: number = 0;
    suma_ocena: number = 0;
    odmor_kraj: Date = new Date();
    odmor_pocetak: Date = new Date();
    lat: number = 0;
    lng: number = 0;
}