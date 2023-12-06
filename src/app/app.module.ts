import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HomeComponent } from './home/home.component';
import { SwiperModule } from 'swiper/angular';
import { CallManagerComponent } from './call-manager/call-manager.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './services/auth.service';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';
import { ChatComponent } from './chat/chat.component';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { NgxAgoraModule, AgoraConfig } from 'ngx-agora';

const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };

const agoraConfig: AgoraConfig = {
  AppID: '62f0d4944c8c4a42b904ca4d28be39b5',
};


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    HomeComponent,
    CallManagerComponent,
  ],
  
  providers: [
    AuthService
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    NgxAgoraModule.forRoot(agoraConfig),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
