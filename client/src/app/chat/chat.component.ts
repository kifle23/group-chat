import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  messages: any[] = [];
  inputMessage: string = '';
  loggedInUser: string = sessionStorage.getItem('user') || '';
  roomName: string = sessionStorage.getItem('room') || '';
  @ViewChild('divScroll') private scrollContainer!: ElementRef;

  constructor(public chatService: ChatService, private route: Router) {}

  ngOnInit(): void {
    this.chatService.messages$.subscribe((messages) => {
      this.messages = messages;
    });
  }

  ngAfterViewChecked(): void {
    this.scrollContainer.nativeElement.scrollTop =
      this.scrollContainer.nativeElement.scrollHeight;
  }

  sendMessage() {
    this.chatService
      .sendMessage(this.inputMessage)
      .then(() => {
        this.inputMessage = '';
      })
      .catch((error) => {
        console.log(error);
      });
  }

  leaveRoom() {
    this.chatService
      .leaveRoom()
      .then(() => {
        this.route.navigate(['/']);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
