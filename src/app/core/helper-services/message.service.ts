import { Injectable } from '@angular/core';
import { NbToastrConfig, NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class MessageService {


  constructor(private toastr: NbToastrService) {
  }

  success(msg: string, title?: string, config?: Partial<NbToastrConfig> ) {
    this.toastr.success(msg, title, config);
  }

  info(msg: string, title?: string, config?: Partial<NbToastrConfig> ) {
    this.toastr.info(msg, title, config);
  }

  error(msg: string, title?: string, config?: Partial<NbToastrConfig> ) {
    this.toastr.danger(msg, title, config);
  }

  warning(msg: string, title?: string, config?: Partial<NbToastrConfig> ) {
    this.toastr.warning(msg, title, config);
  }

  defaultError(){
    this.toastr.danger('Sorry, something went wrong. Please try again later or contact support.', 'Error');
  }
}
