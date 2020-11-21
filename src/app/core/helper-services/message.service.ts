import { Injectable } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MessageService {


  constructor(private toastr: ToastrService) {

  }

  success(msg: string, title?: string, config?: Partial<IndividualConfig> ) {
    this.toastr.success(msg, title, config);
  }

  info(msg: string, title?: string, config?: Partial<IndividualConfig> ) {
    this.toastr.info(msg, title, config);
  }

  error(msg: string, title?: string, config?: Partial<IndividualConfig> ) {
    this.toastr.error(msg, title, config);
  }

  warning(msg: string, title?: string, config?: Partial<IndividualConfig> ) {
    this.toastr.warning(msg, title, config);
  }
}
