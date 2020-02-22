import {
  Component,
  Inject,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy
} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

import {
  UsersService,
  AuthService,
  RoundsService,
  PlaygroundsService,
  PlayersService
} from '../../api';
import { SocketService } from '../../socket';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-playing',
  templateUrl: './playing.component.html',
  styleUrls: ['./playing.component.scss']
})
export class PlayingComponent implements OnInit, OnDestroy {
  Subscription: Subscription;
  answered = false;
  socket: SocketService;
  questionId;
  arrDapAn = [];
  cauHoi = '';
  noiDung = '';
  token = '';
  userName = '';
  studentId = '';
  timeChoi = -10;
  quetSprint;
  dialogRef;
  score = 0;
  time = 0;
  count = 1;
  isPlaying;
  isSendAnswer = false;
  constructor(
    private user: UsersService,
    private auth: AuthService,
    private playground: PlaygroundsService,
    private round: RoundsService,
    private router: Router,
    public dialog: MatDialog,
    private players: PlayersService
  ) {}

  ngOnInit() {
    this.isPlaying = undefined;
    // this.token = localStorage.getItem('token');
    this.token = localStorage.getItem('token');
    this.userName = localStorage.getItem('userName');
    this.studentId = localStorage.getItem('studentId');
    if (this.token) {
      this.user
        .checkLogin(this.token)
        .then(res => {
          console.log(res);
          if (res.code != 1) {
            localStorage.removeItem('token');
            this.router.navigate(['login']);
          } else {
            this.run();
            // this.openDialog(
            //   'Xin chào ' + this.userName,
            //   'Bạn có đồng ý bắt đầu chơi',
            //   result => {
            //     if (result) {
            //       this.run();
            //     }
            //   }
            // );
          }
        })
        .catch(err => {
          localStorage.removeItem('token');
          this.router.navigate(['login']);
        });
    } else {
      this.router.navigate(['login']);
    }
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  closeAll() {
    this.dialogRef.close();
  }

  run(): void {
    const self = this;
    this.socket = new SocketService();
    this.socket.onLogin().subscribe(message => {
      this.socket.login({
        command: 1000,
        token: this.token
      });
    });
    this.players.check(this.token, this.studentId).then(res => {
      if (res.code === 0) {
        this.noiDung =
          'Bạn đã bị loại, đăng nhập với tư cách khán giả để giúp người chơi khác.';
      } else {
        this.Subscription = this.socket.waitQuestion().subscribe(message => {
          console.log(message);
          this.isPlaying = true;
          self.isSendAnswer= false;
          this.players.checkSAT(this.token, this.studentId).then(res => {
            if (res.code === 0) {
              this.noiDung =
                'Bạn đã bị loại, đăng nhập với tư cách khán giả để giúp người chơi khác.';
              this.timeChoi = -10;
              this.cauHoi = '';
              this.arrDapAn = [];
              this.Subscription.unsubscribe();
            } else {
              this.timeChoi = 20;
              this.noiDung = '';
              this.cauHoi = message.message.content;
              this.arrDapAn = message.message.options;
              this.questionId = message.message._id;
              clearInterval(this.quetSprint);
              const self = this;
              this.quetSprint = setInterval(function() {
                if (self.timeChoi <= 1) {
                  clearInterval(self.quetSprint);
                  self.isPlaying =true;
                }
                self.timeChoi = self.timeChoi - 1;
                console.log(this.isSendAnswer)
                if (self.timeChoi < 1&&self.isSendAnswer==false) {
                  let answer = {
                    userName: self.userName,
                    studentId: self.studentId,
                    time: 20 - self.timeChoi,
                    answer: '',
                    questionId: self.questionId
                  };
                  self.players
                    .answer(self.token, answer)
                    .then(res => {})
                    .catch(reason => console.log(reason));
                  console.log('hetgio!');
                  self.cauHoi = '';
                  self.arrDapAn = [];
                  self.noiDung =
                    'Rất tiếc bạn đã bị loại do không trả lời câu hỏi vừa rồi';
                  self.Subscription.unsubscribe();
                }
               
              }, 1000);
            }
          });
        });
      }
    });
  }


  onAnswer(event) {
    this.openDialog(
      'Trả lời câu hỏi',
      'Bạn có chắc chắn với câu trả lời của mình.',
      result => {
        if (result) {
          let answer = {
            userName: this.userName,
            studentId: this.studentId,
            time: 20 - this.timeChoi,
            answer: event.target.innerText,
            questionId: this.questionId
          };
          this.players
            .answer(this.token, answer)
            .then(res => {})
            .catch(reason => console.log(reason));
          this.isPlaying = false;
          this.isSendAnswer = true;
          this.count++;
          this.arrDapAn = [];
          this.noiDung = "Chờ câu hỏi tiếp theo.";
          //clearInterval(this.quetSprint);
        }
      }
    );
  }

  openDialog(title: string, content: string, callback: Function) {
    this.dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: { name: title, content: content }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      return callback(result);
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
  <h1 mat-dialog-title>Hi {{data.name}}</h1>
  <div mat-dialog-content>
    <p>{{data.content}}</p>
  </div>
  <div mat-dialog-actions>
    <button mat-button [mat-dialog-close]="true" tabindex="2">YES</button>
    <button mat-button [mat-dialog-close]="false" tabindex="-1">NO</button>
  </div>`
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
