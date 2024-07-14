import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { VerifiedComponent } from './verified/verified.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { authGuardGuard } from './auth-guard.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
// import { LoginComponent } from './login/login.component';


export const routes: Routes = [
  { path: '', redirectTo:'login', pathMatch:'full'},
  { path: 'register', component: RegisterComponent },
  // { path: 'login', component: LoginComponent },
  {path:'verify/:id', component:VerifiedComponent},
  {path:'login',component:LoginComponent},
  {path:'home',component:HomeComponent, canActivate: [authGuardGuard]},
  {path:'forgot-password',component:ForgotPasswordComponent},
  {path:'reset-password/:token',component:ResetPasswordComponent},
  // {path:'password-reset',component:PasswordResetComponent}
];
