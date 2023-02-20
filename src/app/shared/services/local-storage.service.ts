import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public set(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public get(key: string): any {
    const item = localStorage.getItem(key);

    if (!!item) {
      return JSON.parse(item);
    }
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }

  public logout() {
  }

  public clear(): void {
    localStorage.clear();
  }
}
