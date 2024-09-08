import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Korisnik } from 'src/app/models/korisnik';
import { Zakazivanje } from 'src/app/models/zakazivanje';
import { ZakazivanjaService } from 'src/app/services/zakazivanja.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-statistika',
  templateUrl: './statistika.component.html',
  styleUrls: ['./statistika.component.css']
})
export class StatistikaComponent implements OnInit, AfterViewInit {

  @HostListener('window:resize')
  onResize() {
    if (this.pita) this.pita.resize();
    if (this.histogram) this.histogram.resize();
  }

  ngAfterViewInit(): void {
    this.initPitaDijagram();
    this.histogramPodaci(this.firmina);
  }

  pita: any;
  histogram: any;

  ulogovan: Korisnik = new Korisnik();
  svaZakazivanja: Zakazivanje[] = [];
  firmina: Zakazivanje[] = [];
  moja: Zakazivanje[] = [];
  echartOption: any;

  constructor(private zakazivanjaServis: ZakazivanjaService) {}

  ngOnInit(): void {
    let korisnik = localStorage.getItem('ulogovan');
    if (korisnik != null) {
      this.ulogovan = JSON.parse(korisnik);
      this.zakazivanjaServis.getZakazivanja().subscribe(x => {
        if (x) {
          this.svaZakazivanja = x;
          this.firmina = this.svaZakazivanja.filter(x => x.firma == this.ulogovan.firma);
          this.moja = this.svaZakazivanja.filter(x => x.dekorater == this.ulogovan.kor_ime);

          const dijagram1 = this.dijagramMesecni(this.moja);
          this.echartOption = this.dijagramOpcije(dijagram1);
          
          this.initPitaDijagram();
          this.histogramPodaci(this.firmina);
        }
      })
    }    
  }

  dijagramMesecni(z: Zakazivanje[]) {
    const svi = [
      'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul',
      'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
    ];

    const mesecnaMapa = new Map<number, string>();
    svi.forEach((mesec, id) => mesecnaMapa.set(id, mesec));

    const brPoMesecu = (data: Date[]) => {
      const res: { [key: string]: number } = {};
      data.forEach(date => {
        const mid = date.getMonth();
        const mesec = mesecnaMapa.get(mid) || 'nepoznato';   
        res[mesec] = (res[mesec] || 0) + 1;
      });
      return res;
    };

    const radoviD = z.map(z => new Date(z.datum)).filter(d => !isNaN(d.getTime()));
    const servisD = z.map(z => z.datumServisiranja ? new Date(z.datumServisiranja) : null)
    .filter((d): d is Date => d != null && !isNaN(d.getTime()));

    const sviDatumi: Date[] = [...radoviD, ...servisD];
    const cnt = brPoMesecu(sviDatumi);
    
    console.log('Podaci:', cnt);

    const kalendar = svi;

    return {
      meseci: kalendar,
      cnt: kalendar.map(mesec => cnt[mesec] || 0)
    };
  }

  dijagramPita(data: { [key: string]: number}) {
    const ukupno = Object.values(data).reduce((sum, v) => sum + v, 0);

    const pitaData = Object.entries(data).map(([dek,cnt]) => ({
      name: dek,
      value: (cnt/ukupno) * 100
    }));

    console.log('Pita podaci:', pitaData);

    return {
      title: {
        text: 'Raspodela poslova u firmi',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Dekorater',
          type: 'pie',
          radius: '50%',
          data: pitaData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              sadowOffsetX: 0,
              shadowColor: 'rgba(0,0,0,0.5)'
            }
          }
        }
      ]
    };
  }

  distribucijaDekoratera(z: Zakazivanje[]) {
    const dc: { [key: string]: number } = {};

    z.forEach(z => {
      const dek = z.dekorater;
      if (dek) {
        dc[dek] = (dc[dek] || 0) + 1;
      }
    });
    return dc;
  }

  dijagramOpcije(data: any) {
    console.log('U dijagramu: ', data);
    return {
      title: {
        text: 'Poslovi po mesecima'
      },
      tooltip: {},
      legend: {
        data: ['Poslovi']
      },
      xAxis: {
        type: 'category',
        data: data.meseci
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Poslovi',
          type: 'bar',
          data: data.cnt
        }
      ]
    };
  }

  initPitaDijagram() {
    const pitaData = this.distribucijaDekoratera(this.firmina);
    const opcije = this.dijagramPita(pitaData);

    const div = document.getElementById('d2');
    if (div) {
      this.pita = echarts.init(div);
      this.pita.setOption(opcije);
    } else {
      console.error('Pita nije pronadjena');
    }
  }

  histogramPodaci(z: Zakazivanje[]) {
    const sad = new Date();
    const period = new Date(sad.setMonth(sad.getMonth() - 24));

    const filter = z.filter(z => new Date(z.datum) >= period);

    // Spajanje po danima
    const daniCnt: { [key: string]: number[] } = {};
    filter.forEach(z => {
      const dan = new Date(z.datum).getDay();
      const dani = ['NED','PON','UTO','SRE','ČET','PET','SUB'];
      const imeDana = dani[dan];

      if (!daniCnt[imeDana]) {
        daniCnt[imeDana] = [];
      }
      daniCnt[imeDana].push(1);
    });

    // Nalazenje proseka
    const prosekPoDanu = Object.keys(daniCnt).reduce((val, dan) => {
      const ukupno = daniCnt[dan].length;
      const mesec = new Set(filter.map(z => new Date(z.datum).getMonth() + 1)).size;
      val[dan] = ukupno/mesec;
      return val;
    }, {} as { [key: string]: number});

    const daniUNedelji = ['PON', 'UTO', 'SRE', 'ČET', 'PET', 'SUB', 'NED'];
    const prosecno = daniUNedelji.map(dan => prosekPoDanu[dan] || 0);

    this.initHistogram(daniUNedelji, prosecno);
  }

  initHistogram(dani: string[], p: number[]) {
    const div = document.getElementById('d3');
    if (div) {
      this.histogram = echarts.init(div);
      this.histogram.setOption({
        title: {
          text: 'Prosečan mesečni broj poslova po danima u nedelji',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        xAxis: {
          type: 'category',
          data: dani
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Broj poslova',
            type: 'bar',
            data: p
          }
        ]
      });
    } else {
      console.error('Nema histograma');
    }
  }
}
