import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket/socket.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {
  constructor(private socket: SocketService) {}

  ngOnInit() {}
  submit(answer) {
    this.socket.viewerSubmit(answer);
  }
}
