import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderSevice } from './shared/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loading$!: Observable<boolean>;

  constructor(private loaderService: LoaderSevice) {
    this.loading$ = loaderService.loader$;
  }
}
