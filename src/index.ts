import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SheetComponent } from './sheet.component'

export * from './sheet.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SheetComponent,
  ],
  exports: [
    SheetComponent,
  ]
})
export class SheetModule {
}
