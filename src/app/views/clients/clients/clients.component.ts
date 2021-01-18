import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ConfigsService } from 'src/app/core/helper-services/configs.service';
import { MessageService } from 'src/app/core/helper-services/message.service';
import { Client } from 'src/app/core/models/client';
import { ClientsService } from 'src/app/core/services/clients.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings
  dtTrigger = new Subject<any>(); 

  clients: Client[] = []

  newClientForm!: FormGroup;
  loading = true // WHILE CREATING NEW CLIENT/ LOADING CLIENTS

  constructor(
    private clientsService: ClientsService,
    private configsService: ConfigsService,
    private chRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private msg: MessageService,
    private dialogService: NbDialogService,
    ) {
      this.dtOptions = this.configsService.getDTOptions()
      this.dtOptions.columnDefs = [
        // @ts-ignore
        { responsivePriority: 100, targets: [1,5] },
      ]
  }

  ngOnInit(): void {
    this.getClients()
  }

  openNewClientDialog(content: TemplateRef<any>){
    this.initNewClientForm()
    this.dialogService.open(content)
  }

  initNewClientForm(){
    this.newClientForm = this.fb.group({
      name: ['', [Validators.required]], 
      surname: ['', []],
      location: ['', []],
      description: ['', []],
    })
  }

  createClient(dialog: any){

  }

  getClients(){
    this.clientsService.getClients().subscribe(
      (res:any) => {
        this.clients = JSON.parse(JSON.stringify(res.data.clientMany))  as Client[]
        console.log(this.clients)
      },
      e => {
        console.error(e)
        this.msg.defaultError()
      },
      () => {
        this.loading = false
        this.dtTrigger.next()
        this.chRef.detectChanges()
      }
    )
  }

  toggleFavorite(client: Client){
    if(client.favorite){
      client.favorite = false
    } else {
      client.favorite = true
    }
  }

  get n() { return this.newClientForm.controls}

  ngOnDestroy(){
    this.chRef.detach()
  }
}

