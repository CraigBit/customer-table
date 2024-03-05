import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SortOrder } from 'src/app/enums/sort-type.enum';

@Component({
  selector: 'app-table-sort',
  templateUrl: './table-sort.component.html',
  styleUrls: ['./table-sort.component.scss'],
  standalone: true,
})
export class TableSortComponent {
  /**
   * Событие сортировки
   */
  @Output() private sortEvent = new EventEmitter<SortOrder | null>();

  /**
   * Порядок сортировки
   */
  @Input() public state: SortOrder | null = null;

  /**
   * Порядок сортировки
   */
  public sortOrder = SortOrder;

  /**
   * Статус активности иконки сортировки
   */
  public isActive(order: SortOrder): boolean {
    return this.state === order;
  }

  /**
   * Установить сортировку
   */
  public setSort(): void {
    switch (this.state) {
      case SortOrder.Ascending:
        this.state = SortOrder.Descending;
        break;
      case SortOrder.Descending:
        this.state = null;
        break;
      default:
        this.state = SortOrder.Ascending;
        break;
    }

    this.sortEvent.emit(this.state);
  }
}
