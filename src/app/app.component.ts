import { Component } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'app-root',
  template: ` 
    <ngx-loading-bar [includeSpinner]="false" [height]="'7px'" color="linear-gradient(to right,#3BAAC6,#21C5AD)"></ngx-loading-bar>
    <nb-layout>
      <nb-layout-column style="padding: 0;">
        <router-outlet></router-outlet>
      </nb-layout-column>
    </nb-layout>
  `,
})
export class AppComponent {
  title = 'Bank';

  constructor(private iconLibraries: NbIconLibraries){
    this.iconLibraries.registerFontPack('solid', { packClass: 'fas', iconClassPrefix: 'fa'} );
    this.iconLibraries.setDefaultPack('solid'); // <---- set as default

    this.iconLibraries.registerFontPack('menu', { iconClassPrefix: 'icon'})
    
  }
}
