import { Injectable } from '@angular/core';
import { getAuth,signOut ,GoogleAuthProvider,signInWithPopup , createUserWithEmailAndPassword, signInWithEmailAndPassword, getAdditionalUserInfo, onAuthStateChanged } from "firebase/auth";
import { User } from '../models/models';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user!: User;
  isAuth!: Subject<boolean>;

  constructor(){  
    this.user= new User();
    this.isAuth=new Subject();
  }

  async createUser(userEmail: string , userPassword: string){
    const auth = getAuth();
    this.user = new User();
    const userCredential = await createUserWithEmailAndPassword(auth, userEmail, userPassword).catch(error=>{
      return error.message;
    });
    const user = userCredential.user;
    this.matchUserCredtentials(user);
  }

  async signInWithLoginAndPassword(userEmail: string , userPassword: string){
    const auth = getAuth();
    const userCredential= await signInWithEmailAndPassword(auth, userEmail, userPassword).catch(error=>{
      return error.message;
    });
    const user = userCredential.user;
    this.matchUserCredtentials(user);
  }
   
  async signOut(){
    const auth=getAuth();
    await signOut(auth).catch();
  }

  matchUserCredtentials(user: any){
    this.user.displayName=user.displayName;
    this.user.email=user.email;
    this.user.id=user.uid;
    this.user.photoURL=user.photoURL;
  }

 async  signInWithGoogle(){
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    const result: any = await signInWithPopup(auth, provider)
    .catch((error) => {
      console.log(error.message);
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      return errorMessage();
    })
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;
    console.log(user);
    this.matchUserCredtentials(user);

  }

  async checkConnexion(){
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.matchUserCredtentials(user);
        this.isAuth.next(true);
      } else {
        this.isAuth.next(false);
      }
    });
  }

}
