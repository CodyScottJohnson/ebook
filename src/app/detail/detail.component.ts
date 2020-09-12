import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  constructor(private ngZone:NgZone,private router:Router) { }

  ngOnInit(): void { }
  public navigate(commands: any[]): void {
    this.ngZone.run(() => this.router.navigate(commands)).then();
}


}
