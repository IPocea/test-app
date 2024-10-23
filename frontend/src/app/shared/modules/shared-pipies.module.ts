import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GetCarBrandModelNamePipe, GetPersonFullNamePipe } from '@pipes';

// when creating pipes, add it at import and export and then you can import shared pipes module

@NgModule({
  declarations: [],
  imports: [CommonModule, GetPersonFullNamePipe, GetCarBrandModelNamePipe],
  exports: [GetPersonFullNamePipe, GetCarBrandModelNamePipe],
})
export class SharedPipesModule {}
