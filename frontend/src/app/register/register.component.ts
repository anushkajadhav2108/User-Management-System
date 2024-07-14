import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../Service/auth.service";
import { NgToastService } from "ng-angular-popup";
import { Component, OnInit } from "@angular/core";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'] // Correct this line
})
export class RegisterComponent implements OnInit {
  alert: boolean = false;

  registerForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  register() {
    console.log("register value");
    
    console.log(this.registerForm.value);
    this.authService.registerService(this.registerForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.status === 201) {
          this.toast.success({ detail: "Success Message", summary: res.msg, duration: 5000 });
         // this.router.navigate(['login']);
        } else if (res.status === 400) {
          this.toast.error({ detail: "Error Message", summary: res.msg, duration: 15000 });
        }
      },
      error: (error: any) => {
        console.log(error);
        this.toast.warning({ detail: "Warning Message", summary: error.error.msg, duration: 5000 });
        console.error(error);
      }
    });
  }

  closeAlert() {
    this.alert = false;
  }
}
