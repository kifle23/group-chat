import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css'],
})
export class JoinRoomComponent implements OnInit {
  joinRoomForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.joinRoomForm = this.fb.group({
      user: ['', Validators.required],
      room: ['', Validators.required],
    });
  }

  joinRoom(): void {
    const { user, room } = this.joinRoomForm.value;
    sessionStorage.setItem('user', user);
    sessionStorage.setItem('room', room);
    this.chatService
      .joinRoom(user, room)
      .then(() => {
        this.router.navigate(['/chat'], {
          queryParams: this.joinRoomForm.value,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
