import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrls } from '../apiUrl';
import { ForgotPasswordRequest, ResetPasswordRequest } from '../Models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

//http = inject(HttpClient);
private apiUrl = 'http://localhost:3000/user'; // Replace with your backend API URL


  constructor(private http: HttpClient) { }

  registerService(registerObj: any){
    // return this.http.post("http://localhost:3000/customer/register",registerObj);
    return this.http.post(`${apiUrls.authUrl}register`, registerObj)
  }

  requestPasswordReset(email: string){
    const payload: ForgotPasswordRequest = { email };
    return this.http.post(`${this.apiUrl}/req-reset-password`, payload);
  }

  validateResetToken(resettoken: string) {
    return this.http.post(`${this.apiUrl}/valid-password-token`, { resettoken });
  }

  resetPassword(resettoken: string, newPassword: string) {
    const payload: ResetPasswordRequest = { resettoken, newPassword };
    return this.http.post(`${this.apiUrl}/new-password`, payload);
  }

  // isLoggedIn(){
  //   localStorage.setItem('user','true');
  // }  
}
