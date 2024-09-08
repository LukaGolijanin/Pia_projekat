import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { PromenaComponent } from './promena/promena.component';
import { DekoraterComponent } from './dekorater/dekorater.component';
import { VlasnikComponent } from './vlasnik/vlasnik.component';
import { ProfilComponent } from './profil/profil.component';
import { FirmeComponent } from './firme/firme.component';
import { ZakazivanjaComponent } from './zakazivanja/zakazivanja.component';
import { OdrzavanjeComponent } from './odrzavanje/odrzavanje.component';
import { ProfildComponent } from './dekorater/profild/profild.component';
import { ZakazivanjadComponent } from './dekorater/zakazivanjad/zakazivanjad.component';
import { OdrzavanjadComponent } from './dekorater/odrzavanjad/odrzavanjad.component';
import { StatistikaComponent } from './dekorater/statistika/statistika.component';
import { AdminComponent } from './admin/admin.component';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { Step1Component } from './firme/step1/step1.component';
import { Step2Component } from './firme/step2/step2.component';
import { DetaljiFirmeComponent } from './firme/detalji-firme/detalji-firme.component';

const routes: Routes = [
  { path: "", component: HomeComponent},
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent},
  { path: "promena", component: PromenaComponent},
  { path: "dekorater", component: DekoraterComponent,
    children: [
      { path: '', redirectTo: 'dekorater/profild', pathMatch: 'full'},
      { path: 'dekorater/profild', component: ProfildComponent},
      { path: 'dekorater/zakazivanjad', component: ZakazivanjadComponent},
      { path: 'dekorater/odrzavanjad', component: OdrzavanjadComponent},
      { path: 'dekorater/statistika', component: StatistikaComponent}
    ]
  },
  { path: "vlasnik", component: VlasnikComponent,
    children: [
      { path: '', redirectTo: 'profil', pathMatch: 'full'},
      { path: 'profil', component: ProfilComponent},
      { path: 'firme', component: FirmeComponent},
      { path: 'firme/detaljiFirme', component: DetaljiFirmeComponent,
        children: [
        { path: 'step1', component: Step1Component},
        { path: 'step2', component: Step2Component},       
        ]
      },
      { path: 'zakazivanja', component: ZakazivanjaComponent},
      { path: 'odrzavanje', component: OdrzavanjeComponent}
    ]
  },
  { path: "admin", component: AdminComponent},
  { path: "adminlogin", component: AdminloginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
