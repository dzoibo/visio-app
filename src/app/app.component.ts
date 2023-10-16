import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'visio-app';

  constructor(
    private authService: AuthService
  ){}
  ngOnInit() {
    initializeApp(environment.firebaseConfig);
    this.authService.checkConnexion();
  }

}
