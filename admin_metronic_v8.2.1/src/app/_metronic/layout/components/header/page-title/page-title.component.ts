import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { PageInfoService, PageLink } from '../../../core/page-info.service';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
})
export class PageTitleComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = [];

  @Input() appPageTitleDirection = '';
  @Input() appPageTitleBreadcrumb: boolean;
  @Input() appPageTitleDescription: boolean;

  title$: Observable<string>;
  description$: Observable<string>;
  bc$: Observable<PageLink[]>;

  constructor(private pageInfo: PageInfoService) {}

  ngOnInit(): void {
    this.title$ = this.pageInfo.title.asObservable();
    this.description$ = this.pageInfo.description.asObservable();
    this.bc$ = this.pageInfo.breadcrumbs.asObservable();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
