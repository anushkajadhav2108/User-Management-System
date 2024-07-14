import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  // user: any=[];
  
  // newuser={
  //   firstName:'',
  //   lastName:'',
  //   email:'',
  //   password:''
  // }

 ngOnInit(): void {
   
 } 
 constructor(private http: HttpClient,private router: Router){

 }


  logout() {
    console.log("called")
    this.router.navigate(['login'])
    localStorage.clear();
  }

}
