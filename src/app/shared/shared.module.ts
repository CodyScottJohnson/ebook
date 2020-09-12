import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoverComponent } from './components/cover/cover.component';
import { LoadingComponent } from './components/loading/loading.component';




@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, CoverComponent, LoadingComponent],
  imports: [CommonModule, TranslateModule, FormsModule,RouterModule],
  exports: [TranslateModule, WebviewDirective, FormsModule,CoverComponent,LoadingComponent],
  providers: []
})
export class SharedModule {}
