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
          <p>{{mensagemDeAprovacao}}</p>
    </div>
    
  `
})
export class ModalMsg {
  @Input() mensagemDeAprovacao : any;

  constructor(public activeModal: NgbActiveModal) {}
}
// ----------------------------------------------------------------------
@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {
  @Input() name: any;
  transacaoEmAndamento: Transacao [];
  transacao: Transacao[] = [];
  msg: any;
  usuarios: Usuario[] =[] ;
  usuario: Usuario[];
  valor: any = 0 ;
  numeroCartao: number ;
  cardBusca: cartao[] = [];
  cartaoValido: string ;
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
  constructor(public activeModal: NgbActiveModal, public transacaoService : TransacaoService,public usuariosService : UsuariosService, private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {

    this.usuariosService.getUsuarios().subscribe(
      x => {
        this.usuarios = x
      }
    )
    this.valor = Number(this.valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}));
  }

  cartaoSelecionado(cartao: any){
    const crt = cartao.value
    this.numeroCartao = crt
    const cartaoDoBanco = this.cards.find(c => c.card_number == cartao.value)
    // const nameEscolhido = this.usuarios.find(x => {
    //   x.name == this.name
    // })
    
    this.usuarios = this.usuarios.map(d => d.name == this.name ?({...d, card_number: cartaoDoBanco?.card_number, cvv: cartaoDoBanco?.cvv,
      expiry_date: cartaoDoBanco?.expiry_date, value: this.valor }) : d)

    const transacaoMontada = localStorage['transacao'] ? JSON.parse(localStorage['transacao']) : [];
    
    transacaoMontada.push({
      card_number: cartaoDoBanco?.card_number,  
      cvv: cartaoDoBanco?.cvv,
      expiry_date: cartaoDoBanco?.expiry_date,
      // destination_user_id: idDousuario,
      value: this.valor
      });
      localStorage.setItem('transacao', JSON.stringify(transacaoMontada));
  }

  efetuarPagamento(){
    const storageValue = JSON.parse(String(localStorage.getItem('transacao')));
    this.transacaoEmAndamento = storageValue;
    localStorage.clear();

    for (let item of this.transacaoEmAndamento ){
      const cartaoValido = item.card_number
      this.cartaoValido = cartaoValido
    }
    
    if(this.cartaoValido == '1111111111111111'){
      this.transacaoService.efetivarTransacao(this.transacaoEmAndamento).subscribe(
        success => this.msg = "O Pagamento foi concluido com sucesso!",
        error => this.msg = "O Pagamento não foi concluido com sucesso!",
        )
        console.log("cartão válido")
        this.openMOdal("O Pagamento foi concluido com sucesso!")
      } else {
        this.openMOdal("O Pagamento não foi concluido com sucesso!")
        
        return console.log("cartão inválido")
      }
    }
    
    openMOdal(msg? : any) {
      const modalRef = this.modalService.open(ModalMsg);
      modalRef.componentInstance.mensagemDeAprovacao = msg;
    }

  }


// cartaoSelecionado(cartao: any){
//   const crt = cartao.value
//   this.numeroCartao = crt
//   const cartaoDoBanco = this.cards.find(c => c.card_number == cartao.value)
      
//   // const nameEscolhido = this.usuarios.find(x => {
//   //   x.name == this.name
    
//   // })
  
//   this.usuarios = this.usuarios.map(d => d.name == this.name ?({...d, card_number: cartaoDoBanco?.card_number, cvv: cartaoDoBanco?.cvv,
//     expiry_date: cartaoDoBanco?.expiry_date, value: this.valor, destination_user_id: d.id  }) : d)
// }

// efetuarPagamento(){

//   for (let item of this.usuarios ){
//     const numeroCartao = item.card_number
//     this.cartaoValido = String(numeroCartao)
    
//     for (let trans of this.transacao){
//       trans.card_number = String(item.card_number)
//       trans.cvv = Number(item.cvv)
//       trans.destination_user_id = Number(item.destination_user_id)
//       trans.expiry_date = String(item.expiry_date)
//       trans.value = Number(item.value)
//     }
//     console.log(numeroCartao)
//   if(numeroCartao == '1111111111111111'){
    
//       this.transacaoService.efetivarTransacao(this.transacao).subscribe(
//         success => console.log("sucesso"),
//         error => console.log("erro")
//         )
//     }
//     else {
      
//       return console.log("cartão inválido ")
//   }
//   }

// }