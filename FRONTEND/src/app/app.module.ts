import { HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { BrowserModule } from "@angular/platform-browser";
import { OAuthModule } from "angular-oauth2-oidc";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AdminLoginComponent } from "./admin_components/admin-login/admin-login.component";
import { DashboardComponent } from ".//admin_components/dashboard/dashboard.component";
import { AddEditEventsComponent } from ".//admin_components/gad-events/add-edit-events/add-edit-events.component";
import { GadEventsComponent } from "./admin_components/gad-events/gad-events.component";
import { ShowEventsComponent } from ".//admin_components/gad-events/show-events/show-events.component";
import { AddEditRegComponent } from "./admin_components/register/add-edit-reg/add-edit-reg.component";
import { RegisterComponent } from "./admin_components/register/register.component";
import { ShowRegComponent } from "./admin_components/register/show-reg/show-reg.component";
import { AddEditRepoComponent } from "./admin_components/repository/add-edit-repo/add-edit-repo.component";
import { RepositoryComponent } from "./admin_components/repository/repository.component";
import { ShowRepoComponent } from "./admin_components/repository/show-repo/show-repo.component";

import { SidenavComponent } from "./admin_components/sidenav/sidenav.component";
import { ContactComponent } from "./users_components/contact/contact.component";
import { EventsComponent } from "./users_components/events/events.component";
import { GadDatabasesComponent } from "./users_components/gad-databases/gad-databases.component";

import { HeaderComponent } from "./users_components/header/header.component";
import { MainComponent } from "./users_components/main/main.component";
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import { GadResourceComponent } from "./users_components/gad-resource/gad-resource.component";
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from "ngx-toastr";
import { MatExpansionModule } from '@angular/material/expansion'; // ✅ Add this
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // ✅ Needed for Material animations
import { MatCardModule } from '@angular/material/card';
import { AppInitService } from "../services/app-init.service";

export function initializeApp(appInitService: AppInitService): () => Promise<void> {
  return () => appInitService.loadConfig();
}
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    EventsComponent,
    SidenavComponent,
    ContactComponent,
    DashboardComponent,
    GadEventsComponent,
    GadDatabasesComponent,
  HeaderComponent,
    RegisterComponent,
    AdminLoginComponent,
    RepositoryComponent,
    AddEditRepoComponent,
    ShowRepoComponent,
    GadResourceComponent,

    ShowRegComponent,
    AddEditRegComponent,
    AddEditEventsComponent,
    ShowEventsComponent



    
    

    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //Auth
    // OAuthModule.forRoot(),
    HttpClientModule,
    //Material
    MatSidenavModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule ,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 1000,
      extendedTimeOut: 1000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-center',
    }),
        BrowserAnimationsModule, // ✅ REQUIRED
    MatExpansionModule,        // ✅ Register the accordion component
    MatCardModule,
    
    
  ],
   providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppInitService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
