import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorComponent,AuthorDataResolver } from './author.component'
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';

const routes: Routes = [
  {
    path: 'author/:id',
    component: AuthorComponent,
    resolve:{
      author:AuthorDataResolver
    }
    
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule,RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[AuthorDataResolver]
})
export class AuthorRoutingModule { }
