import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer, IdCustomer } from '../interfaces/table-data.interface';
import { Observable, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiTableService {
  constructor(private readonly http: HttpClient) {}

  /**
   * Получить клиентов с сервера
   */
  public getCustomers(): Observable<IdCustomer[]> {
    return this.http
      .get<{ users: Customer[] }>('https://test-data.directorix.cloud/task1')
      .pipe(
        map(({ users }) =>
          users.map((user) => ({ ...user, id: crypto.randomUUID() }))
        )
      );
  }

  /**
   * Получить клиентов из локального хранилища
   * @param customers Клиенты в строком виде из локального хранилища
   */

  public parseCustomers(customers: string): Observable<IdCustomer[]> {
    return of(JSON.parse(customers));
  }
}
