import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {
  @Input() chatMode!: string;
  message!: string;
  messageList: string[]=[];

  constructor( 
    private messageService: MessageService
  ){}

  ngOnInit(){
    this.messageService.getMessage().subscribe((message: string)=>{
      this.messageList.push(message);
    })
  }

 
  sendMessage(): void{
    console.log(this.message);
    this.messageService.sendMessage(this.message)
    this.message='';
  }

  checkKey(event: any){
    if(event.keyCode===13){
      this.sendMessage();
    }
  }
  
}
