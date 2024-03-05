import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { TableScroll } from '../interfaces/table-scroll.interface';

@Directive({ selector: '[tableScroll]', standalone: true })
export class TableScrollDirective implements OnInit {
  /**
   * Селекторы, от которых считать нужный размер
   */
  @Input() public tableScroll: TableScroll = {} as TableScroll;

  constructor(
    private readonly el: ElementRef<HTMLInputElement>,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  /**
   * Хук инициализации
   */
  public ngOnInit(): void {
    this.calcScrollHeight();
  }

  private calcScrollHeight() {
    const sibling = this.document.querySelector(this.tableScroll.sibling);
    const parent = this.document.querySelector(this.tableScroll.parent);

    this.el.nativeElement.style.maxHeight = `${
      (parent?.clientHeight ?? 0) - (sibling?.clientHeight ?? 0)
    }px`;
  }

  @HostListener('window:resize')
  public onResize() {
    this.calcScrollHeight();
  }
}
