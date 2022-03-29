import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private http: HttpClient) { }

  getEstadosBr(){

    // return this.http.get<EstadoBr>('assets/dados/estadosBr.json').pipe();

  }
}
