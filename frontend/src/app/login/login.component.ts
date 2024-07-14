import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { LoginService } from '../Service/login.service';
LoginService
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
alert:boolean =false
  // api = 'http://localhost:3000/customer/login'

 loginForm !: FormGroup


  constructor(
    private http: HttpClient,
    private router: Router,
    private fb:FormBuilder,
    private LoginService:LoginService,
    private toast: NgToastService
    ) {}

    ngOnInit(): void {
      console.log("hi into login compo");
    
      this.loginForm = this.fb.group({
        email: ['', Validators.required],
        password:['',Validators.required]
      })
    }

    login(){
      console.log(this.loginForm.value);
      this.LoginService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          console.log(res);
          // alert(res.msg);
          if(res.status===200){
            this.toast.success({detail:"Success Message",summary:res.msg,duration:5000})
          localStorage.setItem('user1', JSON.stringify(res));
          // localStorage.setItem('token', res.token)
          this.router.navigate(['home']);
         }
         else if(res.status === 400){
          
           this.toast.warning({detail:"Warning Message",summary:res.msg,duration:15000})
         }
        },
        error: (error: any) => {
          console.log(error);
          this.toast.warning({detail:"Error Message",summary:error.error.msg,duration:5000})
          }
      })
      // this.alert=true
      // this.loginForm.reset({})
    }
    closeAlert(){
      this.alert=false
    }



//       console.log(this.loginForm);
//       console.log("Value :"+this.loginForm.value);

//       this.http.post(this.api + 'login',this.loginForm.value).subscribe({
//         next: (res: any) => {
//           this.router.navigate(['header']);
//         },
//         error: (error: any) => {
//           console.log(error);
//         }
//       })
 

    loginAdmin(){
      this.http.post("http://localhost:3000/customer/admin",this.loginForm.value).subscribe({
        next: (res: any) => {
          
            this.toast.success({detail:"Success message",summary:res.msg,duration:5000})
            this.router.navigate(['header']);

        },
        error: (error: any) => {
          console.log(error);
          this.toast.error({detail:"Error message", summary:error.error.msg})
        }
      })
    }

}
