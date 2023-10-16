import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  spinner!: boolean;
  user!: User;
  isAuth: any;
  constructor(
    private authService: AuthService,
    private router: Router){
  }
  ngOnInit(){
    this.authService.isAuth.subscribe(value=>
      {
        this.isAuth=value;
        this.user=this.authService.user;
      });
  }

  async signIn(){
    this.spinner=true;
    await this.authService.signInWithGoogle();
    this.spinner=false;
  }

  startMeeting(){
    this.router.navigateByUrl('meeting');
  }
}
