import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  from,
  Observable,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject!: BehaviorSubject<any>;
  public user!: Observable<any>;

  private isloggedIn: boolean;
  private userName: string = '';

  public get userValue(): any {
    return this.userSubject.value;
  }

  constructor(private router: Router, private fireauth: AngularFireAuth) {
    let userval = localStorage.getItem('user');
    if (userval) {
      this.userSubject = new BehaviorSubject<any>(JSON.parse(userval));
      this.user = this.userSubject.asObservable();
    } else {
      this.userSubject = new BehaviorSubject<any>(null);
      this.user = this.userSubject.asObservable();
    }
  }

  // login method
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(
      (res) => {
        localStorage.setItem('token', 'true');

        if (res.user?.emailVerified == true) {
          this.router.navigate(['dashboard']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      (err) => {
        alert(err.message);
        this.router.navigate(['/login']);
      }
    );
  }

  // register method
  register(email: string, password: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then(
      (res) => {
        alert('Registration Successful');
        this.router.navigate(['/login']);
      },
      (err) => {
        alert(err.message);
        this.router.navigate(['/register']);
      }
    );
  }

  // sign out
  logout() {
    this.fireauth.signOut().then(
      () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      (err) => {
        alert(err.message);
      }
    );
  }
  logoutS(): Observable<void> {
    return from(this.fireauth.signOut());
  }

  //sign in with google
  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider()).then(
      (res) => {
        this.router.navigate(['/dashboard']);
        localStorage.setItem('token', JSON.stringify(res.user?.uid));
      },
      (err) => {
        alert(err.message);
      }
    );
  }
  signIn(params: SignIn): Observable<any> {
    return from(this.fireauth
      .signInWithEmailAndPassword(params.email, params.password)
      .then(
        (res) => {

          localStorage.setItem('user', JSON.stringify(params.email));
          this.userSubject.next(params.email);

          this.router.navigate(['admindashboard']);
        },
        (err) => {
          alert(err.message);
          catchError((error: FirebaseError) =>
            throwError(
              () => new Error(this.translateFirebaseErrorMessage(error))
            )
          );
          this.router.navigate(['/login']);
        }
      ));
  }

  recoverPassword(email: string): Observable<void> {
    return from(this.fireauth.sendPasswordResetEmail(email)).pipe(
      catchError((error: FirebaseError) =>
        throwError(() => new Error(this.translateFirebaseErrorMessage(error)))
      )
    );
  }

  private translateFirebaseErrorMessage({ code, message }: FirebaseError) {
    if (code === 'auth/user-not-found') {
      return 'User not found.';
    }
    if (code === 'auth/wrong-password') {
      return 'User not found.';
    }
    return message;
  }
}

type SignIn = {
  email: string;
  password: string;
};

type FirebaseError = {
  code: string;
  message: string;
};
