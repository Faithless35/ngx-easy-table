import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { API, Config, TableAPI } from '../..';
import { ConfigService } from '../../services/config-service';
import { PaginationControlsDirective } from 'ngx-pagination';

export interface PaginationRange {
  page: number;
  limit: number;
}

@Component({
  selector: 'pagination',
  templateUrl: './pagination.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PaginationComponent implements OnInit {
  @ViewChild('paginationDirective') paginationDirective: PaginationControlsDirective;
  @Input() pagination;
  @Input() config: Config;
  @Input() id;
  @Input() api: TableAPI;
  @Output() readonly updateRange: EventEmitter<PaginationRange> = new EventEmitter();
  public ranges: number[] = [5, 10, 25, 50, 100];
  public limit: number = ConfigService.config.rows;
  public showRange = false;
  public screenReaderPaginationLabel = 'Pagination';
  public screenReaderPageLabel = 'page';
  public screenReaderCurrentLabel = 'You are on page';
  public previousLabel = '';
  public nextLabel = '';
  public directionLinks = true;

  ngOnInit() {
    if (this.api) {
      this.bindApi();
      this.api.paginationComponent = this.paginationDirective;
    }
  }

  onPageChange(page: number): void {
    this.updateRange.emit({
      page,
      limit: this.limit,
    });
  }

  changeLimit(limit: number): void {
    this.showRange = !this.showRange;
    this.limit = limit;
    this.updateRange.emit({
      page: 1,
      limit,
    });
  }

  private bindApi() {
    this.api.subscribe((event) => {
      switch (event.type) {
        case API.setPaginationCurrentPage:
          this.paginationDirective.setCurrent(event.value);
          break;
        case API.setPaginationRange:
          this.ranges = event.value;
          break;
        case API.setPaginationPreviousLabel:
          this.previousLabel = event.value;
          break;
        case API.setPaginationNextLabel:
          this.nextLabel = event.value;
          break;
        default:
      }
    });
  }
}
