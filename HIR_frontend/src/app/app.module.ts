import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { LOCALE_ID, NgModule } from '@angular/core';

registerLocaleData(localeHu);

@NgModule({
  providers: [{ provide: LOCALE_ID, useValue: 'hu' }],
})
export class AppModule {}
