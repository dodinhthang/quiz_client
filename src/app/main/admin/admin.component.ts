import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../socket';
import {
  PlaygroundsService,
  QuestionlistsService,
  QuestionsService
} from '../../api';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  token;
  viewerAnswer = [0, 0, 0, 0];
  indexQuestion = 1;
  listQuestion = [];
  constructor(
    private playground: PlaygroundsService,
    private socket: SocketService,
    private questionList: QuestionlistsService
  ) {}

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.questionList.getList(this.token).then(res => {
      this.listQuestion = res.questionslist.questions;
      console.log(this.listQuestion[0].questId._id);
    });
    this.socket.waitViewerSubmit().subscribe(message => {
      switch (message.message) {
        case 1: {
          this.viewerAnswer[0]++;
          break;
        }
        case 2: {
          this.viewerAnswer[1]++;
          break;
        }
        case 3: {
          this.viewerAnswer[2]++;
          break;
        }
        case 4: {
          this.viewerAnswer[3]++;
          break;
        }
      }
    });
  }
  nextQuestion() {
    this.viewerAnswer = [0, 0, 0, 0];

    console.log(
      'id question  la' + this.listQuestion[this.indexQuestion].questId._id
    );

    this.socket.nextQuestion(this.listQuestion[this.indexQuestion].questId._id);
    this.indexQuestion++;
  }
  getViewerAnswer() {
    console.log(this.viewerAnswer);
  }
  start() {
    this.socket.start(this.listQuestion[0].questId._id);
  }
}
