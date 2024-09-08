import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import flatpickr from 'flatpickr';
import { forkJoin } from 'rxjs';
import { Korisnik } from 'src/app/models/korisnik';
import { Odbijenica } from 'src/app/models/odbijenica';
import { Zakazivanje } from 'src/app/models/zakazivanje';
import { OdbijeniceService } from 'src/app/services/odbijenice.service';
import { UsersService } from 'src/app/services/users.service';
import { ZakazivanjaService } from 'src/app/services/zakazivanja.service';

@Component({
  selector: 'app-odrzavanjad',
  templateUrl: './odrzavanjad.component.html',
  styleUrls: ['./odrzavanjad.component.css']
})
export class OdrzavanjadComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('flatpickrInput') flatpickrInput!: ElementRef;

  ulogovan: Korisnik = new Korisnik();
  ZahteviZaOdrzavanje: Zakazivanje[] = [];
  mojaOdrzavanja: Zakazivanje[] = [];
  mojeOdbijenice: Odbijenica[] = [];

  flatpickrInitialized = false;


  constructor(private zakazivanjeServis: ZakazivanjaService,
    private odbijeniceServis: OdbijeniceService,
    private korisniciServis: UsersService
  ) {}

  refresh() {
    this.mojaOdrzavanja.forEach(x => {
      let sad = new Date();
      if (x.datumServisiranja) {
        let xDatum = new Date(x.datumServisiranja);
        if (xDatum.getTime() < sad.getTime()) {
          this.korisniciServis.zavrsiPosao(this.ulogovan.kor_ime, xDatum).subscribe((resp: any) => {
            if (resp['message'] == 'uspesno') {
              let zDatum = new Date(x.datumZakazivanja);
              const data = {
                datum: zDatum,
                status: 'gotovo',
                dekorater: this.ulogovan.kor_ime,
                firma: this.ulogovan.firma,
              }
              this.zakazivanjeServis.promeniStatus(data).subscribe(resp => {
                if ((resp as any)['message'] == 'uspesno') {
                  console.log('Uspesna promena');
                  this.zakazivanjeServis.getMojaServisiranja(this.ulogovan.kor_ime).subscribe(z => {
                    if (z) {
                      this.mojaOdrzavanja = z;
                    } else {
                      alert('Nije moguce pokupiti potvrdjena servisiranja.');
                    }
                  })
                  this.zakazivanjeServis.getZahteviServisa(this.ulogovan.firma).subscribe(z => {
                    if (z) {
                      this.mojaOdrzavanja = z;
                    } else {
                      alert('Nije moguce pokupiti zahteve servisiranja.');
                    }
                  })
                }
              })
            } else {
              alert('Greška u refresh');
            }
          })
        }
      } 
    })
  }

  initializeFlatpickr() {
    if (this.flatpickrInput && this.flatpickrInput.nativeElement) {
      const sutra = new Date();
      sutra.setDate(sutra.getDate() + 1);

      flatpickr(this.flatpickrInput.nativeElement, {
        enableTime: true,
        dateFormat: 'Y-m-d H:i',
        minDate: sutra
      });
    }
  }

  ngAfterViewInit(): void {
    this.initializeFlatpickr();
  }

  ngAfterViewChecked(): void {
    if (this.flatpickrInput && this.flatpickrInput.nativeElement && !this.flatpickrInitialized) {
      const rect = this.flatpickrInput.nativeElement.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        this.initializeFlatpickr();
        this.flatpickrInitialized = true;
      }
    }
  }

  ngOnInit(): void {
    let korisnik = localStorage.getItem('ulogovan');
    if (korisnik != null) {
      this.ulogovan = JSON.parse(korisnik);

      forkJoin({
        zahtevi: this.zakazivanjeServis.getZahteviServisa(this.ulogovan.firma),
        odbijenice: this.odbijeniceServis.getOdbijenice(this.ulogovan.kor_ime),
        odrzavanja: this.zakazivanjeServis.getMojaServisiranja(this.ulogovan.kor_ime)
      }).subscribe(results => {
        if (results.zahtevi) {
          this.ZahteviZaOdrzavanje = results.zahtevi;
          if (results.odbijenice) {
            this.mojeOdbijenice = results.odbijenice;
            const odbijeniceDatumi = this.mojeOdbijenice.map(o => new Date(o.datum).getTime());

            this.ZahteviZaOdrzavanje = this.ZahteviZaOdrzavanje.filter(z => {
              const zDatum = new Date(z.datumZakazivanja).getTime();
              return !odbijeniceDatumi.includes(zDatum);
            });
          }
        }
        if (results.odrzavanja) {
          this.mojaOdrzavanja = results.odrzavanja;
        }

        this.refresh();
      });
    }
  }

  kliknut: Zakazivanje | null = null;
  
  odbij(d: Date) {
    if (d) {
      this.odbijeniceServis.sacuvajOdbijenicu(this.ulogovan.kor_ime,d,'').subscribe((resp: any) => {
        if (resp['message'] == 'uspesno') {
          this.odbijeniceServis.getOdbijenice(this.ulogovan.kor_ime).subscribe(o => {
            if (o) {
              this.mojeOdbijenice = o;
              this.kliknut = null;
              const odbijeniceDatumi = this.mojeOdbijenice.map(o => new Date(o.datum).getTime());

                this.ZahteviZaOdrzavanje = this.ZahteviZaOdrzavanje.filter(z => {
                  const zDatum = new Date(z.datumZakazivanja).getTime();
                  return !odbijeniceDatumi.includes(zDatum);
                });
            } else {
              alert('Nije moguce pokupiti odbijenice.');
            }
          })
        } else {
          alert('Neuspelo cuvanje odbijenice.');
        }
      })
    } else {
      alert('Nema datuma');
    }
  } 

  komentar: string = '';

  edit(z: Zakazivanje) {
    if (this.kliknut && this.kliknut == z) {
      this.kliknut = null;
      this.komentar = '';
    } else {
      this.kliknut = z;
      this.komentar = '';
    }
  }

  potvrdi(zakaz: Date, dateValue: string) {
    const datumZ = new Date(zakaz);
    const datumServisa = new Date(dateValue);

    if (dateValue && datumServisa >= new Date() && datumZ) {
      const data = {
        dekorater: this.ulogovan.kor_ime,
        firma: this.ulogovan.firma,
        datumZakazivanja: datumZ,
        datumServisiranja: datumServisa
      };
      this.zakazivanjeServis.potvrdiServis(data).subscribe((resp) => {
        if ((resp as any)['message'] == 'uspesno') {
          this.korisniciServis.uzmiPosao(this.ulogovan.kor_ime,datumServisa).subscribe(resp => {
            if ((resp as any)['message'] == 'uspesno') {
              this.zakazivanjeServis.getMojaServisiranja(this.ulogovan.kor_ime).subscribe(z => {
                if (z) {
                  this.mojaOdrzavanja = z;
                }
              })
              this.zakazivanjeServis.getZahteviServisa(this.ulogovan.firma).subscribe(z => {
                if (z) {
                  this.ZahteviZaOdrzavanje = z;
                }
              })
            } else {
              alert('Neuspelo prihvatanje posla.');
            }
          })
        } else {
          alert('Neuspelo zakazivanje datuma');
        }
      })
    } else {
      this.komentar = 'Datum mora biti u budućnosti.'
    }
  }
}
