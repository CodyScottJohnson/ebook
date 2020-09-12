import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./shared/components";

import { HomeRoutingModule } from "./home/home-routing.module";
import { DetailRoutingModule } from "./detail/detail-routing.module";
import { AuthorRoutingModule } from './author/author-routing.module'
import { BookComponent,BookDataResolver } from "./book/book.component";
const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "book2/:id",
    component:BookComponent,
    resolve:{
      book:BookDataResolver
    }
  },
  {
    path: "**",
    redirectTo: "home",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    
    HomeRoutingModule,
    DetailRoutingModule,
    AuthorRoutingModule,
  ],
  exports: [RouterModule],
  providers:[]
})
export class AppRoutingModule {}
