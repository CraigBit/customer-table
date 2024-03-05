import { DOCUMENT } from '@angular/common';
import { InjectionToken, inject } from '@angular/core';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'Инжектор локального хранилица',
  {
    factory: () => (inject(DOCUMENT).defaultView as Window).localStorage,
  }
);

/**
 * Ключ для данных
 */
export const CUSTOMERS_KEY = 'customers';

/**
 * Ключ для состояния сортировки
 */
export const SORT_KEY = 'sort';

/**
 * Ключ для состояния сортировки
 */
export const FILTER_KEY = 'filter';
