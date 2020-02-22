import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PlaygroundsService} from '../api';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {

  listScore = [];
  listShow = [];

  indexScore = 10;

  constructor(private ground: PlaygroundsService, private router: Router) { }

  ngOnInit() {
    this.ground.scoreboard().then(res => {
      if (res.code == 3) {
        this.listScore = res.score;
        this.listScore.sort((b, a) => {
          if (a.totalScore == b.totalScore) {
            if (a.totalTime == b.totalTime) {
              return a.questIndex - b.questIndex;
            }
            else {
              return b.totalTime - a.totalTime;
            }
          }
          else {
            return a.totalScore - b.totalScore;
          }
        })
        this.listShow = this.listScore.slice(0, 10);
      } else {
        alert ('Có lỗi xảy ra. Vui lòng tải lại trang.');
      }
    })

    setInterval(() => {
      this.ground.scoreboard().then(res => {
        if (res.code == 3) {
          this.listScore = res.score;
          this.listScore.sort((b, a) => {
            if (a.totalScore == b.totalScore) {
              if (a.totalTime == b.totalTime) {
                return a.questIndex - b.questIndex;
              }
              else {
                return b.totalTime - a.totalTime;
              }
            }
            else {
              return a.totalScore - b.totalScore;
            }
          })
          this.listShow = this.listScore.slice(0, this.indexScore);
        }
      });
    }, 10000);
  }

  onSelected(event) {
    this.indexScore = parseInt(event.target.value);
    this.listShow = this.listScore.slice(0, this.indexScore);
  }

}
