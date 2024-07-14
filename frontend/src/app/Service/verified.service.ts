import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private apiUrl = 'http://localhost:3000/user'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  verifyUser(id: string): Observable<any> {
    console.log(id,"from service");
    return this.http.put(`${this.apiUrl}/verify/${id}`,{});
  }
}

//aj21092003@gmail.com
