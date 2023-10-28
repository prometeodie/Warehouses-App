import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../assets/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';
import {  Observable, catchError, map, of, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private readonly baseUrl: string = environment.baseUrl;
    private http = inject( HttpClient )
    private users:User[] = [
      {
        id: 1,
        email: "user@user.com",
        password: '123456',
        roles: ["USER"]
      },
      {
        id: 2,
        email: "admin@admin.com",
        password: '123456',
        roles: ["ADMIN"]
      }
    ]
    // signals
    private _currentUser = signal< User|null>(null);
    private _authStatus = signal<AuthStatus>(AuthStatus.checking);

    public currentUser = computed(( )=> this._currentUser());
    public authStatus = computed(( )=> this._authStatus());

   private setUserAuthentication(user: User, accessToken: string): boolean{
          this._currentUser.set(user);
          this._authStatus.set( AuthStatus.authenticated );
          localStorage.setItem('token', accessToken);
          localStorage.setItem('id', user.id.toString());

          return true;
    }

  login (email:string, password:string): Observable<boolean>{
    // const url = `${this.baseUrl}/auth/login`;
    // const body = {email, password};
    // return this.http.post<LoginResponse>(url, body)
    // .pipe(
    //   map(({user, token})=>{
    //     this.setUserAuthentication(user, token);
    //   }),
    //   map(()=> true),
    //   catchError(err => throwError(()=> err.error.message))
    // )

    const user = this.users.filter(user=>{
      return user.email === email
    })
    console.log(user[0])
    if(user.length !== 1){
      return of(false)
    }
    console.log(user[0])
    if(user[0].password === password){
      this.setUserAuthentication(user[0], user[0].id.toString());
      return of(true)
    }
    return of(false)
  }

  checkAuthStatus(): Observable<boolean>{

    const token = localStorage.getItem('token');

    if(!token) {
      this._authStatus.set( AuthStatus.noAuthenticated );
      return of(false)
    };
    const id = parseInt( localStorage.getItem('id')!);
    this._authStatus.set( AuthStatus.authenticated );
    const user = this.users.filter(user=>{
      return user.id === id
    })[0]
    this.setUserAuthentication(user, token)
    // this.http.get<User>(`${this.baseUrl}/users/${id}`).pipe(
    //   map( user =>{this.setUserAuthentication(user, token);
    //     this.getUsersRol().subscribe(resp => console.log('check',resp))
    //   }

    // ).subscribe()
    return of(true);
  }

  // checkAuthStatus(): Observable<boolean>{
  //   const url = `${this.baseUrl}/auth/check-token`
  //   const token = localStorage.getItem('token');

  //   if(!token) {
  //     this._authStatus.set( AuthStatus.noAuthenticated );
  //     return of(false)
  //   };

  //   const headers = new HttpHeaders()
  //   .set('Authorization',`Bearer ${token}`);

  //   return this.http.get<CheckTokenResponse>(url, { headers })
  //   .pipe(
  //       map(({token, user}) => {
  //       return this.setUserAuthentication(user, token);
  //       }),
  //       catchError((err)=>{
  //         this._authStatus.set(AuthStatus.noAuthenticated);
  //         return of(false);
  //       })
  //   )
  // }

  logOutUser(){
    localStorage.clear();
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.noAuthenticated);
  }

}


