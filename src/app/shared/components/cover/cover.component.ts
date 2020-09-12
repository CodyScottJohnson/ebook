import { Component, OnInit, Input, NgZone } from '@angular/core';
import { ElectronService } from 'app/core/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss']
})
export class CoverComponent implements OnInit {
  @Input() path:string;
  @Input() height:number;
  @Input() width:number;
  img:Observable<String>;
  result:any;
  constructor(public electron:ElectronService) { 
   
   
  }
  ngOnInit(): void {
    if((this.height == null || this.height == undefined) && (this.width != null || this.width != undefined)){
      console.log("Set Height")
      this.height = this.width * 1.52;
      console.log(this.width)
    }
    this.img = new Observable<string>(observer=>{
      //observer.next('https://static.dribbble.com/users/427857/screenshots/13965423/media/daf79b7d2e918b6872f9747b38070dd5.png')
      this.electron.getImage(this.path + "/cover.jpg").then(
        (result) => {

          observer.next(result)
    
          
          //return 'https://static.dribbble.com/users/818244/screenshots/6462515/bookly-drbb.png';
          //return result;
          
          
        },
        (err) => {
          observer.next('/assets/background.jpg');

           //Image.next("https://google.com");
        }
      );
    })
  }
  

}
