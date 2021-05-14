import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	OnDestroy,
	ChangeDetectorRef,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { Store } from 'src/app/core/models/store';
import { User } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/user.service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit, OnDestroy {
	@ViewChild(DataTableDirective) dtElement!: DataTableDirective;
	dtOptions: DataTables.Settings;
	dtTrigger = new Subject<any>();
	users: User[] = [];
	stores: Store[] = []; // Only names and ID for setting privileges
	userForm!: FormGroup;
	newUserForm!: FormGroup;
	user!: any;
	loading = false;
	loadingUsers = true;

	resettingPassword = false;
	newPassFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
	newPassRFormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);

	constructor(
		private userService: UserService,
		private configsService: ConfigsService,
		private chRef: ChangeDetectorRef,
		private fb: FormBuilder,
		private msg: MessageService,
		private dialogService: NbDialogService
	) {
		this.dtOptions = this.configsService.getDTOptions();
		this.dtOptions.columnDefs = [
			// @ts-ignore
			{ responsivePriority: 100, targets: [0, 3] },
		];
	}

	ngOnInit(): void {
		this.getUsers();
		this.getStores();
	}

	openUpdate(content: TemplateRef<any>, user: User) {
		this.user = user;
		this.resettingPassword = false;
		this.initUserForm();
		this.dialogService.open(content);
	}

	openNewUserDialog(content: TemplateRef<any>) {
		this.initNewUserForm();
		this.dialogService.open(content);
	}

	resetPassword() {
		if (this.newPassFormControl.invalid) {
			this.msg.error('Please insert a valid password with a minimum length of 6.', 'Error');
			return;
		}

		this.userService.resetPasswordByAdmin(this.user._id, this.newPassFormControl.value).subscribe(
			(res: any) => {
				if (res.data.resetPasswordAdmin.message === 'Done') {
					this.msg.success('Password updated', 'Success!');
					this.newPassFormControl.setValue('');
					this.newPassRFormControl.setValue('');
					this.resettingPassword = false;
					this.chRef.detectChanges();
				} else {
					console.error('Maybe password was not updated');
				}
			},
			(e) => {
				console.error(e);
				this.msg.error('Could not reset password for this user.', 'Error!');
			}
		);
	}

	saveUser(dialog: any) {
		if (this.userForm.invalid) {
			this.userForm.markAllAsTouched();
			this.msg.error('Please complete the form to proceed', 'Error!');
			return;
		}

		this.loading = true;
		this.userService.updateUser(this.user._id, this.userForm.value).subscribe(
			(res: any) => {
				var updatedUser = res.data.userUpdateById.record;

				this.user.name = updatedUser.name;
				this.user.email = updatedUser.email;
				this.user.role = updatedUser.role;
				this.user.rstores = updatedUser.rstores;
				this.user.confirmed = updatedUser.confirmed;
				this.user.telegram = updatedUser.telegram;

				this.rerender();
				dialog.close();
			},
			(e) => {
				console.error(e);
				this.msg.error('Sorry, could not update user at the moment. Please try again later.', 'Error');
			},
			() => {
				this.loading = false;
				this.chRef.detectChanges();
			}
		);
	}

	createUser(dialog: any) {
		if (this.newUserForm.invalid) {
			this.newUserForm.markAllAsTouched();
			this.msg.error('Please complete the form to proceed', 'Error!');
			return;
		}

		this.loading = true;
		this.userService.registerUser(this.newUserForm.value).subscribe(
			(res: any) => {
				if (!!res.data.registerUser.message.user) {
					this.rerender(res.data.registerUser.message.user);
					dialog.close();
				}
			},
			(e) => {
				console.error(e);
				this.msg.defaultError();
			},
			() => {
				this.loading = false;
				this.chRef.detectChanges();
			}
		);
	}

	initUserForm() {
		this.loading = false;
		this.userForm = this.fb.group({
			name: [this.user.name, [Validators.required]],
			email: [this.user.email, [Validators.required, Validators.email]],
			role: [this.user.role, [Validators.required]],
			rstores: [this.getStoreIds(this.user.rstores), []],
			confirmed: [this.user.confirmed],
			telegramId: [this.user.telegram && this.user.telegram.id, [Validators.pattern(/[0-9]+/)]],
			telegramName: [!!this.user.telegram && !!this.user.telegram.name ? this.user.telegram.name : ''],
		});
	}

	initNewUserForm() {
		this.loading = false;
		this.newUserForm = this.fb.group({
			name: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			role: ['', [Validators.required]],
			password: ['', [Validators.required, Validators.minLength(6)]],
		});
	}

	getUsers() {
		this.userService.getUsers().subscribe(
			(res: any) => {
				this.users = JSON.parse(JSON.stringify(res.data.userMany)) as User[];
				this.loadingUsers = false;
			},
			(e) => {
				this.msg.defaultError();
				console.error(e);
				this.loadingUsers = false;
			},
			() => {
				this.dtTrigger.next();
				this.chRef.detectChanges();
			}
		);
	}

	getStores() {
		this.userService.getStores().subscribe(
			(res: any) => {
				this.stores = res.data.storeMany as Store[];
			},
			(e) => {
				console.error(e);
			}
		);
	}

	getStoreIds(stores: Store[]) {
		let storeIds = [];
		for (const store of stores) {
			storeIds.push(store._id);
		}
		return storeIds;
	}

	rerender(newUser?: User): void {
		this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
			// Destroy the table first
			dtInstance.destroy();

			if (newUser) {
				this.users = [newUser, ...this.users];
				console.log(this.users);
				this.chRef.detectChanges();
			}

			// Call the dtTrigger to rerender again
			this.dtTrigger.next();
		});
		this.chRef.detectChanges();
	}

	resetPasswordFormControls() {
		this.newPassFormControl.setValue('');
		this.newPassRFormControl.setValue('');
		this.newPassFormControl.markAsUntouched();
		this.newPassRFormControl.markAsUntouched();
		this.chRef.detectChanges();
	}

	get u() {
		return this.userForm.controls;
	}
	get n() {
		return this.newUserForm.controls;
	}

	ngOnDestroy() {
		this.dtTrigger.unsubscribe();
		this.chRef.detach();
	}
}
