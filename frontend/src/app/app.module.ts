import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { HomeComponent } from './home/home.component';
import { DekoraterComponent } from './dekorater/dekorater.component';
import { VlasnikComponent } from './vlasnik/vlasnik.component';
import { AdminComponent } from './admin/admin.component';
import { PromenaComponent } from './promena/promena.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProfilComponent } from './profil/profil.component';
import { FirmeComponent } from './firme/firme.component';
import { ZakazivanjaComponent } from './zakazivanja/zakazivanja.component';
import { OdrzavanjeComponent } from './odrzavanje/odrzavanje.component';
import { ProfildComponent } from './dekorater/profild/profild.component';
import { ZakazivanjadComponent } from './dekorater/zakazivanjad/zakazivanjad.component';
import { OdrzavanjadComponent } from './dekorater/odrzavanjad/odrzavanjad.component';
import { StatistikaComponent } from './dekorater/statistika/statistika.component';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { MenuComponent } from './admin/menu/menu.component';
import { Step1Component } from './firme/step1/step1.component';
import { Step2Component } from './firme/step2/step2.component';
import { DetaljiFirmeComponent } from './firme/detalji-firme/detalji-firme.component';
import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DekoraterComponent,
    VlasnikComponent,
    AdminComponent,
    PromenaComponent,
    HeaderComponent,
    FooterComponent,
    ProfilComponent,
    FirmeComponent,
    ZakazivanjaComponent,
    OdrzavanjeComponent,
    ProfildComponent,
    ZakazivanjadComponent,
    OdrzavanjadComponent,
    StatistikaComponent,
    AdminloginComponent,
    MenuComponent,
    Step1Component,
    Step2Component,
    DetaljiFirmeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({ echarts })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
