import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { Store } from 'src/app/core/models/store';
import { User } from 'src/app/core/models/user';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;

  private subscriptions = new Subscription()
  dtOptions: DataTables.Settings
  dtTrigger = new Subject<any>(); 
  modalConfig
  users: User[] = []
  stores: Store[] = [] // Only names and ID for setting privileges
  userForm!: FormGroup
  user!: any
  loading = false


  constructor(
    private userService: UserService,
    private configsService: ConfigsService,
    private chRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private msg: MessageService,
    private modalService: NgbModal,
    private authService: AuthenticationService
    ) {
      this.dtOptions = this.configsService.getDTOptions()
      this.dtOptions.columnDefs = [
        // @ts-ignore
        { responsivePriority: 100, targets: [0,3] },
      ]
      this.modalConfig = this.configsService.getCleanModalOptions()
  }

  ngOnInit(): void {
    this.getUsers()
    this.getStores()
  }

  openUpdate(content: TemplateRef<any>, user: User) {
    this.user = user
    this.initUserForm()
    this.modalService.open(content, this.modalConfig)
  }

  async saveUser(modal: NgbActiveModal) {
    if(this.userForm.invalid){
      this.userForm.markAllAsTouched()
      this.msg.error('Please complete the form to proceed')
      return
    }

    this.loading = true
    this.userService.updateUser(this.user._id, this.userForm.value).subscribe(
      (res: any) => {
        var updatedUser = res.data.userUpdateById.record
       
        this.user.name = updatedUser.name
        this.user.email = updatedUser.email
        this.user.role = updatedUser.role
        this.user.stores = updatedUser.stores
               
        this.rerender()
        modal.close()
      },
      e => {
        console.error(e)
        this.msg.error('Sorry, could not update user at the moment. Please try again later.', 'Error')
      },
      () => {
        this.loading = false
        this.chRef.detectChanges()
      }
    )
  }

  initUserForm() {
    this.loading = false
    this.userForm = this.fb.group({
      name: [this.user.name, [Validators.required]], 
      email: [this.user.email, [Validators.required]],
      role: [this.user.role, [Validators.required]],
      stores: [this.getStoreIds(this.user.stores), []]
    })
  }

  getUsers(){
   this.userService.getUsers().subscribe(
      (res: any) => {
        this.users = JSON.parse(JSON.stringify(res.data.userMany)) as User[]
      },
      e => { 
        this.msg.defaultError()
        console.error(e)
      },
      () => {
        this.dtTrigger.next()
        this.chRef.detectChanges()
      })
  }

  getStores() {
    this.userService.getStores().subscribe(
      (res: any) => {
        this.stores = res.data.storeMany as Store[]
        // console.log(this.stores)
      },
      e => { console.error(e)})
  }

  getStoreIds(stores: Store[]){
    let storeIds = []
    for (const store of stores) {
      storeIds.push(store._id)
    }
    return storeIds
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first 
        dtInstance.destroy();

        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
    });
    this.chRef.detectChanges()
  }


  get u() { return this.userForm.controls }  

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }
}
