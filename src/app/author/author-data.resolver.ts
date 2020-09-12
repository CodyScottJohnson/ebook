import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, observable } from 'rxjs';
import { ElectronService } from 'app/core/services';

@Injectable()
export class AuthorDataResolver implements Resolve<any>{

  constructor(private electron:ElectronService) { }
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    console.log(route.params.id)
    return this.electron.getAuthor(route.params.id);  
  }  
}
