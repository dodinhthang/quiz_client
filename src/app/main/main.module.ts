import { NgModule } from '@angular/core';

import { CoreModule } from '../core/core.module';

import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import {
  PlayingComponent,
  DialogOverviewExampleDialog
} from './playing/playing.component';
import { AdminComponent } from './admin/admin.component';
import { GameComponent } from './playing/game/game.component';
import { ViewComponent } from './view/view.component';

@NgModule({
  imports: [MainRoutingModule, CoreModule],
  exports: [],
  declarations: [
    MainComponent,
    PlayingComponent,
    DialogOverviewExampleDialog,
    AdminComponent,
    GameComponent,
    ViewComponent
  ],
  providers: [],
  entryComponents: [DialogOverviewExampleDialog]
})
export class MainModule {}
