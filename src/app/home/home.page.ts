import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore'
import { AuthService } from '../providers/auth.service';
import { user } from '../models/user.model';
import { IdeaService } from '../services/idea.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    public afAuth: AngularFireAuth,
    private authService : AuthService,
    private activatedRoute: ActivatedRoute, 
    private ideaService: IdeaService
    ) {
      this.authService.user$.subscribe(data=>{
        if(data){
          this.user = data;
        }else{
          console.log('not logged in');
        }
      });
      
  }
  user: user;
  signOut(){
    this.afAuth.auth.signOut().then(() => {
      location.reload();
    });
  }

  ngOnInit(){
    
  }

}
