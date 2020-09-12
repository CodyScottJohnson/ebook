import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { AuthorDataResolver } from './author-data.resolver';
import { ElectronService } from 'app/core/services';
@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
})
export class AuthorComponent implements OnInit {
  author:any;
  otherBooks:any[];
  constructor(private route:ActivatedRoute,private zone:NgZone,private changeDetector:ChangeDetectorRef,public router:Router,public electron: ElectronService) {
    this.zone.run(()=>{
      this.author =  this.route.snapshot.data.author; 
      this.electron.getAuthorBooks('').subscribe((result)=>{
        this.otherBooks = result;
      })

    })
   }

  ngOnInit(): void {
    
  }
  public navigate(commands: any[]): void {
    this.zone.run(() => this.router.navigate(commands)).then();
}

}

export{
  AuthorDataResolver
}
