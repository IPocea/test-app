import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewContainerRef,
  inject,
} from '@angular/core';

type UiButtonSize = 'small' | 'medium' | 'large';
type UiButtonColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'text'
  | 'danger'
  | 'accent'
  | 'neutral'
  | 'transparent'
  | 'white'
  | 'white-with-borders'
  | 'success-100';
type UiButtonExtendedColors = 'success' | 'yellow' | 'blue' | 'purple';
type UiButtonShape = 'rounded' | 'pill' | 'rightAngle';

@Directive({
  selector: '[uiButton]',
})
export class UiButtonDirective implements OnInit, OnDestroy {
  //#region Constants
  protected _elementRef = inject(ElementRef);
  protected _viewContainerRef = inject(ViewContainerRef);
  protected _ngZone = inject(NgZone);
  readonly SIZES: { [key in UiButtonSize]: string } = {
    small: 'h-8 text-sm px-2',
    medium: 'h-10 px-3',
    large: 'h-[50px] px-7 py-3',
  };
  readonly SHAPES: { [key in UiButtonShape]: string } = {
    pill: 'rounded-full',
    rounded: 'rounded-md',
    rightAngle: 'rounded-none',
  };

  readonly COLORS: { [key in UiButtonColor]: string } & {
    [key in UiButtonExtendedColors]: string;
  } & { disabled: string } = {
    default:
      'bg-white border text-gray-900 hover:border-primary hover:text-primary active:border-primary-700 active:text-primary-700',
    primary:
      'bg-primary text-white active:bg-primary-700 focus:outline-primary focus:outline-offset-2 focus:outline-2',
    secondary:
      'bg-secondary text-white border border-white focus:outline-white focus:outline-offset-2 focus:outline-2',
    tertiary: 'bg-tertiary text-secondary',
    text: 'bg-transparent text-gray-900 hover:bg-opacity-20 hover:bg-gray-300 active:bg-opacity-10 active:bg-gray-500',
    disabled: 'opacity-50 !cursor-not-allowed',
    danger: 'bg-red-500 text-white active:bg-red-700',
    success: 'bg-success text-white active:bg-success',
    'success-100': 'bg-success-100 text-secondary active:bg-success-100',
    yellow: 'bg-yellow-400 active:bg-yellow-600',
    blue: 'bg-blue-500 text-white active:bg-blue-700',
    accent: 'bg-accent active:bg-accent',
    purple: 'bg-purple text-white',
    neutral: 'bg-neutral-200 text-secondary',
    transparent: 'bg-transparent text-purple border border-transparent',
    white: 'bg-white text-secondary',
    'white-with-borders': 'bg-white text-primary border border-tertiary-200',
  };
  //#endregion

  //#region Control Variables
  @Input() color: UiButtonColor | UiButtonExtendedColors = 'default';
  @Input() shape: UiButtonShape = 'rounded';
  @Input() size: UiButtonSize = 'medium';
  @Input() loading: boolean = false;

  @HostBinding('class.pointer-events-none')
  @Input()
  disabled: boolean = false;
  //#endregion

  @HostBinding('class') get classes(): string {
    return `
    flex
    items-center
    justify-center
    font-medium
    gap-2
    transition-colors
    select-none
    ${
      this.disabled
        ? this.COLORS[this.color] + ' ' + this.COLORS.disabled
        : this.COLORS[this.color]
    }
    ${this.SIZES[this.size]}
    ${this.SHAPES[this.shape]}
    `;
  }

  constructor() {}

  ngOnInit(): void {
    this._ngZone.runOutsideAngular(() => {
      this._elementRef.nativeElement.addEventListener(
        'click',
        this._haltDisabledEvents
      );
    });
  }

  ngOnDestroy(): void {
    this._ngZone.runOutsideAngular(() => {
      this._elementRef.nativeElement.removeEventListener(
        'click',
        this._haltDisabledEvents
      );
    });
  }

  //#region Methods
  private _haltDisabledEvents = (event: Event): void => {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };
  //#endregion
}
