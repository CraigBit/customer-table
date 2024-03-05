import { ValidatorFn } from '@angular/forms';

export interface FieldConfig {
  /**
   * Ключ контрола
   */
  name: string;

  /**
   * Надпись
   */
  label: string;

  /**
   * Тип поля
   */
  type: string;

  /**
   * Валидаторы поля
   */
  validators: ValidatorFn[];

  /**
   * Сообщение об ошибке
   */
  message: string;
}
