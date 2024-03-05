import { Component, Input } from '@angular/core';
import {
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputHighlightDirective } from '../../directives/input-highlight.directive';
import { FieldConfig } from 'src/app/interfaces/field-config.interface';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, InputHighlightDirective],
})
export class FormInputComponent {
  /**
   * Тип инпута
   */
  @Input() config!: FieldConfig;

  /**
   * Инстанс формы, к которой относится инпут
   */
  @Input() public group!: FormGroup;

  /**
   * Директива формы
   */
  @Input() public formDirective!: FormGroupDirective;
}
