import { Injectable, Type } from "@angular/core";
import {
  Observable,
  Observer,
  Subject,
  BehaviorSubject,
  AsyncSubject,
  timer,
} from "rxjs";
import { debounce } from "rxjs/operators";
// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from "electron";
import * as childProcess from "child_process";
import * as fs from "fs";
import {orderBy} from 'lodash'
import * as sqlite3 from "sqlite3";
import { NodeWithI18n } from "@angular/compiler";
import { faMonument } from "@fortawesome/pro-regular-svg-icons";
import * as moment from 'moment';
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  sqlite: typeof sqlite3;
  db: typeof sqlite3.Database;
  librarydb: typeof sqlite3.Database;
  newprogress: Subject<any> = new Subject<any>();
  test: Observer<any[]>;
  updateBooks: any;
  currentlyReading: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  libraryFolder: string = "/Users/codysj/Dropbox (Personal)/Backups/Books/";
  library: BehaviorSubject<any> = new BehaviorSubject<any>({});
  loading:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor(private http:HttpClient) {
    // Conditional imports
    this.newprogress.pipe(debounce(() => timer(1000))).subscribe({
      next: (value) => {
        var position = value.position;
        var id = value.id;
        var progress = value.progress
        var root = this;
        if( value.type=='pdf') {
        var stmt = this.librarydb.prepare(
          `update position set cfi=$cfi,percent_completed=$completed,last_read=$update where book=$book;`
        );

        stmt.run({ $cfi: position, $book: id, $completed: progress,$update:new Date().toISOString()}, function (
          err
        ) {
          console.log(err)
          if (this.changes == 0) {
            stmt = root.librarydb.prepare(
              `insert into position(book,user,cfi,percent_completed) values($book,'codysj',$cfi,$completed);`
            );
            stmt.run({ $cfi: position, $book: id, $completed: 0.9 }, (err) => {
              console.log(err);
            });
          }
        });
      }
      else {
        var stmt = this.librarydb.prepare(
          `update position set pdf_position=$position,percent_completed=$completed,last_read=$update where book=$book;`
        );

        stmt.run({ $position: position, $book: id, $completed: progress,$update:new Date().toISOString()}, function (
          err
        ) {
          console.log(err)
          if (this.changes == 0) {
            stmt = root.librarydb.prepare(
              `insert into position(book,user,pdf_position,percent_completed) values($book,'codysj',$position,$completed);`
            );
            stmt.run({ $position: position, $book: id, $completed: 0.9 }, (err) => {
              console.log(err);
            });
          }
        });
      }
      },
    });
    if (this.isElectron) {
      this.ipcRenderer = window.require("electron").ipcRenderer;
      this.webFrame = window.require("electron").webFrame;
      this.remote = window.require("electron").remote;
      this.childProcess = window.require("child_process");
      this.fs = window.require("fs");
      this.sqlite = window.require("sqlite3");
      this.db = new this.sqlite.Database(
        "/Users/codysj/Dropbox (Personal)/Backups/Books/metadata.db"
      );
      this.librarydb = new this.sqlite.Database(
        "/Users/codysj/Dropbox (Personal)/Backups/Books/librarydata.db"
      );
      this.db.all(
        `select b.*, a.name, a.id as author_id
      from books b
       left join (select book, max(author) as author from books_authors_link group by book) ba on ba.book = b.id
       left join authors a on a.id = ba.author
       order by b.timestamp desc`,
        (err, rows: Book[]) => {
          this.library.next({ books: rows });
        }
      );
      this.updateCurrentReadingList();
    }

  }

  getBook(id): Observable<any> {
    return new Observable<any>((observer) => {
      console.log(id);
      this.db.get(
        `select distinct b.*, a.name, a.id as author_id,d.name||'.epub' as epub_name
      from books b
       left join books_authors_link ba on ba.book = b.id
       left join authors a on a.id = ba.author
       left join data d on d.book =b.id and d.format='EPUB'
       
       where b.id = $1`,
        [id],
        (err, row: any) => {
          console.log(row);
          this.getImage(row.path + "/cover.jpg").then(
            (image) => {
              row.image = image;
              this.db.all(
                `select * from comments where book = ?`,
                [id],
                (err, rows) => {
                  row.comments = rows;
                  this.db.all(
                    "select * from data where book = ?",
                    [id],
                    (err, rows) => {
                      row.formats = rows;
                      this.librarydb.get(
                        "select * from position where book = ?",
                        [id],
                        (err, rows) => {
                          row.position = rows;
                          observer.next(row);
                          observer.complete();
                        }
                      );
                    }
                  );
                }
              );
            },
            (err) => {
              console.log(err);
            }
          );
        }
      );
    });
  }
  async updateCurrentReadingList() {
    var list:any[]=[]
    this.librarydb.all(`select * from position`,(err,result)=>{
      result.forEach(row => {
        this.db.get(`select b.*,a.name as author 
                     from books b  
                     left join (select book, max(author) as author from books_authors_link group by book) ba on ba.book = b.id
                     left join authors a on a.id = ba.author 
                     where b.id = ?`,[row.book],(err,book)=>{
           book.progress = row;
           list.push(book);
           orderBy(list,[(object)=>{return moment(object.last_read)}],['asc'])
           this.currentlyReading.next(list);
        })
        
      });
    })
  }
  testPromise(value) {
    console.log(value);
    return new Promise((resolve, reject) => {
      console.log(value);
      setTimeout(() => {
        resolve(value);
      }, 2000);
    });
  }
  updatePosition(id, position,progress) {

    this.newprogress.next({ id: id, position: position,progress:progress,type:'epub' });
    console.log(id);
  }
  updatePositionpdf(id, position,progress) {

    this.newprogress.next({ id: id, position: position,progress:progress,type:'pdf' });
    console.log(id);
  }
  getAuthor(id): Observable<any> {
    return new Observable<any>((observer) => {
      console.log(id);
      this.db.all(
        `select b.*, a.name, a.id as author_id
      from books b
       left join books_authors_link ba on ba.book = b.id
       left join authors a on a.id = ba.author
       where a.id = $1`,
        [id],
        (err, rows: any) => {
          console.log(rows);
          observer.next(rows);
          observer.complete();
        }
      );
    });
  }
  getEpub(path): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      if (path) {
        fs.readFile(this.libraryFolder + path, function (err, data) {
          if (err) {
            reject(err);
          } else if (data != null && data != undefined) {
            resolve(data);
          } else {
          }
        });
      }
    });
  }
  
  getImage(path): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (path) {
        fs.readFile(this.libraryFolder + path, function (err, data) {
          if (err) {
            reject(err);
          } else if (data != null && data != undefined) {
            console.log("gettingImage");
            resolve("data:image/jpeg;base64," + data.toString("base64"));
          } else {
            reject("Couldnt Read File");
          }
        });
      }
    });
  }
  getLibrary() {
    console.log("click");
    this.ipcRenderer.invoke("choose-library");
  }
  getAuthorBooks(author):Observable<any>{
  
    return new Observable<any>((observable)=>{
      console.log('test')
      this.http.get<any>('http://openlibrary.org/search.json?author=n.k.+jemisin').subscribe(result=>{
        console.log('result')
        console.log(result)
        observable.next(result.docs);
      }, err=>{
        console.log(err)
      })
    })
   
  }
}
interface Book {
  title: string;
}
