import 'reflect-metadata';
import '../polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HomeModule } from './home/home.module';
import { DetailModule } from './detail/detail.module';

import { AppComponent } from './app.component';
import { BookComponent } from './book/book.component';
import { RouterModule } from '@angular/router';
import { AuthorModule } from './author/author.module';
import { ReaderComponent } from './book/reader/reader.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PdfComponent } from './book/pdf/pdf.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}



@NgModule({
  declarations: [AppComponent, BookComponent, ReaderComponent, PdfComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    HomeModule,
    DetailModule,
    AuthorModule,
    AppRoutingModule,
    RouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FontAwesomeModule,
    NgxExtendedPdfViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
