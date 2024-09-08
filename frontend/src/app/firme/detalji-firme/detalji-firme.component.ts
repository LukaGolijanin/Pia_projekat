import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Firma } from 'src/app/models/firma';
import * as L from 'leaflet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalji-firme',
  templateUrl: './detalji-firme.component.html',
  styleUrls: ['./detalji-firme.component.css']
})
export class DetaljiFirmeComponent implements OnInit, AfterViewInit {
  
  firma: Firma = new Firma();

  prosecnaOcena: number = 0;

  private map: L.Map | undefined;
  private marker: L.Marker |  null = null;

  constructor(private router: Router) {}

  initMap() {
    this.map = L.map('map', {
      center: [this.firma.lat, this.firma.lng],
      zoom: 13, // Initial zoom level
      maxZoom: 18, // Maximum zoom level
      minZoom: 10, // Minimum zoom level
      zoomControl: true, // Enable zoom control
      dragging: true, // Enable dragging
    }).setView([this.firma.lat,this.firma.lng] ,13); // BEOGRAD

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: 'assets/pinn.png', // Path to your custom pin image
      iconSize: [32, 32], // Size of the icon [width, height]
      iconAnchor: [16, 32], 
      popupAnchor: [0, -32] 
    });

    this.marker = L.marker([this.firma.lat,this.firma.lng], {icon: customIcon}).addTo(this.map);
  }

  ngOnInit(): void {
      const fir = localStorage.getItem('firma');
      if (fir) {
        this.firma = JSON.parse(fir);
        if (this.firma.br_ocena) {
          this.prosecnaOcena = this.firma.suma_ocena/this.firma.br_ocena;
        } else {
          this.prosecnaOcena = 0;
        }
        
      }
  }

  getParovi(f: Firma) {
      return Array.from({ length: Math.max(f.usluge.length, f.cenovnik.length)}, (_, i) => i);
  }
  ngAfterViewInit(): void {
    this.initMap();
  }

  generateStars() {
    const rating = this.prosecnaOcena;
    const full = Math.floor(rating);
    const pola = rating % 1 >= 0.25 || rating % 1 <= 0.75;
    let prazna = 5 - Math.ceil(rating);
    if (!pola) {
      prazna = prazna + 1;
    }

    let starsHTML = '';

    for (let i = 0; i < full; i++) {
      starsHTML += '<i class="star fas fa-star"></i>';
    }

    if (pola) {
      starsHTML += '<i class="star fas fa-star-half-alt"></i>';
    }

    for (let i = 0; i < prazna; i++) {
      starsHTML += '<i class="star far fa-star"></i>';
    }

    return starsHTML;
  }

  navigate() {
    localStorage.removeItem('step1');
    localStorage.removeItem('step2');
    this.router.navigate(['/vlasnik/firme/detaljiFirme/step1']);
  }
}
