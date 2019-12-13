import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { user } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap,take } from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class AuthService {
  user$: Observable<user>;
  constructor(
    private afAuth : AngularFireAuth,
    private afs : AngularFirestore
  ){
    this.user$ = this.afAuth.authState.pipe(
      switchMap( loginData =>{
        if(loginData){
          return this.afs.collection('users').doc<user>(loginData.uid).valueChanges();
        }else{
          return of(null);
        }
      })
    );

    this.afAuth.authState.pipe(take(1)).subscribe(loginData =>{
      if(loginData){
        this.afs.collection('users').doc(loginData.uid).ref.get().then(value=>{
          if(value.exists){
            console.log(value);
            console.log('user data already exists');
          }else{
            const newUser: user = {
              uid: loginData.uid,
              email: loginData.email,
              displayName: loginData.displayName,
              blah: ""
            }
            this.afs.collection('users').doc<user>(loginData.uid).set(newUser).then(a=>{
              console.log('user added to fs');
            });
          }
        });
      }else{
        console.log('no login data');
      }
    });
  }
  
}
