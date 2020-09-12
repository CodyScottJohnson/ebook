import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthorRoutingModule } from './author-routing.module';
import { AuthorComponent,AuthorDataResolver } from './author.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [AuthorComponent],
  imports: [
    CommonModule,
    SharedModule,
    AuthorRoutingModule,
    HttpClientModule
  ],
  providers:[AuthorDataResolver]
})
export class AuthorModule { }
