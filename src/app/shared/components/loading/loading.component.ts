import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Input() color:string = "#ffffff";
  @Input() logo_color:string = "#B4D0E7";
  @Input() max_height:string = "100%";
  @Input() visibility:boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
