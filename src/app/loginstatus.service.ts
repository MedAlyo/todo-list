import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginStatusService {
  private loginStatusSource = new BehaviorSubject<boolean>(false); // Default to logged out

  // Expose the BehaviorSubject directly
  currentLoginStatus$: BehaviorSubject<boolean> = this.loginStatusSource;

  constructor() {}

  updateLoginStatus(isLoggedIn: boolean): void {
    this.loginStatusSource.next(isLoggedIn);
  }
}