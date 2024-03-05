import { Component } from '@angular/core';
import { Customer } from 'src/app/interfaces/table-data.interface';
import { TableService } from 'src/app/services/table.service';
import { DialogService } from 'src/app/services/dialog.service';
import { AddEditCustomerComponent } from '../add-edit-customer/add-edit-customer.component';
import { filter } from 'rxjs';
import { DeleteCustomerComponent } from '../delete-customer/delete-customer.component';
import { DynamicDialogConfig } from 'src/app/classes/dynamic-dialog-config';

@Component({
  selector: 'app-table-controls',
  templateUrl: './table-controls.component.html',
  styleUrls: ['./table-controls.component.scss'],
  standalone: true,
})
export class TableControlsComponent {
  constructor(
    private readonly tableService: TableService,
    private readonly dialogService: DialogService
  ) {}

  /**
   * Отмеченные ряды таблмцы
   */
  public get checkedRows(): string[] {
    return this.tableService.checkedRows;
  }

  /**
   * Добавить клиента
   */
  public addCustomer(): void {
    const ref = this.dialogService.open(AddEditCustomerComponent);

    ref.onClose.pipe(filter((res) => res)).subscribe((customer: Customer) => {
      const idCustomer = { ...customer, id: crypto.randomUUID() };
      this.tableService.addCustomer(idCustomer);
    });
  }

  /**
   * Добавить клиента
   */
  public deleteCustomers(): void {
    const ref = this.dialogService.open(
      DeleteCustomerComponent,
      new DynamicDialogConfig(this.tableService.checkedRows.length)
    );

    ref.onClose
      .pipe(filter((res) => res))
      .subscribe(() => this.tableService.deleteCustomers());
  }
}
