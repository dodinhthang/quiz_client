import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './login/login.module';
import { MainModule } from './main/main.module';
import { CoreModule } from './core/core.module';
import { ApiModule } from './api';
import { SocketModule } from './socket';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { ViewerComponent } from './viewer/viewer.component';

@NgModule({
  declarations: [AppComponent, ScoreboardComponent, ViewerComponent],
  imports: [
    HttpModule,
    BrowserModule,
    CoreModule,
    BrowserAnimationsModule,
    ApiModule,
    SocketModule,
    AppRoutingModule,
    LoginModule,
    MainModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
