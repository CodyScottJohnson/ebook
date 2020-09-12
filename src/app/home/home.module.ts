import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { FontAwesomeModule,FaIconLibrary, FaConfig } from '@fortawesome/angular-fontawesome';
import { far } from '@fortawesome/pro-regular-svg-icons';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, SharedModule, HomeRoutingModule,ScrollingModule,RoundProgressModule]
})
export class HomeModule {
  constructor(library: FaIconLibrary,faConfig: FaConfig) {
    library.addIconPacks(far);
    faConfig.fixedWidth = true;
  }
}
