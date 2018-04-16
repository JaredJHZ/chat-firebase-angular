import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import { Observable } from '@firebase/util';
import {Message} from '../interfaces/message.interface';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
@Injectable()
export class ChatService {

  private itemsC:AngularFirestoreCollection<Message>;
  chats:Message[];
  public usuario: any = {};

  constructor(private afs:AngularFirestore, private afa:AngularFireAuth) {

      this.afa.authState.subscribe(
        (user)=>{
          console.log(user);
          if(!user){return;}
          this.usuario.nombre = user.displayName;
          this.usuario.id = user.uid;
        }
      );
    
   }

  cargarMensajes(){
    this.itemsC = this.afs.collection<Message>('chats',(ref)=> ref.orderBy('fecha','desc').limit(5));
    return this.itemsC.valueChanges()
      .map(
        (mensajes:Message[])=>{
          this.chats=[];
          for(let mensaje of mensajes){
            this.chats.unshift(mensaje);
          }
        }
      );
  }

  iniciarSesion(proovedor:string){
    if(proovedor === 'google'){
      this.afa.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }else{
      this.afa.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
    }
  }

  cerrarSesion(){
    this.usuario = {};
    this.afa.auth.signOut();
  }

  agregarMensage(texto:string){
    //TODO falta id usuario
    let mensaje:Message = {
      nombre:this.usuario.nombre,
      mensaje:texto,
      fecha:new Date().getTime(),
      id: this.usuario.id
    };
    return this.itemsC.add(mensaje);
  }

}
