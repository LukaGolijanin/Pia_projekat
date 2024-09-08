import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Firma } from 'src/app/models/firma';
import { Korisnik } from 'src/app/models/korisnik';
import { ZakazivanjaService } from 'src/app/services/zakazivanja.service';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css']
})
export class Step2Component implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  form: FormGroup;
  basta_tip: string = '';

  firma: Firma = new Firma();
  dekorateri: Korisnik[] | null = null;
  dekorater: Korisnik | undefined= new Korisnik();

  selektovaneUsluge: string[] = [];

  err: string = '';

  constructor(private fb: FormBuilder,
    private router: Router,
    private ZakazivanjaServis: ZakazivanjaService,
  ) {
    this.form = this.fb.group({
      bazen: [null, [Validators.min(0)]],
      zelenilo: [null, [Validators.min(0)]],
      stoloviPovrsina: [null, [Validators.min(0)]],
      fontana: [null, [Validators.min(0)]],
      stoloviBroj: [null, [Validators.min(0)]],
      dodatno: ['']
    });
  }

  ngOnInit(): void {
      let step1Form = JSON.parse(localStorage.getItem('step1') || '{}');
      this.basta_tip = step1Form.basta_tip;

      if (this.basta_tip == 'privatna') {
        this.form.addControl('bazen',this.fb.control(null,Validators.required));
        this.form.addControl('stoloviPovrsina', this.fb.control(null, Validators.required));
        this.form.removeControl('fontana');
        this.form.removeControl('stoloviBroj');
      } else if (this.basta_tip == 'restoranska') {
        this.form.addControl('fontana', this.fb.control(null, Validators.required));
        this.form.addControl('stoloviBroj', this.fb.control(null, Validators.required));
        this.form.removeControl('bazen');
        this.form.removeControl('stoloviPovrsina');
      }

      let firm = localStorage.getItem('firma');
      if (firm != null) {
        this.firma = JSON.parse(firm);
      }

      const step2Data = JSON.parse(localStorage.getItem('step2') || '{}');
      if (Object.keys(step2Data).length) {
        this.form.patchValue(step2Data);
      }
  }

  updateSelektovane(usluga: string, isChecked: boolean) {
    if (isChecked) {
      if (!this.selektovaneUsluge.includes(usluga)) {
        this.selektovaneUsluge.push(usluga);
      }
    } else {
      this.selektovaneUsluge = this.selektovaneUsluge.filter(us => us != usluga);
    }
  }

  update(usluga: string, event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.updateSelektovane(usluga, input.checked);
    }
  }

  isChecked(u: string): boolean {
    return this.selektovaneUsluge.includes(u);
  }
  canvasData: string = '';

  potvrdi() {
    if (this.form.valid) {
      const total_area = JSON.parse(localStorage.getItem('step1') || '{}').area;

      if ((total_area != this.form.get('bazen')?.value + this.form.get('zelenilo')?.value + this.form.get('stoloviPovrsina')?.value && this.basta_tip == 'privatna') ||
          total_area < this.form.get('fontana')?.value + this.form.get('zelenilo')?.value && this.basta_tip == 'restoranska') {
        this.err = 'Površine se ne poklapaju.';
      } else {
        let vlasnik = JSON.parse(localStorage.getItem('ulogovan') || '{}').kor_ime;
        if (vlasnik) {
          const canvas = this.canvas.nativeElement;
          const canvasURL = canvas.toDataURL('image/png');
          this.canvasData = this.isCanvasEmpty() ? '' : canvasURL;

          let d = JSON.parse(localStorage.getItem('step1') || '{}').dateTime;
          console.log(d);
          
          const data = {
            ...this.form.value,
            datum: d,
            area: JSON.parse(localStorage.getItem('step1') || '{}').area,
            basta_tip: this.basta_tip,
            firma: this.firma.naziv,
            vlasnik: vlasnik,
            dekorater: '',
            usluge: this.selektovaneUsluge,
            raspored: this.canvasData,
          }
          console.log('Data: ', data);
          
          this.ZakazivanjaServis.zakazi(data).subscribe(resp => {
            if ((resp as any)['message'] == 'uspesno') {
              this.router.navigate(['vlasnik/firme/detaljiFirme']);
              localStorage.removeItem('step1');
              localStorage.removeItem('step2');  
            } else {
              alert('Greska!');
            }
          });    
        }
      }
    } else {
          this.err = 'Unesite pravilne podatke.';
    }
  }
  
  nazad() {
    localStorage.setItem('step2', JSON.stringify(this.form.value));
    this.router.navigate(['vlasnik/firme/detaljiFirme/step1']);
  }

  // UCITAVANJE JSON FAJLA

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;
        try {
          const jsonData = JSON.parse(fileContent);
          
          // Check if the JSON contains base64 image data
          if (jsonData.image && jsonData.image.data) {
            this.renderImageFromBase64(jsonData.image.data);
          } else if (jsonData.url) {
            this.renderImageFromURL(jsonData.url)
          }
          else {
            // Check if the JSON contains shapes
            if (Array.isArray(jsonData.shapes)) {
              this.oblici = jsonData.shapes;
              this.refresh();
            } else {
              console.error('Invalid json format.');
            }
          }
          
          
        } catch (e) {
          console.error('Error parsing JSON:', e);
        }
      };
      reader.readAsText(file);
    }
  }

  renderImageFromURL(imageUrl: string) {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      const img = new Image();
      img.src = imageUrl;
  
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
  
      img.onerror = () => {
        console.error('Failed to load image from URL.');
      };
    } else {
      console.error('Canvas context not available.');
    }
  }

  renderImageFromBase64(base64String: string) {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      const img = new Image();
      img.src = base64String;
  
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
  
      img.onerror = () => {
        console.error('Failed to load image from base64 string.');
      };
    } else {
      console.error('Canvas context not available.');
    }
  }

  // CRTANJE

  dozvoljeneKombinacije: { oblik: string, boja: string }[] = [
    { oblik: 'square', boja: 'green' },
    { oblik: 'rectangle', boja: 'gray' },
    { oblik: 'circle', boja: 'blue' },
    { oblik: 'circle', boja: 'brown' },
    { oblik: 'rectangle', boja: 'blue' }
  ];

  trenutnaKombinacija: { oblik: string, boja: string } = this.dozvoljeneKombinacije[0];

  velicina: number = 50;
  crtanje: boolean = false;
  startX: number = 0;
  startY: number = 0;
  height: number = 0;
  width: number = 0;

  oblici: any[] = [];

  ngAfterViewInit(): void {
    if (this.canvas) {
      this.setupCanvas();
    } else {
      console.error('Nema kanvasa?');
    }
  }

  setupCanvas() {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      canvas.addEventListener('mousedown', (event) => this.pocni(event));
      canvas.addEventListener('mouseup',() => this.stop());
      canvas.addEventListener('mousemove', (event) => this.crtaj(event));
    } else {
      console.error('Nema canvas konteksta?');
    }
  }

  dozvoliCrtanje() {
    this.crtanje = true;
  }

  pocni(event: MouseEvent) {
    if (!this.crtanje) {
      this.crtanje = true;
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      this.startX = event.clientX - rect.left;
      this.startY = event.clientY - rect.top;
    }
  }

  stop() {
    if (this.crtanje) {
      this.crtanje = false;
      const noviOblik = {
        oblik: this.trenutnaKombinacija.oblik,
        boja: this.trenutnaKombinacija.boja,
        x: this.startX,
        y: this.startY,
        radius: this.velicina,
        width: this.width,
        height: this.height
      };
  
      console.log('Saving shape:', noviOblik); // Debug shape properties
  
      if (!this.preklapanje(noviOblik)) {
        this.oblici.push(noviOblik);
        this.refresh();
      } else {
        alert('PREKLAPANJE');
      }
    }
  }

  crtaj(event: MouseEvent) {
    if (this.crtanje) {
      const canvas = this.canvas.nativeElement;
      const ctx = canvas.getContext('2d');
  
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
  
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.refresh();
  
        ctx.fillStyle = this.trenutnaKombinacija.boja;
        ctx.strokeStyle = this.trenutnaKombinacija.boja;
  
        if (this.trenutnaKombinacija.oblik === 'rectangle') {
          this.width = x - this.startX;
          this.height = y - this.startY;

          if (this.width < 0) {
            this.startX += this.width;
            this.width = -this.width;
          }
          if (this.height < 0) {
            this.startY += this.height;
            this.height = -this.height;
          }
  
          ctx.fillRect(this.startX, this.startY, this.width, this.height);
        } else if (this.trenutnaKombinacija.oblik === 'square') {
          const size = Math.min(x - this.startX, y - this.startY);
  
          if (size < 0) {
            this.startX += size;
            this.startY += size;
            this.width = this.height = -size;
          } else {
            this.width = this.height = size;
          }
  
          ctx.fillRect(this.startX, this.startY, this.width, this.height);
        } else if (this.trenutnaKombinacija.oblik === 'circle') {
          this.velicina = Math.sqrt(Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2));
  
          ctx.beginPath();
          ctx.arc(this.startX, this.startY, this.velicina, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  }
  

  preklapanje(obl: any): boolean {
    return this.oblici.some(o => this.proveri(o, obl));
  }

  proveri(o1: any, o2: any): boolean {
    if (o1.oblik === 'rectangle' || o1.oblik === 'square') {
      if (o2.oblik === 'rectangle' || o2.oblik === 'square') {
        return this.rectsOverlap(o1, o2);
      } else if (o2.oblik === 'circle') {
        return this.rectCircleOverlap(o1, o2);
      }
    } else if (o1.oblik === 'circle') {
      if (o2.oblik === 'circle') {
        return this.circlesOverlap(o1, o2);
      } else if (o2.oblik === 'rectangle' || o2.oblik === 'square') {
        return this.rectCircleOverlap(o2, o1);
      }
    }
    return false;
  }

  rectsOverlap(rect1: any, rect2: any): boolean {
    return !(rect1.x + rect1.width < rect2.x ||
             rect1.y + rect1.height < rect2.y ||
             rect1.x > rect2.x + rect2.width ||
             rect1.y > rect2.y + rect2.height);
  }

  circlesOverlap(circle1: any, circle2: any): boolean {
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (circle1.radius + circle2.radius);
  }

  rectCircleOverlap(rect: any, circle: any): boolean {
    const distX = Math.abs(circle.x - rect.x - rect.width / 2);
    const distY = Math.abs(circle.y - rect.y - rect.height / 2);

    if (distX > (rect.width / 2 + circle.radius)) { return false; }
    if (distY > (rect.height / 2 + circle.radius)) { return false; }

    if (distX <= (rect.width / 2)) { return true; }
    if (distY <= (rect.height / 2)) { return true; }

    const dx = distX - rect.width / 2;
    const dy = distY - rect.height / 2;
    return (dx * dx + dy * dy <= (circle.radius * circle.radius));
  }

  refresh() {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.oblici.forEach(o => {
        ctx.fillStyle = o.boja;
        ctx.strokeStyle = o.boja;

        if (o.oblik === 'rectangle') {
          ctx.fillRect(o.x, o.y, o.width, o.height);
        } else if (o.oblik === 'square') {
          ctx.fillRect(o.x, o.y, o.width, o.width);
        } else if (o.oblik === 'circle') {
          ctx.beginPath();
          ctx.arc(o.x, o.y, o.radius, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          //console.error('Unknown shape');
        }
      });
    }
  }

  obrisi() {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      this.oblici = [];
    }
  }

  getCustomText(combo: any): string {
    if (combo.boja == 'green' && combo.oblik == 'square') {
      return 'Zelena površina';
    } else if (combo.boja == 'gray' && combo.oblik == 'rectangle') {
      return 'Stolice/ležaljke';
    } else if (combo.boja == 'blue' && combo.oblik == 'rectangle') {
      return 'Površina bazena';
    } else if (combo.boja == 'brown' && combo.oblik == 'circle') {
      return 'Stolovi';
    } else {
      return 'Površina fontane';
    }
  }

  isCanvasEmpty(): boolean {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < pixelData.data.length; i += 4) {
        if (pixelData.data[i] !== 0 || pixelData.data[i + 1] !== 0 || pixelData.data[i + 2] !== 0 || pixelData.data[i + 3] !== 0) {
          return false; 
        }
      }
    }
    return true; 
  }
}
