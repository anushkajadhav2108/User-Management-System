import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  loggedIn = false;

  constructor(
    private http: HttpClient,
    private router: Router
    ) {}

  ngOnInit(): void {
    
    console.log("method");
    
    if(localStorage.getItem('token'))
    {
      console.log("token recevied");
      
     this.loggedIn = true;

   }
  }


  logOut() {
    this.loggedIn = false;
    localStorage.clear();
    this.router.navigate(['/']);
  }

}
