import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
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
  private subscriptions = new Subscription()
  dtOptions: DataTables.Settings 
  modalConfig
  users: User[] = []
  stores: Store[] = [] // Only names and ID for setting privileges
  userForm!: FormGroup
  user!: User
  loading = false
  invitationLoading = false

  // INVITATION VARIABLES //
  emailFormControl: FormControl = new FormControl('', [Validators.required, Validators.email])
  roleFormControl: FormControl = new FormControl('', [Validators.required])

  constructor(
    private userService: UserService,
    private configsService: ConfigsService,
    private chRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private msg: MessageService,
    private modalService: NgbModal,
    private authService: AuthenticationService
    ) {
      this.dtOptions = this.configsService.getUserDTOptions()
      this.modalConfig = this.configsService.getCleanModalOptions()
  }

  ngOnInit(): void {
    this.getUsers()
    this.getStores()
  }

  openUpdate(content: TemplateRef<any>, user: User) {
    console.log(user)
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

    console.log(this.userForm.value);

    this.loading = true
    this.userService.updateUser(this.user._id, this.userForm.value).subscribe(
      (res: any) => {
        console.log(res)
        this.users = []
        this.chRef.detectChanges()
        this.getUsers()
        modal.close()
      },
      e => {
        console.error(e)
        this.msg.error('Sorry, could not update user at the moment. Please try again later.')
      },
      () => {
        this.loading = false
      }
    )
  }

  inviteUser(){
    if(this.emailFormControl.invalid && this.roleFormControl.invalid ){
      this.msg.error('Email and role are both required')
      return
    } else if(this.emailFormControl.invalid){
      this.msg.error('Email format is invalid')
      return
    } else if(this.roleFormControl.invalid){
      this.msg.error('Role is invalid')
      return
    }

    this.invitationLoading = true
    console.log('Invite user ', this.emailFormControl.value, this.roleFormControl.value)

    setTimeout( () => {
      this.emailFormControl.setValue('')
      this.roleFormControl.setValue('')
      this.msg.success('Invitation sent successfully!')
      this.invitationLoading = false
      this.chRef.detectChanges()
    },1200)
  }

  initUserForm() {
    this.userForm = this.fb.group({
      name: [this.user.name, [Validators.required]],
      email: [this.user.email, [Validators.required]],
      confirmed: [ this.user.confirmed, []],
      invited: [ this.user.invited, []],
      stores: [this.getStoreIds(this.user.stores), []]
    })
  }

  getUsers(){
    this.subscriptions.add(this.userService.getUsers().subscribe(
      (res: any) => {
        this.users = res.data.userMany as User[]
        // console.log(this.users)
        this.chRef.detectChanges()
      },
      e => { 
        console.error(e)
        this.chRef.detectChanges()
      }))
  }

  getStores() {
    this.subscriptions.add(this.userService.getStores().subscribe(
      (res: any) => {
        this.stores = res.data.storeMany as Store[]
        // console.log(this.stores)
      },
      e => { console.error(e)}))
  }

  getStoreIds(stores: Store[]){
    let storeIds = []
    for (const store of stores) {
      storeIds.push(store._id)
    }
    return storeIds
  }

  get u() { return this.userForm.controls }  

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }
}
