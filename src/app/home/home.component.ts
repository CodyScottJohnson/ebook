import { Component, OnInit, ChangeDetectorRef, NgZone,AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { ElectronService } from "app/core/services";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Subscription, BehaviorSubject, Observable } from "rxjs";
import * as moment from 'moment'
//var db = new sqlite3.Database(':memory:');

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit,AfterViewInit {
  library: any = { books: [] };
  Image:BehaviorSubject<String>;
  constructor(
    private router: Router,
    public electron: ElectronService,
    private changeDetector: ChangeDetectorRef,
    private domSanitize: DomSanitizer,
    private zone:NgZone
  ) {
    electron.loading.next(true)
    electron.library.subscribe({
      next: (library) => {
        zone.run(()=>{this.library = library;})
  
      },
    });
    electron.currentlyReading.subscribe({
      next: (result)=>{
        console.log(result)
      }
    });
  }

  ngOnInit(): void {}
  ngAfterViewInit():void {
    console.log('loaded')
    this.electron.loading.next(false)
  }
  change(path) {
    this.electron.getImage(path + "/cover.jpg").then(
      (result) => {
        this.zone.run(()=>{
          console.log('clicked')
          this.Image.next('https://static.dribbble.com/users/427857/screenshots/13965423/media/daf79b7d2e918b6872f9747b38070dd5.png')
          this.Image.complete();
          this.changeDetector.detectChanges();
        })
        //return 'https://static.dribbble.com/users/818244/screenshots/6462515/bookly-drbb.png';
        //return result;
        
        
      },
      (err) => {
         this.Image.next("https://google.com");
      }
    );
  }
  formatDateRelative(date:string){
    console.log("format")
    return moment(date).fromNow();
  }
  trackByFn(index, item) {
    return index; // or item.id
  }
  getCover(path,object) {

    return new Observable<string>((Observer)=>{
      Observer.next('https://static.dribbble.com/users/818244/screenshots/6462515/bookly-drbb.png')
      Observer.complete();
      console.log("here");
      

    }
    )
    /*
    var Image = new BehaviorSubject<String>('')
    this.Image = Image
    this.zone.run(()=>{
      Image.next('https://static.dribbble.com/users/818244/screenshots/6462515/bookly-drbb.png')
    })
    this.electron.getImage(path + "/cover.jpg").then(
      (result) => {
        this.zone.run(()=>{
          //Image.next('https://static.dribbble.com/users/818244/screenshots/6462515/bookly-drbb.png')
        })
        //return 'https://static.dribbble.com/users/818244/screenshots/6462515/bookly-drbb.png';
        //return result;
        
        
      },
      (err) => {
         Image.next("https://google.com");
      }
    );*/
   

     
     // return Image;


  }
}
