export type UiPosition = 'auto' | 'top' | 'right' | 'bottom' | 'left';
export type UiSize = 'small' | 'medium';
export type UiShape = 'square' | 'pill' | 'circle';
export type UiColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent';
export type UiExtendedColors = UiColor | 'green' | 'red' | 'yellow';

export type UiPositionMap = {
  [key in UiPosition]: string[];
};

export type UiSizeMap = {
  [key in UiSize]: string[];
};

export type UiShapeMap = {
  [key in UiShape]: string[];
};

export type UiColorsMap = {
  [key in UiColor]: string[];
};

export type UiExtendedColorsMap = {
  [key in UiExtendedColors]: string[];
};
