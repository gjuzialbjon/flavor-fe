import { Injectable } from '@angular/core';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

const posRanges = [
  { divider: 1000000 , suffix: 'M' },
  { divider: 1000 , suffix: 'k' }
];

const negRanges = [
  { divider: -1000000 , suffix: 'M' },
  { divider: -1000 , suffix: 'k' }
];

@Injectable({
  providedIn: 'root'
})
export class ConfigsService {

  constructor() { }

  getCountUpOptions() {
    return {
      formattingFn: (n:number) => {
        if(n > 0){
          for (var i = 0; i < posRanges.length; i++) {
            if (n >= posRanges[i].divider) {
                return (n / posRanges[i].divider).toFixed(1) + posRanges[i].suffix;
            }
          }
          return n.toString();
        } else {
          for (var i = 0; i < negRanges.length; i++) {
            if (n <= negRanges[i].divider) {
                return '-' + (n / negRanges[i].divider).toFixed(1) + negRanges[i].suffix;
            }
          }
          return n.toString();
        }
      },
    }
  }

  getCleanModalOptions(size = 'md') {
    return {
      centered: true,
      size: size,
      windowClass: 'clean-modal'
    }
  }

}
