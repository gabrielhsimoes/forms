import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadoBr } from '../models/estado-br';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private http: HttpClient) { }

  getEstadosBr():Observable<any>{

    return this.http.get<EstadoBr>('assets/dados/estadorbr.json').pipe();
  }

  getCargos(){
    return [
      { nome: 'Dev', nivel: 'Junior', desc: 'Dev Jr' },
      { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' },
      { nome: 'Dev', nivel: 'Senior', desc: 'Dev Sr' }
    ];
  }

  getTecnologias(){
    return [
      { nome: 'java', desc: 'Java' },
      { nome: 'javascript', desc: 'Javascript' },
      { nome: 'php', desc: 'PHP' },
      { nome: 'ruby', desc: 'Ruby' }
    ];
  }

  getNewsletter(){
    return [
      { valor: 's', desc: 'Sim' },
      { valor: 'n', desc: 'Não' }
    ];
  }
}
