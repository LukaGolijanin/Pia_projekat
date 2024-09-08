import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import flatpickr from 'flatpickr';
import { Firma } from 'src/app/models/firma';
import { Korisnik } from 'src/app/models/korisnik';
import { UsersService } from 'src/app/services/users.service';
import { buducnostValidator } from 'src/app/validator/buducnostValidator';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css']
})
export class Step1Component implements OnInit, AfterViewInit {
  form: FormGroup;
  firma: Firma = new Firma();
  dekorateri: Korisnik[] = [];
  date: Date | null = null;

  err: string = "";

  constructor(private fb: FormBuilder,
    private router: Router,
    private korisniciServis: UsersService
  ) {
    this.form = this.fb.group({
      dateTime: [null, [Validators.required, buducnostValidator()]],
      area: [null, [Validators.required, Validators.min(1)]],
      basta_tip: ['', Validators.required]
    });
  }

  ngOnInit(): void {
      const step1Data = JSON.parse(localStorage.getItem('step1') || '{}');
      const fir = localStorage.getItem('firma');
      if (fir) {
        this.firma = JSON.parse(fir);
      }

      if (step1Data && step1Data.dateTime) {
        this.date = new Date(step1Data.dateTime);
      } else {
        this.date = new Date(); 
      }

      if (Object.keys(step1Data).length) {
        this.form.patchValue(step1Data);
      }

  }

  dalje() {
    if (this.form.valid && this.date) {
      let pocetak = new Date(this.firma.odmor_pocetak);
      let kraj = new Date(this.firma.odmor_kraj);
      if (this.DaLiJeOdmor(this.date,pocetak,kraj)) {
        const formatP = this.formatDate(pocetak);
        const formatK = this.formatDate(kraj);
        this.err = 'Firma je na odmoru od ' + formatP + ' do ' + formatK + '.';
      } else {

        this.form.patchValue({ dateTime: this.formatDateForInput(this.date) });

        this.korisniciServis.getSlobodniDekorateri(this.firma.naziv,this.date).subscribe(k => {
          if (k && k.length > 0) {
            const formData = this.form.value;
            if (this.date != null)
              formData.dateTime = this.date.toISOString(); 
            localStorage.setItem('step1', JSON.stringify(formData));
            this.err = '';
            console.log('Data', localStorage.getItem('step1'));
            this.router.navigate(['/vlasnik/firme/detaljiFirme/step2']);
            this.form.reset();
        } else {
          this.err = 'Nema slobodnih dekoratera tog datuma.'
        }
      })
        
      } 
    } else {
        this.err = 'Proverite da li ste ispravno uneli sve podatke.';
    }
  }

  get dateTimeControl(): FormControl {
    return this.form.get('dateTime') as FormControl;
  }

  ngAfterViewInit(): void {
    flatpickr('#datetime-picker', {
      enableTime: true,
      dateFormat: 'd-m-Y H:i',
      onChange: (selectedDates) => {
        this.date = selectedDates[0] as Date;
        this.form.get('dateTime')?.setValue(this.formatDateForInput(this.date));
      }
    });
  }

  ocistiPolja() {
    localStorage.removeItem('step1');
    localStorage.removeItem('step2');
    this.form.reset();
  }

  DaLiJeOdmor(targetDate: Date, startDate: Date, endDate: Date): boolean {
    return targetDate >= startDate && targetDate <= endDate;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  formatDateForInput(date: Date): string {
    return date.toISOString();
  }
}
