import { SortOrder } from '../enums/sort-type.enum';

export class SortState {
  /**
   * Состояние сортировки
   * @param key Ключ сортировки
   * @param order Порядок сортировки
   */
  constructor(public key: string, public order: SortOrder) {}
}
