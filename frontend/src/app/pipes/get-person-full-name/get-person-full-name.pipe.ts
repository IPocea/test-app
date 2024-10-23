import { Pipe, PipeTransform } from '@angular/core';
import { IPerson } from '@interfaces';

@Pipe({
  name: 'getPersonFullName',
  standalone: true,
})
export class GetPersonFullNamePipe implements PipeTransform {
  transform(value: IPerson, ...args: unknown[]): string {
    return (value?.firstName || '') + ' ' + (value?.lastName || '');
  }
}
