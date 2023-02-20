import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, take, takeUntil } from 'rxjs/operators';
import { SideNavI } from '../shared/interfaces';
import { NAVIGATION_MENU } from '../shared/consts';
import { TitleService } from '../shared/services/title.service';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from '../shared/services/data.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public navItems: SideNavI[] = [];
  public userName: string = '';
  public userImage: string = '';
  private destory$: Subject<void> = new Subject<void>();

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private titleService: TitleService,
    private router: Router,
    private dataService: DataService,
    private authService: AuthService
  ) {}


  ngOnInit(): void {
    this.navItems = NAVIGATION_MENU;
    this.titleService.setTitle('loading...');
    this.checkRoute();
    this.setUserName();
    this.dataService.userInfoChanged$.pipe(takeUntil(this.destory$)).subscribe((user) => {
      this.userName = user?.name;
      this.userImage = user?.imageUrl;
    });
  }

  public setTitle(title: string): void {
    if (title === 'Logout') {
      this.authService.logout();
    }
    this.titleService.setTitle(title);
  }

  private checkRoute(): void {
    const currentRoute = this.navItems.find(
      (item: SideNavI) => item.path === this.router.url
    );
    this.titleService.setTitle(currentRoute?.title ?? '');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.navItems.find(
          (item: SideNavI) => item.path === this.router.url
        );
        this.titleService.setTitle(currentRoute?.title ?? '');
      }
    });
  }

  private setUserName(): void {
    this.dataService.getUser().subscribe((user) => {
      this.userName = user?.name;
      this.userImage = user?.imageUrl;
    });
  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }
}
