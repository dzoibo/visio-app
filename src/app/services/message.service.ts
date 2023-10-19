import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable,Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private socket: Socket
  ) {
    this.socket.connect();
   }

  sendMessage(msg: string){
    this.socket.emit('message',msg);
    console.log('this is the message');
  }

  getMessage(): Observable<string>{
    return new Observable((observer: Observer<any>)=>{
      this.socket.on('message',(message: string)=>{
        observer.next(message)
      })
    })
  }
}
