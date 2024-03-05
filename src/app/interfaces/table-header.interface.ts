import { SortOrder } from '../enums/sort-type.enum';

export interface TableHeader {
  /**
   * Ключ заголовка
   */
  key: string;

  /**
   * Название заголовка
   */
  label: string;

  /**
   * Состояние сортировки для колонки
   */
  sort: SortOrder | null;

  /**
   * Состояние поискового фильтра для колонки
   */
  search: string;
}
