import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';

import * as epub from 'epubjs'

import { ElectronService } from 'app/core/services';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss']
})
export class ReaderComponent implements OnInit {
  book:any;
  title:string;
  loading:boolean=true;
  progress:BehaviorSubject<number>= new BehaviorSubject<number>(0);
  page:BehaviorSubject<number> = new BehaviorSubject<number>(1);
  constructor(private route:ActivatedRoute,private zone:NgZone,private changeDetector:ChangeDetectorRef,public router:Router,public electron:ElectronService,public location:Location) {
    console.log("Here")
    this.zone.run(()=>{
      this.book =  this.route.snapshot.data.book; 
      this.electron.getEpub(this.book.path +'/'+this.book.epub_name).then(result=>{
        const blob: any = new Blob([result], { type: 'application/epub+zip' });
      // load the epub from arrayBuffer
        var book = new  epub.Book(blob);
        //var book = new epub.Book(result)

        var render = book.renderTo('book', {width: '100%', height: '100%',manager: 'continuous',
        flow: 'paginated',})
      
        
        book.ready.then(value=>{

        
          return book.locations.generate(1600);
         
          //render.display("epubcfi(/6/22[chapter004]!/4/2/2[chapter004]/334/1:118)")
         
        }).then(()=>{
          console.log('book-ready')
          var currentPosition=undefined;
          if(this.book.position != null && this.book.position != undefined && this.book.position?.cfi != '' && this.book.position?.cfi != undefined && this.book.position?.cfi != null){
            console.log(this.book.position)
           // currentPosition = book.locations.cfiFromPercentage(50)
            currentPosition = this.book.position.cfi;
            //render.display(this.book.position.cfi)
          }
          render.display(currentPosition).then(value=>{
            zone.run(()=>{
            this.loading =false;
            });
            if(this.book.position.percent_completed){
              currentPosition = book.locations.cfiFromPercentage(this.book.position.percent_completed)
              render.display(currentPosition);
            }

            
            var currentLocation = render.currentLocation();
              // Get the Percentage (or location) from that CFI
              var currentPage = book.locations.percentageFromCfi((<any>currentLocation).start.cfi);
              console.log(currentPage)
              this.title = book.packaging.metadata.title;
             
              render.on("relocated", (cfi)=>{
               // console.log(book.locations.percentageFromCfi("epubcfi(/6/22[chapter004]!/4/2/2[chapter004]/334/1:118)"))
               // console.log("Current CFI", cfi);
               var progress = (book.locations.percentageFromCfi(cfi.start.cfi))
                console.log(cfi.start.cfi)
                console.log(progress)
              this.progress.next(progress);
              if(progress != undefined && progress != null && progress != 0){
                electron.updatePosition(this.book.id,cfi.start.cfi,progress)
              }
               // console.log((<any>render.currentLocation()).start.displayed.page)
                zone.run(()=>{
                  this.page.next((<any>render.currentLocation()).start.displayed.page);
    
                })
                
               
              let spineItem = book.spine.get(cfi);
              let navItem = book.navigation.get(spineItem.href);
             // console.log(book.navigation.toc)
             // console.log(navItem)
             // console.log(spineItem)
        
            });
              
              var keyListener = function(e){
    
                // Left Key
                var temp = <any> book;
                if ((e.keyCode || e.which) == 37) {
                
                  temp.package.metadata.direction === "rtl" ? render.next() : render.prev();
                 
                 
                }
        
                // Right Key
                if ((e.keyCode || e.which) == 39) {
                  temp.package.metadata.direction === "rtl" ? render.prev() : render.next();
                  zone.run(()=>{
                   
                    //console.log(this.page)
                  })
                }
        
              };
        
              render.on("keyup", keyListener);
              document.addEventListener("keyup", keyListener, false);
          });
        })
      })
   

    })
    
   // this.changeDetector.detectChanges();
   }

  ngOnInit(): void {
  }
  closeBook(){
    this.location.back();
  }
  public navigate(commands: any[]): void {
    this.zone.run(() => this.router.navigate(commands)).then();
}

}
