import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenGeneratorService {

  constructor() { }

  generateToken(length:number = 20) {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
}
