import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';
import { Transacao } from '../models/transacao'


@Injectable({
  providedIn: 'root'
})
export class TransacaoService {

  constructor(private http: HttpClient) { }
private url = "https://run.mocky.io/v3/533cd5d7-63d3-4488-bf8d-4bb8c751c989";

// postTransacao(): Observable<Transacao[]> {
//   return this.http.get<Transacao[]>(this.url); }

  efetivarTransacao(transacao : Transacao[]) {
    return  this.http.post(this.url, transacao);
  }
}

