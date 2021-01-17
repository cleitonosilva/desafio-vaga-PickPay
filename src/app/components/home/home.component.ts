import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/models/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CardListComponent } from '../modal/card-list/card-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  usuarios: Usuario [] = []
  nomeUsuarioparModal : string 


  constructor( private usuariosService : UsuariosService, private modalService: NgbModal) { }

  ngOnInit(): void {

    this.usuariosService.getUsuarios().subscribe(x =>
      {this.usuarios = x})

  }

  open() {
    const modalRef = this.modalService.open(CardListComponent);
    modalRef.componentInstance.name = this.nomeUsuarioparModal;
  }

  pegarNome(nome: any) {
    this.nomeUsuarioparModal = nome.value

  }
}
