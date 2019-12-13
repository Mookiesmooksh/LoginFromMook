import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Idea {
  id?: string,
  name: string,
  notes: string,
  address: string,
}
 
@Injectable({
  providedIn: 'root'
})
export class IdeaService {
  private ideas: Observable<Idea[]>;
  private userCollection: AngularFirestoreCollection<Idea>;
  private ideaCollection: AngularFirestoreCollection<Idea>;
  myId = null;
 
  constructor(private afs: AngularFirestore) {
    
  }

  initiateService(data: string) {
    this.myId = data;
  }

  startService() {
    console.log(this.myId);
    this.userCollection = this.afs.collection<Idea>('users');
    this.ideaCollection = this.afs.collection("users").doc(this.myId).collection<Idea>('details');
    this.ideas = this.ideaCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
 
  getIdeas(): Observable<Idea[]> {
    return this.ideas;
  }
 
  getIdea(id: string): Observable<Idea> {
    return this.ideaCollection.doc(this.myId).collection("details").doc<Idea>(id).valueChanges().pipe(
      take(1),
      map(idea => {
        idea.id = this.myId;
        return idea
      })
    );
  }
 
  addIdea(idea: Idea): Promise<void> {
    return this.userCollection.doc(this.myId).collection("details").doc(this.myId).set(idea);
  }
 
  updateIdea(idea: Idea): Promise<void> {
    return this.userCollection.doc(this.myId).collection("details").doc(this.myId).update({ name: idea.name, notes: idea.notes, address: idea.address });
  }
 
  deleteIdea(id: string): Promise<void> {
    return this.userCollection.doc(this.myId).collection("details").doc(this.myId).delete();
  }
}