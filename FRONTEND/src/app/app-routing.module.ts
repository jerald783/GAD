
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin_components/admin-login/admin-login.component';
import { MainComponent } from './users_components/main/main.component';
import { EventsComponent } from './users_components/events/events.component';
import { GadDatabasesComponent } from './users_components/gad-databases/gad-databases.component';
import { GadResourceComponent } from './users_components/gad-resource/gad-resource.component';
import { ContactComponent } from './users_components/contact/contact.component';
import { AuthGuard } from '../auth.guard';
import { SidenavComponent } from './admin_components/sidenav/sidenav.component';
import { DashboardComponent } from './admin_components/dashboard/dashboard.component';
import { GadEventsComponent } from './admin_components/gad-events/gad-events.component';
import { RepositoryComponent } from './admin_components/repository/repository.component';
import { RegisterComponent } from './admin_components/register/register.component';

const routes: Routes = [
  // 🌐 Public Routes
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: MainComponent },

  { path: 'events', component: EventsComponent},
  { path: 'Gad_Databases', component: GadDatabasesComponent},
  { path: 'Gad_src', component: GadResourceComponent },
  { path: 'contact', component: ContactComponent },

  // 🛡️ Admin Routes with Secondary Outlet
    { path: 'admin-login', component: AdminLoginComponent },

  {
    path: 'admin',
        canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: SidenavComponent,
  
    children: [
      { path: '', component: SidenavComponent , outlet: 'secondary',canActivate: [AuthGuard], }, // Default Admin View
      { path: 'dashboard', component: DashboardComponent, outlet: 'secondary',canActivate: [AuthGuard], },
      { path: 'GADevents', component: GadEventsComponent, outlet: 'secondary',canActivate: [AuthGuard],},
      { path: 'admin-repo', component: RepositoryComponent, outlet: 'secondary',canActivate: [AuthGuard],},
      { path: 'admin-register', component: RegisterComponent, outlet: 'secondary',canActivate: [AuthGuard], },
    ], 
    
  },

  // 🚨 Fallback Route
  { path: '**', redirectTo: '/main' } // Redirect unknown paths to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

