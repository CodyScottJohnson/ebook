import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from './detail.component';
import { BookComponent,BookDataResolver } from "../book/book.component";
import { ReaderComponent } from "../book/reader/reader.component"
import { PdfComponent } from "../book/pdf/pdf.component"
const routes: Routes = [
  {
    path: 'book/:id',
    component: BookComponent,
    resolve:{
      book:BookDataResolver
    }
  },
  {
    path: 'book/:id/read',
    component: ReaderComponent,
    resolve:{
      book:BookDataResolver
    }
  },
  {
    path: 'book/:id/pdf/:path',
    component: PdfComponent,
    resolve:{
      book:BookDataResolver
    }
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[BookDataResolver]
})
export class DetailRoutingModule {}
