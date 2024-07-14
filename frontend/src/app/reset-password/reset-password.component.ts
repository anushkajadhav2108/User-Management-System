// src/app/reset-password/reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  resettoken: string="";
  message: string="";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
     this.route.params.subscribe( result => {
      this.resettoken = result['token']
    })
    // this.resettoken = this.route.snapshot.queryParams['token'];
    console.log(this.resettoken);
    
    this.authService.validateResetToken(this.resettoken).subscribe(
      () => {},
      error => {
        this.message = 'Invalid or expired token.';
        this.router.navigate(['/forgot-password']);
      }
    );
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.authService.resetPassword(this.resettoken, this.resetPasswordForm.value.newPassword)
        .subscribe(
          response => {
            this.message = 'Password has been reset successfully.';
          },
          error => {
            this.message = 'An error occurred. Please try again.';
          }
        );
    }
  }
}
