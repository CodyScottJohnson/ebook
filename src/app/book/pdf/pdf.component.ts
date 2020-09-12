import { Component, OnInit, NgZone,Input } from '@angular/core';
import * as pdfjs from 'pdfjs-dist'

import { ElectronService } from 'app/core/services';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {
  @Input() path:string;
  bookInfo:any;
  currentPage = 1;
  totalPages:number = 0;
  pdfFile:BehaviorSubject<ArrayBuffer> = new BehaviorSubject<ArrayBuffer>(null);
  constructor(private electron:ElectronService,private zone:NgZone, private route:ActivatedRoute, private router:Router) {
    this.bookInfo =  this.route.snapshot.data.book;  
    route.params.subscribe(params=>{
      this.electron.getEpub(this.bookInfo.path+'/' +params['path']+'.pdf').then(book=>{
        this.pdfFile.next(book);
       
      })
    })
    
  }

  ngOnInit(): void {
   
  }
  public navigate(commands: any[]): void {
    this.zone.run(() => this.router.navigate(commands)).then();
}
pageChange(event){
  console.log(event)
  this.electron.updatePosition(this.bookInfo.id,event,event/this.totalPages)
}
pagesLoaded(event){
  if(this.bookInfo.position != null && this.bookInfo.position != undefined ){
    console.log(this.bookInfo.position)
    this.currentPage = Math.ceil(this.bookInfo.position.percent_completed * event.pagesCount);
    //render.display(this.book.position.cfi)
  }
  this.totalPages = event.pagesCount;
  console.log(event)
}

}
