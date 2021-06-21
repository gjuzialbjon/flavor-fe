import {
	Component,
	OnInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	TemplateRef,
	ViewChild,
	Output,
	EventEmitter,
} from '@angular/core';
import { Transaction } from 'src/app/core/models/transaction';
import * as moment from 'moment'; // add this 1 of 4
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/core/models/post';
import { Store } from 'src/app/core/models/store';
import { Client } from 'src/app/core/models/client';
import { ThisReceiver } from '@angular/compiler';
import { environment } from '@env';

@Component({
	selector: 'app-transactions-table',
	templateUrl: './transactions-table.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsTableComponent implements OnInit {
	@ViewChild(DataTableDirective) transactionsTable!: DataTableDirective;

	@Output() onTransactionUpdate: EventEmitter<any> = new EventEmitter<any>();

	dtOptions;
	dialogDtOptions;
	dtTrigger = new Subject<any>();
	dtTriggerPosts = new Subject<any>();

	storeFormControl = new FormControl('all');
	typeFormControl = new FormControl('all');
	periodFormControl = new FormControl(null);

	transactions: Transaction[] = [];
	tableTransactions: Transaction[] = [];
	transaction!: Transaction;
	post!: Post;

	stores: any[] = [];
	clients: Client[] = [];
	entities: any[] = [];

	isAdminOrAgent = false;
	isAdmin = false;
	isInStore = false;
	isInClient = false;
	storeId;
	clientId;

	loadingTransactions = true;

	transactionType = 'transfer';
	transactionTypes: any[] = [];
	commentFormControl = new FormControl('', [Validators.required]);

	hasFilters = false;
	typeFilter = 'all';
	storeFilter = 'all';
	periodFilter = null;

	editingTransactionDetails = false;
	postForm!: FormGroup;
	repaymentForm!: FormGroup;

	constructor(
		private configsService: ConfigsService,
		private chRef: ChangeDetectorRef,
		private fb: FormBuilder,
		private dialogService: NbDialogService,
		private transactionsService: TransactionsService,
		private msg: MessageService,
		private authService: AuthenticationService,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.transactionTypes = this.configsService.getTransactionTypes();
		this.dtOptions = this.configsService.getTransactionDTOptions();
		this.dtOptions.dom =
			"<'row'<'col-sm-12 col-md-6'B><'col-sm-12 col-md-6'f>>" +
			"<'row'<'col-sm-12'tr>>" +
			"<'row'<'col-sm-12 col-md-5'l><'col-sm-12 col-md-7'p>>";

		this.dtOptions.order = [
			[0, 'asc'],
			[1, 'desc'],
		];
		this.dialogDtOptions = this.configsService.getDTOptions();
		let routes = this.router.url.split('/');
		this.isInClient = routes.includes('clients');
		this.isInStore = routes.includes('stores');
		this.storeId = this.route.snapshot.params.storeId;
		this.clientId = this.route.snapshot.params.clientId;
	}

	async ngOnInit() {
		this.isAdminOrAgent = this.authService.user.role === 'admin' || this.authService.user.role === 'agent';
		this.isAdmin = this.authService.user.role === 'admin';

		this.getTransactions();
		this.stores = await this.transactionsService.getStores();
		this.clients = await this.transactionsService.getClients();
		this.entities = [...this.stores, ...this.clients];
	}

	openRepayment(transaction: Transaction, content: any) {
		this.repaymentForm = this.fb.group({
			amount: ['', [Validators.required]],
			date: [new Date().toISOString(), [Validators.required]],
			details: ['', [Validators.required]],
			entity: [null, [Validators.required]],
			transaction: [this.transaction._id],
		});

		this.dialogService.open(content, { autoFocus: false });
	}

	getTransactions() {
		this.transactionsService.getTransactions(this.storeId, this.clientId).subscribe(
			(res: any) => {
				// console.log(res);
				this.transactions = JSON.parse(JSON.stringify(res.data.myTransactions)) as Transaction[];

				if (this.storeId) {
					this.transactions = this.transactions.filter((t) => t.store?._id === this.storeId || t.toStore?._id === this.storeId);
				}

				if (this.clientId) {
					this.transactions = this.transactions.filter((t) => t.client?._id === this.clientId);
				}

				this.tableTransactions = JSON.parse(JSON.stringify(this.transactions));
				this.loadingTransactions = false;
				this.dtTrigger.next();
				this.chRef.detectChanges();
			},
			(e) => {
				console.error(e);
				this.msg.defaultError();
			}
		);
	}

	updateTransactions() {
		this.loadingTransactions = true;
		this.chRef.detectChanges();
		this.transactionsService.getTransactions(this.storeId, this.clientId).subscribe(
			(res: any) => {
				this.transactionsTable.dtInstance.then((dtInstance: DataTables.Api) => {
					// Destroy the table first
					dtInstance.destroy();

					this.transactions = JSON.parse(JSON.stringify(res.data.myTransactions)) as Transaction[];

					if (this.storeId) {
						this.transactions = this.transactions.filter((t) => t.store?._id === this.storeId || t.toStore?._id === this.storeId);
					}

					if (this.clientId) {
						this.transactions = this.transactions.filter((t) => t.client?._id === this.clientId);
					}

					this.tableTransactions = JSON.parse(JSON.stringify(this.transactions));
					this.loadingTransactions = false;
					this.tableTransactions = JSON.parse(JSON.stringify(this.transactions));
					this.chRef.detectChanges();

					// Call the dtTrigger to rerender again
					this.dtTrigger.next();
				});
				this.loadingTransactions = false;
				this.chRef.detectChanges();
				this.onTransactionUpdate.next();
			},
			(e) => {
				this.loadingTransactions = false;
				console.error(e);
				this.msg.defaultError();
			}
		);
	}

	markApproved(transaction: Transaction) {
		this.transactionsService.completeTransaction(transaction._id).subscribe(
			(res: any) => {
				// console.log(res);
				if (res.data.closeTransaction) {
					this.msg.success('Transaction approved successfully', 'Success!');
					this.updateTransactions();
				}
			},
			(e) => {
				console.error(e);
				this.msg.error('Could not approve transaction', 'Error!');
			}
		);
	}

	markApprovedPlusPaid(transaction: Transaction) {
		// console.log(transaction)
		if (!!transaction.toStore) {
			if (!!transaction.client) {
				if (transaction.status === 'Open' || transaction.status === 'Closed') {
					let newWithdraw = {
						storeId: transaction.toStore._id,
						date: new Date().toISOString(),
						description: 'Crypto withdraw',
						amount: transaction.amount_in,
						clientId: transaction.client._id,
					};

					this.transactionsService.makeWithdraw(newWithdraw).subscribe(
						(res: any) => {
							if (res.data.makeWithdrawFromClient) {
								this.msg.success('Withdraw created successfully', 'Success!');
								this.transactionsService.withdrawTransaction(transaction._id).subscribe((res: any) => {
									if (res.data.withdrawTransaction) {
										this.msg.success('Status updated successfully', 'Success!');
										this.updateTransactions();
									} else {
										console.error('Could not make withdraw')
									}
								});
							}
						},
						(e) => {
							console.error(e);
							this.msg.error('Could not approve transaction', 'Error!');
						}
					);
				}
			} else {
				console.error('No client selected for this transfer');
			}
		} else {
			console.error('No store selected for this transfer');
		}
	}

	openEditTransaction(content: TemplateRef<any>, transaction: Transaction) {
		if (transaction.store._id === environment.btc_store_id) return;

		this.transaction = transaction;
		this.commentFormControl.setValue('');
		// console.log(transaction);
		this.dialogService.open(content);
	}

	openEditPost(content: TemplateRef<any>, post: Post) {
		this.post = post;
		this.postForm = this.fb.group({
			amount: [post.ammount, [Validators.required]],
			date: [post.date, [Validators.required]],
			details: [post.details, [Validators.required]],
		});
		this.dialogService.open(content, { autoFocus: false });
	}

	editTransactionDetails() {
		if (this.authService.user.role !== 'admin') {
			return;
		}

		this.editingTransactionDetails = true;
		this.chRef.detectChanges();
	}

	updateMovement(dialog: any) {
		if (this.postForm.invalid) {
			this.msg.error('Invalid inputs for movement', 'Error!');
			return;
		}

		this.transactionsService.updatePost(this.post._id, this.postForm.value).subscribe(
			(res: any) => {
				console.log(res);
				let newPost = res.data.postUpdateById.record;
				this.post.ammount = newPost.ammount;
				this.post.date = newPost.date;
				this.post.details = newPost.details;
				dialog.close();
				this.msg.success('Movement updated successfully', 'Success');
				this.updateTransactions();
				this.onTransactionUpdate.next();
			},
			(e) => {
				console.error(e);
				this.msg.error('Could not update movement', 'Error!');
			}
		);
	}

	addRepayment(ref: any) {
		console.log(this.repaymentForm.value);

		if (this.repaymentForm.invalid) {
			this.msg.error('Invalid inputs, cannot add repayment', 'Error!');
			this.repaymentForm.markAllAsTouched();
			return;
		}

		this.transactionsService.makeRepayment(this.repaymentForm.value).subscribe(
			(res: any) => {
				console.log(res);
				this.msg.success('Movement updated successfully', 'Success');
				this.updateTransactions();
				this.onTransactionUpdate.next();
			},
			(e) => {
				console.error(e);
			}
		);
	}

	isIncluded(t: Transaction) {
		let typePass = false;
		let storePass = false;
		let periodPass = false;

		if (this.storeFilter === 'all') {
			storePass = true;
		} else {
			storePass = t.store && t.store._id === this.storeFilter;
		}
		if (this.typeFilter === 'all') {
			typePass = true;
		} else {
			typePass = t.type === this.typeFilter;
		}
		if (!this.periodFilter) {
			periodPass = true;
		} else {
			//@ts-ignore
			const startDate = this.periodFilter.start || moment('1900-01-01');
			//@ts-ignore
			const endDate = this.periodFilter.end || moment.now();

			if (moment(t.createdAt).isBetween(moment(startDate), moment(endDate).add(1, 'd'))) {
				periodPass = true;
			} else {
				periodPass = false;
			}
		}

		if (typePass && storePass && periodPass) {
			return true;
		} else {
			return false;
		}
	}

	changedFilters() {
		this.typeFilter = this.typeFormControl.value;
		this.storeFilter = this.storeFormControl.value;
		this.periodFilter = this.periodFormControl.value;
		this.hasFilters = true;
		let filtered = [];
		for (const transaction of this.transactions) {
			if (this.isIncluded(transaction)) {
				filtered.push(transaction);
			}
		}
		this.rerenderFilteredTransactions(filtered);
	}

	addComment(issue: string) {
		if (this.commentFormControl.invalid) {
			this.msg.warning('Enter a comment before', 'Error');
			return;
		}

		this.transactionsService.addComment(this.transaction._id, this.commentFormControl.value, issue).subscribe(
			(res: any) => {
				console.log(res);
				this.transaction.comments.push(res.data.commentCreateOne.record);
				this.commentFormControl.setValue('');
				this.updateTransactions()
			},
			(e) => {
				console.error(e);
				this.msg.error('Sorry, we could not add your comment', 'Error');
			}
		);
	}

	make(transactionType: string) {
		this.transactionType = transactionType;
		this.chRef.detectChanges();
	}

	completeTransaction(transactionId: string, dialog: any) {
		this.transactionsService.completeTransaction(transactionId).subscribe(
			(res: any) => {
				console.log(res);
				dialog.close();
				this.updateTransactions();
			},
			(e) => {
				console.error(e);
			}
		);
	}

	rerenderTransactions(transaction?: Transaction): void {
		this.onTransactionUpdate.next();
		this.transactionsTable.dtInstance.then((dtInstance: DataTables.Api) => {
			// Destroy the table first
			dtInstance.destroy();

			if (transaction) {
				this.transactions.push(transaction);
				this.resetFilters(false);
				this.loadingTransactions = false;
			}

			this.tableTransactions = JSON.parse(JSON.stringify(this.transactions));
			this.chRef.detectChanges();

			// Call the dtTrigger to rerender again
			this.dtTrigger.next();
		});
		this.chRef.detectChanges();
	}

	rerenderFilteredTransactions(transactions: Transaction[]): void {
		this.transactionsTable.dtInstance.then((dtInstance: DataTables.Api) => {
			// Destroy the table first
			dtInstance.destroy();

			this.tableTransactions = JSON.parse(JSON.stringify(transactions));
			this.chRef.detectChanges();

			// Call the dtTrigger to rerender again
			this.dtTrigger.next();
		});
		this.chRef.detectChanges();
	}

	resetFilters(reset: boolean) {
		this.storeFormControl.setValue('all');
		this.typeFormControl.setValue('all');
		this.periodFormControl.setValue(null);
		this.hasFilters = false;

		if (reset) {
			this.rerenderFilteredTransactions(this.transactions);
		}
	}

	toggleFlag(transaction: Transaction) {
		console.log(transaction)
		this.transaction = transaction

		if(transaction.issue) {
			this.transactionsService.unflagTransaction(transaction._id).subscribe((res:any) => {
				this.updateTransactions()
			}, e => {
				console.error('Could not unflag transaction')
				this.msg.error('Could not unflag transaction', 'Error!')
			})
		} else {
			this.commentFormControl.setValue('Issue')
			this.addComment('Open')
		}

	}


	get p() {
		return this.postForm.controls;
	}

	get r() {
		return this.repaymentForm.controls;
	}

	trackByFunction(index: number, item: Transaction) {
		return item._id;
	}

	ngOnDestroy() {
		this.chRef.detach();
	}
}
