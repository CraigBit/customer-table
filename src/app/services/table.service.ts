import { Inject, Injectable } from '@angular/core';
import { IdCustomer } from '../interfaces/table-data.interface';
import { Observable, Subject, map, of, tap } from 'rxjs';
import { SortState } from '../classes/sort-state';
import { SortOrder } from '../enums/sort-type.enum';
import { KeyValue } from '../classes/key-value';
import {
  CUSTOMERS_KEY,
  FILTER_KEY,
  LOCAL_STORAGE,
  SORT_KEY,
} from '../consts/local-storage';
import { ApiTableService } from './api-table.service';
import { getKeys } from '../helpers/common';

@Injectable({ providedIn: 'root' })
export class TableService {
  /**
   * Транслятор события сортировки
   */
  public readonly currentSort = new Subject<SortState | null>();

  /**
   * Транслятор события фильтрации
   */
  public readonly currentSearch = new Subject<KeyValue<string | null>>();

  /**
   * Транслятор изменения записей в таблице
   */
  private readonly customerState = new Subject<IdCustomer[]>();

  /**
   * Отмеченные ряды таблицы
   */
  public checkedRows: string[] = [];

  /**
   * Клиенты
   */
  public customers: IdCustomer[] = [];

  /**
   * Начальное состояние таблицы клиентов
   */
  private initialCustomers: IdCustomer[] = [];

  /**
   * Текущие настройки сортировки
   */
  public sortObject: SortState | null = null;

  /**
   * Текущие настройки поискового фильтра
   */
  public filterObject: Record<string, string> | null = null;

  constructor(
    private readonly apiTableService: ApiTableService,
    @Inject(LOCAL_STORAGE) private readonly localStorage: Storage
  ) {
    this.currentSort.subscribe((value) => {
      this.sortObject = value;
      this.customers = this.sortAndFilterTable(this.initialCustomers);
      this.setStorage(SORT_KEY, this.sortObject);
    });

    this.currentSearch.subscribe(({ key, value }) => {
      console.log(key, value);

      value === null
        ? delete this.filterObject?.[key]
        : (this.filterObject = { ...this.filterObject, [key]: value });

      this.customers = this.sortAndFilterTable(this.initialCustomers);
      this.setStorage(FILTER_KEY, this.filterObject);
    });

    this.customerState.subscribe((newCustomers) => {
      this.customers = this.sortAndFilterTable(newCustomers);
      this.setStorage(CUSTOMERS_KEY, this.customers);
    });
  }

  /**
   * Добавить в локальное хранилище
   */
  public setStorage(key: string, data: any): void {
    this.localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * Добавить в локальное хранилище
   */
  public getItem(key: string): string | null {
    return this.localStorage.getItem(key);
  }

  /**
   * Получить клиентов
   */
  public getCustomers(): Observable<IdCustomer[]> {
    const [sort, filter, customers] = [SORT_KEY, FILTER_KEY, CUSTOMERS_KEY].map(
      (key) => this.getItem(key)
    );
    const method = customers
      ? this.apiTableService.parseCustomers(customers)
      : this.apiTableService.getCustomers();

    return method.pipe(
      tap((customers) => {
        [this.sortObject, this.filterObject] = [sort, filter].map(
          (data) => data && JSON.parse(data)
        );

        this.initialCustomers = customers;
        this.customers = this.sortAndFilterTable(this.initialCustomers);
      })
    );
  }

  /**
   * Добавить клиента
   */
  public addCustomer(customer: IdCustomer): void {
    this.initialCustomers.push(customer);
    this.customerState.next(this.initialCustomers);
  }

  /**
   * Редактировать клиента
   */
  public editCustomer(customer: IdCustomer): void {
    const index = this.initialCustomers.findIndex((c) => c.id === customer.id);
    if (index > -1) {
      this.initialCustomers.splice(index, 1, customer);
      this.customerState.next(this.initialCustomers);
    }
  }

  /**
   * Удалить клиентов
   */
  public deleteCustomers(): void {
    this.initialCustomers = this.initialCustomers.filter((customer) =>
      this.checkedRows.every((id) => id !== customer.id)
    );
    this.customerState.next(this.initialCustomers);
    this.checkedRows = [];
  }

  /**
   * Отсортировать и отфильтровать таблицу
   */
  private sortAndFilterTable(table: IdCustomer[]): IdCustomer[] {
    const sortedCustomers = this.sortTable([...table]);
    return this.filterTable(sortedCustomers);
  }

  /**
   * Отсортировать таблицу
   */
  private sortTable(table: IdCustomer[]): IdCustomer[] {
    if (this.sortObject) {
      table.sort((a, b) => {
        const key = this.sortObject?.key as keyof IdCustomer;

        return this.sortObject?.order === SortOrder.Ascending
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      });

      return table;
    }

    return table;
  }

  /**
   * Отфильтровать таблицу
   */
  private filterTable(table: IdCustomer[]): IdCustomer[] {
    console.log(table);
    console.log(this.filterObject);

    return table.filter((customer) => {
      const filterKeys = getKeys(this.filterObject ?? {});

      return filterKeys.every((key) =>
        customer[key as keyof IdCustomer]
          .toLowerCase()
          .includes(this.filterObject?.[key] ?? '')
      );
    });
  }
}
