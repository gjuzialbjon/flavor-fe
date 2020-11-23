import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: ` 
    <ngx-loading-bar [includeSpinner]="false" [height]="'4px'" [color]="'#107f72'"></ngx-loading-bar>
    <router-outlet></router-outlet> 
  `,
})
export class AppComponent {
  title = 'Bank';
}
