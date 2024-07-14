import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VerificationService } from '../Service/verified.service';

@Component({
  selector: 'app-verified',
  templateUrl: './verified.component.html',
  styleUrl: './verified.component.scss'
})
export class VerifiedComponent implements OnInit{

  verificationStatus: string='';

  constructor(
    private route: ActivatedRoute,
    private verificationService: VerificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      console.log(userId, "found user id");
      if (userId) {
        this.verifyUser(userId);
        console.log(userId, "found user id");
      }
    });
  }

  verifyUser(id: string): void {
    this.verificationService.verifyUser(id).subscribe(
      response => {
        this.verificationStatus = 'Your email has been verified';
      },
      error => {
        console.error('Error verifying user', error);
        this.verificationStatus = 'There was an error verifying your email';
      }
    );
  }

}
