import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { RegisterComponent } from "./register/register.component";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { HeaderComponent } from "./header/header.component";
import { NgToastComponent, NgToastModule } from "ng-angular-popup";
import { VerifiedComponent } from "./verified/verified.component";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { PasswordResetComponent } from "./password-reset/password-reset.component";



@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HeaderComponent,
    VerifiedComponent,
    LoginComponent,
    HomeComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    PasswordResetComponent

  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgToastModule
  ],
  providers: [provideRouter(routes)],

bootstrap: [AppComponent]
})
export class AppModule {
}

