export interface Customer {
  /**
   * Имя
   */
  name: string;

  /**
   * Фамилия
   */
  surname: string;

  /**
   * Почта
   */
  email: string;

  /**
   * Номер телефона
   */
  phone: string;
}

export interface IdCustomer extends Customer {
  /**
   * Идентификатор ряда
   */
  id: ReturnType<typeof crypto.randomUUID>;
}
