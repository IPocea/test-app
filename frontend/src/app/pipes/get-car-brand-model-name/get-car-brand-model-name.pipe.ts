import { Pipe, PipeTransform } from '@angular/core';
import { ICar } from '@interfaces';

@Pipe({
  name: 'getCarBrandModelName',
  standalone: true,
})
export class GetCarBrandModelNamePipe implements PipeTransform {
  transform(value: ICar, ...args: unknown[]): string {
    return (value?.brand || '') + ' ' + (value?.model || '');
  }
}
