import { Component, OnInit } from '@angular/core';
import { FormInputComponent } from '../form-input/form-input.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgFor } from '@angular/common';
import { FieldConfig } from 'src/app/interfaces/field-config.interface';
import { DynamicDialogComponent } from '../dynamic-dialog/dynamic-dialog.component';
import { IdCustomer } from 'src/app/interfaces/table-data.interface';
import { getKeys } from 'src/app/helpers/common';

@Component({
  selector: 'app-add-edit-customer',
  templateUrl: './add-edit-customer.component.html',
  styleUrls: ['./add-edit-customer.component.scss'],
  standalone: true,
  imports: [FormInputComponent, FormsModule, ReactiveFormsModule, NgFor],
})
export class AddEditCustomerComponent implements OnInit {
  /**
   * Форма добавления клиента
   */
  public form!: FormGroup;

  /**
   * Список контролов формы
   */
  public config: FieldConfig[] = [
    {
      name: 'name',
      label: 'Имя',
      type: 'text',
      validators: [Validators.required, Validators.minLength(2)],
      message: 'Минимальное количество знаков: 2',
    },
    {
      name: 'surname',
      label: 'Фамилия',
      type: 'text',
      validators: [Validators.required, Validators.minLength(2)],
      message: 'Минимальное количество знаков: 2',
    },
    {
      name: 'email',
      label: 'E-mail',
      type: 'email',
      validators: [Validators.required, Validators.email],
      message: 'Некорректный адрес',
    },
    {
      name: 'phone',
      label: 'Телефон',
      type: 'tel',
      validators: [
        Validators.pattern(
          '^(\\+7|7|8)?[\\s-]?\\(?(9\\d{2})\\)?[\\s-]?\\d{3}[\\s-]?\\d{2}[\\s-]?\\d{2}$'
        ),
      ],
      message: 'Некорректный номер телефона',
    },
  ];

  constructor(
    private readonly fb: FormBuilder,
    public readonly ref: DynamicDialogComponent<Partial<IdCustomer>>
  ) {}

  public ngOnInit(): void {
    this.form = this.fb.group({});
    this.config.forEach((item) => {
      const control = this.fb.control('', {
        validators: item.validators,
        nonNullable: false,
      });
      this.form.addControl(item.name, control);
    });

    if (this.ref.config) {
      getKeys(this.form.controls).forEach((key) =>
        this.form
          .get(String(key))
          ?.setValue(this.ref.config?.data[key as keyof IdCustomer])
      );
    }
  }

  /**
   * Отправка формы
   */
  public onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    this.ref.close({
      ...this.form.value,
      id: this.ref.config?.data.id ?? null,
    });
  }
}
