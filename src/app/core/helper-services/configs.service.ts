import { Injectable } from '@angular/core';

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

  getUserDTOptions(): DataTables.Settings {
    return {
      pagingType: 'full',
      pageLength: 10,
      processing: true,
      responsive: true,
      // dom:'l<"toolbar">frtip',
      columnDefs: [
        // @ts-ignore
        { responsivePriority: 100, targets: [0,5] },
      ]
    }
  }

  getTransactionDTOptions(): DataTables.Settings {
    return {
      pagingType: 'full',
      pageLength: 10,
      processing: true,
      responsive: true,
      columnDefs: [
        // @ts-ignore
        { responsivePriority: 100, targets: [0,5] },
        // { orderable: false, targets: [5] },
      ]
    }
  }

  getCurrencyDTOptions(): DataTables.Settings {
    return {
      pagingType: 'full',
      pageLength: 10,
      processing: true,
      responsive: true,
      // dom:'l<"toolbar">frtip',
      columnDefs: [
        // @ts-ignore
        { responsivePriority: 100, targets: [0,4] },
      ]
    }
  }
}
