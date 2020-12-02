import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  storeId: string
  loading = false // Prevent duplicate client creation
  newClientForm!: FormGroup

  hmm = [1,2,3]

  constructor(  
    private chRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private fb: FormBuilder) {
      this.storeId = this.route.snapshot.params.id
   }

  ngOnInit(): void {
    this.initNewClientForm()
  } 

  createClient(modal: NgbActiveModal){

  }

  initNewClientForm() {
    this.newClientForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      description: ['', []],
      location: ['', [Validators.required]],
    })
  }

  get n() { return this.newClientForm.controls }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
    this.chRef.detach()
  }
}
