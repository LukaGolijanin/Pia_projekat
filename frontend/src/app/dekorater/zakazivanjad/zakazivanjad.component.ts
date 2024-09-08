import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Korisnik } from 'src/app/models/korisnik';
import { Odbijenica } from 'src/app/models/odbijenica';
import { Zakazivanje } from 'src/app/models/zakazivanje';
import { OdbijeniceService } from 'src/app/services/odbijenice.service';
import { UsersService } from 'src/app/services/users.service';
import { ZakazivanjaService } from 'src/app/services/zakazivanja.service';

@Component({
  selector: 'app-zakazivanjad',
  templateUrl: './zakazivanjad.component.html',
  styleUrls: ['./zakazivanjad.component.css']
})
export class ZakazivanjadComponent implements OnInit {

  ulogovan: Korisnik = new Korisnik();
  zakazivanja: Zakazivanje[] = [];
  mojiPoslovi: Zakazivanje[] = [];
  mojeOdbijenice: Odbijenica[] = [];
  komentar: string = '';

  constructor(private ruter: Router,
     private zakazivanjaServis: ZakazivanjaService,
    private odbijeniceServis: OdbijeniceService,
    private korisniciServis: UsersService) {}

  private refresh() {
    const odbijeniceDatumi = this.mojeOdbijenice.map(o => new Date(o.datum).getTime());

    this.zakazivanja = this.zakazivanja.filter(z => {
      const zDatum = new Date(z.datumZakazivanja).getTime();
      return !odbijeniceDatumi.includes(zDatum);
    });

    this.mojiPoslovi.forEach(x => {
      let sad = new Date();
      let xDatum = new Date(x.datum);
      if (xDatum.getTime() < sad.getTime()) {
        this.korisniciServis.zavrsiPosao(this.ulogovan.kor_ime, xDatum).subscribe((resp: any) => {
          if (resp['message'] == 'uspesno') {
            let zDatum = new Date(x.datumZakazivanja);
            const data = {
              datum: zDatum,
              status: 'gotovo',
              dekorater: this.ulogovan.kor_ime,
              firma: this.ulogovan.firma
            }
            this.zakazivanjaServis.promeniStatus(data).subscribe(resp => {
              if ((resp as any)['message'] == 'uspesno' ) {
                console.log('Uspesna promena');
                this.zakazivanjaServis.getPotvrdjenaZakazivanja(this.ulogovan.kor_ime).subscribe(z => {
                  if (z) {
                    this.mojiPoslovi = z;
                  } else {
                    alert('Nije moguce pokupiti potvrdjene poslove.');
                  }
                })
              }
            })
          } else {
            alert('Greska u refresh');
          }
        })
      }
    })
  }

  ngOnInit(): void {
      let korisnik = localStorage.getItem('ulogovan');
      if (korisnik != null) {
        this.ulogovan = JSON.parse(korisnik);
        
        const zakazivanjaa = this.zakazivanjaServis.getFirminaZakazivanja(this.ulogovan.firma);
        const potvrdjenaZakazivanjaa = this.zakazivanjaServis.getPotvrdjenaZakazivanja(this.ulogovan.kor_ime);
        const odbijenicee = this.odbijeniceServis.getOdbijenice(this.ulogovan.kor_ime);

        forkJoin([zakazivanjaa,potvrdjenaZakazivanjaa,odbijenicee]).subscribe((
          [zakazivanja, potvrdjenaZakazivanja, odbijenice]
        ) => {
          if (zakazivanja) {
            this.zakazivanja = zakazivanja;
            this.sortZakazivanjaByDate();
          } else {
            alert('Nije moguce pokupiti zakazivanja.');
          }
    
          if (potvrdjenaZakazivanja) {
            this.mojiPoslovi = potvrdjenaZakazivanja;
          } else {
            alert('Nije moguce pokupiti potvrdjene poslove.');
          }
    
          if (odbijenice) {
            this.mojeOdbijenice = odbijenice;
          } else {
            alert('Nije moguce pokupiti odbijenice.');
          }
  
          this.refresh();
        }, err => {
          alert('Greška učitvanja.');
          console.log(err);
        });
      } else {
        alert('Niste prijavljeni.');
        this.ruter.navigate(['']);
      }
  }

  potvrdi(d: Date, dz: Date) {
    if (d && dz) {
      const dd = new Date(d);
      const dzz = new Date(dz);
      this.korisniciServis.uzmiPosao(this.ulogovan.kor_ime,dd).subscribe((resp) => {
        if ((resp as any)['message'] != 'uspesno') {
          alert('Greška uzimanja posla!');
          return; 
        } 
      });
      const data = {
        datum: dzz,
        status: 'potvrdjen',
        dekorater: this.ulogovan.kor_ime,
        firma: this.ulogovan.firma
      }
      this.zakazivanjaServis.promeniStatus(data).subscribe((respp) => {
        if ((respp as any)['message'] == 'uspesno') {
          this.zakazivanjaServis.getFirminaZakazivanja(this.ulogovan.firma).subscribe(z => {
            if (z) {
              this.zakazivanja = z;
              this.sortZakazivanjaByDate();
            } else {
              alert('Nije moguce pokupiti zakazivanja.');
            }
          })
          this.zakazivanjaServis.getPotvrdjenaZakazivanja(this.ulogovan.kor_ime).subscribe(z => {
            if (z) {
              this.mojiPoslovi = z;
            } else {
              alert('Nije moguce pokupiti potvrdjene poslove.');
            }
          })
        } 
      })
      
    } else {
      alert('Datumi nisu validni!');
    }
  }

  odbij(d: Date) {
    if (this.komentar != '') {
      if (d) {
        this.odbijeniceServis.sacuvajOdbijenicu(this.ulogovan.kor_ime,d,this.komentar).subscribe((resp: any) => {
          if (resp['message'] == 'uspesno') {
            this.odbijeniceServis.getOdbijenice(this.ulogovan.kor_ime).subscribe(o => {
              if (o) {
                this.mojeOdbijenice = o;
                this.refresh();
                this.komentar = '';
                this.kliknut = null;
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
        this.komentar = '';
      }
    } else {
      alert('Komentar je obavezan za odbijanje zakazivanja!');
    }
  }

  sortZakazivanjaByDate() {
    this.zakazivanja.sort((a, b) => {
      const prvi = new Date(a.datumZakazivanja);
      const drugi = new Date(b.datumZakazivanja);

      return prvi.getTime() - drugi.getTime(); 
    });
  }

  kliknut: Zakazivanje | null = null;

  edit(z: Zakazivanje) {
    if (this.kliknut && this.kliknut == z) {
      this.kliknut = null;
      this.komentar = '';
    } else {
      this.kliknut = z;
      this.komentar = '';
    }
  }
}
