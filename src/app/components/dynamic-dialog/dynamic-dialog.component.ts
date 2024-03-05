import {
  AfterViewInit,
  Component,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DynamicDialogConfig } from 'src/app/classes/dynamic-dialog-config';

@Component({
  selector: 'app-dynamic-dialog',
  templateUrl: './dynamic-dialog.component.html',
  styleUrls: ['./dynamic-dialog.component.scss'],
  standalone: true,
})
export class DynamicDialogComponent<T = unknown> implements AfterViewInit {
  /**
   * Контейнер для динамического контента
   */
  @ViewChild('dynamicComponent', { read: ViewContainerRef })
  private readonly vcr!: ViewContainerRef;

  /**
   * Вложенный компонент
   */
  public childComponentType!: Type<any>;

  /**
   *
   */
  public get onClose(): Observable<any> {
    return this.onCloseSub.asObservable();
  }

  constructor(public config?: DynamicDialogConfig<T>) {}

  /**
   * Сабжект на уничтожение компонента
   */
  private readonly onCloseSub = new Subject<any>();

  /**
   * Закрыть диалог
   * @param result
   */
  public close(result?: unknown) {
    this.onCloseSub.next(result);
  }

  public ngAfterViewInit(): void {
    const component = this.vcr.createComponent(this.childComponentType);
    component.changeDetectorRef.detectChanges();
  }
}
