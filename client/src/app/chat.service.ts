import { Injectable } from '@angular/core';
import * as SignalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public chatConnection: SignalR.HubConnection =
    new SignalR.HubConnectionBuilder()
      .withUrl('http://localhost:5001/chat')
      .configureLogging(SignalR.LogLevel.Information)
      .build();

  public messages$ = new BehaviorSubject<any>([]);
  public connectedUsers$ = new BehaviorSubject<string[]>([]);
  public messages: any[] = [];
  public users: string[] = [];

  constructor() {
    this.startConnection();
    this.chatConnection.on(
      'ReceiveMessage',
      (user: string, message: string, messageTime: string) => {
        this.messages.push({ user, message, messageTime });
        this.messages$.next(this.messages);
      }
    );

    this.chatConnection.on('ConnectedUser', (user: any) => {
      this.connectedUsers$.next(user);
    });
  }

  public async startConnection() {
    try {
      await this.chatConnection.start();
      console.log('Connection started');
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        this.startConnection();
      }, 5000);
    }
  }

  public async joinRoom(user: string, room: string) {
    try {
      if (this.chatConnection.state !== SignalR.HubConnectionState.Connected) {
        await this.startConnection();
      }

      await this.chatConnection.invoke('JoinRoom', { user, room });
    } catch (error) {
      console.log(error);
    }
  }

  public async sendMessage(message: string) {
    try {
      await this.chatConnection.invoke('SendMessage', message);
    } catch (error) {
      console.log(error);
    }
  }

  public async leaveRoom() {
    try {
      await this.chatConnection.stop();
    } catch (error) {
      console.log(error);
    }
  }
}
