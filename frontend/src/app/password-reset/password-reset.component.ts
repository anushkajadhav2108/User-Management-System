import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  resetToken: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get the reset token from the URL
    this.resetToken = this.route.snapshot.queryParams['token'];
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
  
    this.authService.resetPassword(this.resetToken, this.newPassword).subscribe(
      response => {
        alert('Password reset successfully');
        this.router.navigate(['/login']);
      },
      error => {
        alert('Error resetting password');
        console.error(error);
      }
    );
  }
}
