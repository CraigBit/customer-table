import {
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { FormGroupDirective, NgControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputStates } from 'src/app/enums/input-states.enum';
import { fromEvent } from 'rxjs';

@Directive({ selector: '[highlight]', standalone: true })
export class InputHighlightDirective implements OnInit {
  /**
   * Инстанс формы
   */
  @Input() public highlight!: string;

  /**
   * Директива формы
   */
  @Input() public directive!: FormGroupDirective;

  /**
   * Инпут внутри кастомного компонента
   */
  private input!: HTMLInputElement;

  /**
   * Элемент сообщения об ошибке
   */
  private errorMessage!: HTMLSpanElement;

  constructor(
    private readonly destroyRef: DestroyRef,
    private readonly el: ElementRef<HTMLDivElement>,
    private readonly renderer: Renderer2
  ) {}

  /**
   * Хук инициализации
   */
  public ngOnInit(): void {
    this.input = this.el.nativeElement.querySelector(
      'input'
    ) as HTMLInputElement;
    this.errorMessage = this.el.nativeElement.querySelector(
      '.error'
    ) as HTMLSpanElement;

    this.renderer.setStyle(this.errorMessage, 'display', 'none');
    const control = this.directive.form.get(this.highlight);
    if (control?.value) {
      this.toggleClasses(InputStates.Filled);
    }

    this.directive.ngSubmit
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (control?.status === 'INVALID') {
          this.toggleClasses(InputStates.Invalid);
        }
      });

    ['focus', 'blur'].map((e) =>
      fromEvent(this.input, e)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event) => {
          if (this.input.classList.contains(InputStates.Invalid)) {
            return;
          }

          event.type === 'focus'
            ? this.toggleClasses(InputStates.Focused)
            : this.toggleClasses(this.input.value ? InputStates.Filled : '');
        })
    );

    control?.valueChanges
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.directive.submitted && control?.status === 'INVALID') {
          this.toggleClasses(InputStates.Invalid);

          return;
        }

        this.toggleClasses(InputStates.Focused);
      });
  }

  /**
   * Переключение классов инпута
   * @param state Класс, который нужно включить
   */
  private toggleClasses(state?: string): void {
    state === InputStates.Invalid
      ? this.renderer.removeStyle(this.errorMessage, 'display')
      : this.renderer.setStyle(this.errorMessage, 'display', 'none');

    Object.values(InputStates).forEach((item) => {
      if (item === state) {
        this.renderer.addClass(this.input, item);

        return;
      }

      this.renderer.removeClass(this.input, item);
    });
  }
}
