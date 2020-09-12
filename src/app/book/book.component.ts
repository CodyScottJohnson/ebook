import { Component, OnInit, NgZone, ChangeDetectorRef } from "@angular/core";
import { BookDataResolver } from "./book-data.resolver";
import { ActivatedRoute, Router } from "@angular/router";

import * as epub from "epubjs";
import { electron } from "process";
import { ElectronService } from "app/core/services";
@Component({
  selector: "app-book",
  templateUrl: "./book.component.html",
  styleUrls: ["./book.component.scss"],
})
export class BookComponent implements OnInit {
  book: any;
  constructor(
    private route: ActivatedRoute,
    private zone: NgZone,
    private changeDetector: ChangeDetectorRef,
    public router: Router,
    public electron: ElectronService
  ) {
    console.log("Here");
    this.zone.run(() => {
      this.book = this.route.snapshot.data.book;
    });
    // this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
    console.log("Here");
    this.zone.run(() => {
      this.book = this.route.snapshot.data.book;
    });
  }

  public navigate(commands: any[]): void {
    this.zone.run(() => this.router.navigate(commands)).then();
  }
  public openBook(format: string,path:string) {
    switch (format) {
      case "EPUB":
        this.navigate(["/book", this.book.id, "read"]);
        break;
      case "PDF":
        this.navigate(["/book", this.book.id, "pdf",path]);
        break;
    }
  }
}
export { BookDataResolver };
