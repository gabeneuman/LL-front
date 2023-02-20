import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TitleService } from 'src/app/shared/services/title.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css'],
})
export class TitleComponent implements OnInit{
  public title: Observable<string> = new Observable<string>();

  constructor(private titleService: TitleService) {}

  ngOnInit(): void {
    this.title = this.titleService.title$;
  }
}
