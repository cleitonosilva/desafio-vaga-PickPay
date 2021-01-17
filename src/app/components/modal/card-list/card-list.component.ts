import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal  } from '@ng-bootstrap/ng-bootstrap';
import { cartao } from 'src/app/models/cartao';
import { Transacao } from 'src/app/models/transacao';
import { Usuario } from 'src/app/models/usuario';
import { TransacaoService } from 'src/app/services/transacao.service';
import { UsuariosService } from 'src/app/services/usuarios.service';


@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header" style="background:RGB(53, 54, 85)">
    <p class="modal-title" style="color: #ffff; font-size: 20px">Recido de pagamento </p> 
</div>   

    <div class="modal-body box--body">
          <h4>{{mensagemDeAprovacao}}</h4>
    </div>
    
  `
})
export class ModalMsg {
  @Input() mensagemDeAprovacao : any;

  constructor(public activeModal: NgbActiveModal) {}
}
// ----------------------------------------------MODAL ACIMA---------------------------------------------------

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {
  @Input() name: any;
  transacaoEmAndamento: Transacao [];
  transacao: Transacao[] = [];
  msg: string;
  usuarios: Usuario[] =[] ;
  usuarioDestino: any;
  valor: any = 0 ;
  numeroCartao: number ;
  cardBusca: any;
  confirmarCartaoValido: string ;
  cartaoValido: string = '1111111111111111' ;
  cards: cartao[] = [
    // valid card
    {
      card_number: '1111111111111111',
      cvv: 789,
      expiry_date: '01/18',
    },
    // invalid card
    {
      card_number: '4111111111111234',
      cvv: 123,
      expiry_date: '01/20',
    },
  ];
  constructor (
    public activeModal: NgbActiveModal,
    public transacaoService : TransacaoService,
    public usuariosService : UsuariosService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {

    this.valor = Number(this.valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}));

  }
  
  cartaoSelecionado(cartao: any){
    const crt = cartao.value
    this.numeroCartao = crt
    const cartaoDoBanco = this.cards.find(c => c.card_number == cartao.value)
    this.cardBusca = cartaoDoBanco
    
    this.usuariosService.getUsuarios().subscribe(
      x => {
        this.usuarios = x.map(x => (x.name == this.name ?({...x, card_number: cartaoDoBanco?.card_number, cvv: cartaoDoBanco?.cvv, expiry_date: cartaoDoBanco?.expiry_date, value: this.valor, destination_user_id: x.id }) : x ))
      }
    )
  }

efetuarPagamento(){

  this.usuarioDestino = this.usuarios.filter(x => x.name == this.name )
  this.transacao = this.usuarioDestino

  for (let item of this.transacao ){
    const numeroCartao = item.card_number
    this.confirmarCartaoValido = String(numeroCartao)
    
    if(this.confirmarCartaoValido == this.cartaoValido){
    
      this.transacaoService.efetivarTransacao(this.transacao).subscribe(
        // success => console.log("sucesso!"),
        // error => console.log("negado!")
      )
        this.openMOdal("O Pagamento foi concluido com sucesso!")
    }
      else {
        this.openMOdal("O Pagamento não foi concluido com sucesso!")
        return console.log("cartão inválido ")
      }
  }
}
    openMOdal(msg? : any) {
      const modalRef = this.modalService.open(ModalMsg);
      modalRef.componentInstance.mensagemDeAprovacao = msg;
    }

  }