import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  public title$: Subject<string> = new ReplaySubject<string>(1);

  public setTitle(title: string): void {
    this.title$.next(title);
  }
}
