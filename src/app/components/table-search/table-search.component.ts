import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-search',
  templateUrl: './table-search.component.html',
  styleUrls: ['./table-search.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class TableSearchComponent {
  /**
   * Состояние поискового фильтра
   */
  @Input() public state = '';

  /**
   * Событие сортировки
   */
  @Output() private searchEvent = new EventEmitter<string | null>();

  /**
   * Установить поисковой фильтр для таблицы
   */
  public setSearch(): void {
    const trimmedValue = this.state.trim();
    this.searchEvent.emit(trimmedValue.length ? trimmedValue : null);
  }
}
