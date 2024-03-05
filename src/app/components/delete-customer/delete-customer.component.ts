import { Component } from '@angular/core';
import { DynamicDialogComponent } from '../dynamic-dialog/dynamic-dialog.component';

@Component({
  selector: 'app-delete-customer',
  templateUrl: './delete-customer.component.html',
  styleUrls: ['./delete-customer.component.scss'],
  standalone: true,
})
export class DeleteCustomerComponent {
  /**
   * Сообщение при удалении
   */
  public deleteMessage: string = '';

  constructor(public readonly ref: DynamicDialogComponent<number>) {
    this.deleteMessage = `Удалить выбранные строки (${this.ref.config?.data})?`;
  }
}
