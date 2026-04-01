import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor() { }

  private tokenName = environment.tokenName;

  private isLoggedIn = new BehaviorSubject<boolean>(this.getToken());
  isLoggedIn$ = this.isLoggedIn.asObservable();

  getToken() {
    const sess = sessionStorage.getItem(this.tokenName);
    if (sess) return true;

    const locs = localStorage.getItem(this.tokenName);

    if (locs) {
      sessionStorage.setItem(this.tokenName, locs);
      return true;
    }

    return false;
  }

  login(token: string) {
    sessionStorage.setItem(this.tokenName, token);
    this.isLoggedIn.next(true);
  }

  logout() {
    sessionStorage.removeItem(this.tokenName);
    localStorage.removeItem(this.tokenName);
    this.isLoggedIn.next(false);
  }

  LoggedUser() {
    const token = sessionStorage.getItem(this.tokenName);
    if (token) {
      return token;  //TODO: itt még matatni kell
    }
    return null;
  }

  storeUser(token: string) {
    localStorage.setItem(this.tokenName, token);
  }

  isLoggedUser(): boolean {
    return this.isLoggedIn.value;
  }

  isAdmin(): boolean {
    const user = this.GetLoggedUser();
    if (user && user.role_id === 1) { // Assuming role_id 1 is admin
      return true;
    }
    return false;
  }


  GetLoggedUser() {
    // Check sessionStorage first (where login stores the token)
    let token = sessionStorage.getItem(this.tokenName);
    
    // Fallback to localStorage if not in sessionStorage
    if (!token) {
      token = localStorage.getItem(this.tokenName);
    }
    
    if (token) {
      try {
        // Split the JWT token to get the payload (format: header.payload.signature)
        const payload = token.split('.')[1];
        // Decode the base64 payload
        const decodedPayload = atob(payload);
        // Parse the JSON
        return JSON.parse(decodedPayload);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }
}
