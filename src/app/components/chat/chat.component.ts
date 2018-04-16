import { Component, OnInit } from '@angular/core';
import {ChatService} from '../../providers/chat.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})
export class ChatComponent implements OnInit {

  mensaje:string;
  elemento:any;
  constructor(public cs:ChatService) { 
    this.cs.cargarMensajes().subscribe(()=>{
      setTimeout(() => {
        this.elemento.scrollTop = this.elemento.scrollHeight;
      }, 20);
    });
  }

  ngOnInit() {
    this.elemento = document.getElementById('app-mensajes');
  }
  enviarMensaje(){
    if(this.mensaje.length == 0){
      return;
    }
    this.cs.agregarMensage(this.mensaje).then(
      ()=>{
    console.log('mensaje enviado');
    this.mensaje="";
    }
    ).catch((err)=>console.log(err))
  }
}
