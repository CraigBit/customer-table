import {
  ApplicationRef,
  ComponentRef,
  EmbeddedViewRef,
  Inject,
  Injectable,
  Injector,
  Type,
  createComponent,
} from '@angular/core';
import { DynamicDialogComponent } from '../components/dynamic-dialog/dynamic-dialog.component';
import { DOCUMENT } from '@angular/common';
import { DynamicDialogConfig } from '../classes/dynamic-dialog-config';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(
    private readonly appRef: ApplicationRef,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  /**
   * Открыть диалог
   */
  public open(
    content: Type<any>,
    data?: DynamicDialogConfig
  ): DynamicDialogComponent {
    const dialogRef = createComponent(DynamicDialogComponent, {
      environmentInjector: this.appRef.injector,
      elementInjector: Injector.create({
        providers: [{ provide: DynamicDialogConfig, useValue: data }],
      }),
    });

    dialogRef.instance.childComponentType = content;

    this.appRef.attachView(dialogRef.hostView);
    const domElem = (dialogRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    this.document.body.appendChild(domElem);

    const destroySub = dialogRef.instance.onClose.subscribe(() => {
      this.removeDialog(dialogRef);
      destroySub.unsubscribe();
    });

    return dialogRef.instance;
  }

  /**
   * Удалить диалог из DOM
   */
  private removeDialog(dialogRef: ComponentRef<DynamicDialogComponent>): void {
    this.appRef.detachView(dialogRef.hostView);
    dialogRef.changeDetectorRef.detectChanges();
    dialogRef.destroy();
  }
}
