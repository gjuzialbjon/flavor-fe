import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, TemplateRef } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { Subscription } from 'rxjs'
import { ConfigsService } from 'src/app/core/helper-services/configs.service'
import { MessageService } from 'src/app/core/helper-services/message.service'
import { Store } from 'src/app/core/models/store'
import { StoreService } from 'src/app/core/services/store.service'

@Component({
	selector: 'app-store-card',
	templateUrl: './store-card.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreCardComponent implements OnInit {
	@Input() name: string = ''
	@Input() balance: number = 0
	@Input() profit: number = 0
	@Input() id: string = ''

	constructor(private router: Router) {}

	ngOnInit(): void {}
}
