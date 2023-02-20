import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from 'src/app/environments/environment';
import { UserI } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
  ) {}

  login(credentials: UserI): Observable<any> {
    return this.http.post(
      `${environments.baseURL}${environments.userAPI}/login`,
      credentials
    );
  }

  register(user: UserI): Observable<any> {
    return this.http.post(
      `${environments.baseURL}${environments.userAPI}/register`,
      user
    );
  }

  //decode jwt token
  public decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1])).id;
    } catch (e) {
      return null;
    }
  }

  logout() {
    localStorage.removeItem('auth-token');
  }

  /**
   *
   * @returns boolean
   */
  public isLoggedIn(): boolean {
    const isToken:any = localStorage.getItem('auth-token');
    const currentTime = new Date().getTime() / 1000;
    const isValidate = this.decodeToken(isToken).exp < currentTime;
    return isToken && !isValidate;
  }
}
