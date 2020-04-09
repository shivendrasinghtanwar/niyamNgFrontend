import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AllShareValuesService {
  env = environment;

  constructor(private _http: HttpClient) { }
  getAll() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      }),
    };
    return this._http.get(this.env.backendUrl + '/gsheet/getAllShareValues', httpOptions);
  }
}
