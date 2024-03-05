export class KeyValue<T = string> {
  /**
   * Сущность ключ-значение
   * @param key
   * @param value
   */
  constructor(public key: string, public value: T) {}
}
