import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { IdCustomer } from './interfaces/table-data.interface';
import { TableService } from './services/table.service';
import { DialogService } from './services/dialog.service';
import { AddEditCustomerComponent } from './components/add-edit-customer/add-edit-customer.component';
import { DynamicDialogConfig } from './classes/dynamic-dialog-config';
import { filter } from 'rxjs';
import { SortOrder } from './enums/sort-type.enum';
import { SortState } from './classes/sort-state';
import { TableHeader } from './interfaces/table-header.interface';
import { KeyValue } from './classes/key-value';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /**
   * Чек-боксы рядов таблицы
   */
  @ViewChildren('rowCheckbox')
  private rowCheckboxes!: QueryList<ElementRef<HTMLInputElement>>;

  /**
   * Ключи и названия заголовков таблицы
   */
  public tableHeaders: TableHeader[] = [
    { key: 'name', label: 'Имя', sort: null, search: '' },
    { key: 'surname', label: 'Фамилия', sort: null, search: '' },
    { key: 'email', label: 'E-mail', sort: null, search: '' },
    { key: 'phone', label: 'Телефон', sort: null, search: '' },
  ];

  /**
   * Клиенты
   */
  public get customers(): IdCustomer[] {
    return this.tableService.customers;
  }

  /**
   * Indeterminate состояние для чек-бокса заголовка
   */
  public get indeterminate(): boolean {
    return (
      this.tableService.checkedRows.length !== 0 &&
      this.tableService.checkedRows.length !== this.customers.length
    );
  }

  /**
   * Checked состояние для чек-бокса заголовка
   */
  public get checked(): boolean {
    return (
      this.customers.length !== 0 &&
      this.tableService.checkedRows.length === this.customers.length
    );
  }

  constructor(
    private readonly tableService: TableService,
    private readonly dialogService: DialogService
  ) {
    this.tableService.getCustomers().subscribe();
  }

  public ngOnInit(): void {
    this.tableHeaders.forEach((header) => {
      if (header.key === this.tableService.sortObject?.key) {
        header.sort = this.tableService.sortObject?.order as SortOrder;
      }

      const searchText = this.tableService.filterObject?.[header.key];
      header.search = searchText ?? '';
    });
  }

  public ngAfterViewInit(): void {}

  /**
   * Редактировать данные клиента
   * @param customer Клиент
   */
  public editCustomer(customer: IdCustomer) {
    const ref = this.dialogService.open(
      AddEditCustomerComponent,
      new DynamicDialogConfig(customer)
    );

    ref.onClose
      .pipe(filter((res) => res))
      .subscribe((customer: IdCustomer) =>
        this.tableService.editCustomer(customer)
      );
  }

  /**
   * Выбрать ряд таблицы
   * @param event Событие выбора
   * @param id ID ряда таблицы
   */
  public checkRows(event: Event, id: string): void {
    const rowCheckbox = event.target as HTMLInputElement;

    rowCheckbox.checked
      ? this.tableService.checkedRows.push(id)
      : (this.tableService.checkedRows = this.tableService.checkedRows.filter(
          (rowId) => rowId !== id
        ));
  }

  /**
   * Выбрать всю таблицы
   * @param event Событие выбора
   */
  public checkAllRows(event: Event): void {
    const headerCheckbox = event.target as HTMLInputElement;

    this.tableService.checkedRows = headerCheckbox.checked
      ? this.customers.map((customer) => customer.id)
      : [];

    this.rowCheckboxes.forEach(
      (rowCheckbox) =>
        (rowCheckbox.nativeElement.checked = headerCheckbox.checked)
    );
  }

  /**
   * Отсортировать таблицу
   * @param key Ключ сортировки
   * @param order Порядок сортировки
   */
  public sortTable(key: string, order: SortOrder | null): void {
    this.tableHeaders.forEach((header) => {
      header.sort = header.key === key ? order : null;
    });

    const sortState = order ? new SortState(key, order) : null;
    this.tableService.currentSort.next(sortState);
  }

  /**
   * Отфильтровать таблицу
   * @param key Ключ сортировки
   * @param order Порядок сортировки
   */
  public filterTable(key: string, value: string | null): void {
    this.tableService.currentSearch.next(
      new KeyValue<string | null>(key, value)
    );
  }
}
