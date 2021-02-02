import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings;
  dtTrigger = new Subject<any>();

  clients: Client[] = [];
  favoriteClients: string[] = [];

  newClientForm!: FormGroup;
  loading = true; // WHILE CREATING NEW CLIENT/ LOADING CLIENTS

  constructor(
    private clientsService: ClientsService,
    private configsService: ConfigsService,
    private chRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private msg: MessageService,
    private dialogService: NbDialogService
  ) {
    this.dtOptions = this.configsService.getDTOptions();
    this.dtOptions.columnDefs = [
      // @ts-ignore
      { responsivePriority: 100, targets: [1, 5] },
    ];
  }

  ngOnInit(): void {
    this.getClients();
    this.getFavoriteClients();
  }

  openNewClientDialog(content: TemplateRef<any>) {
    this.initNewClientForm();
    this.dialogService.open(content);
  }

  initNewClientForm() {
    this.newClientForm = this.fb.group({
      name: ['', [Validators.required]],
      surname: ['', []],
      location: ['', []],
      description: ['', []],
    });
  }

  createClient(dialog: any) {
    if (this.newClientForm.invalid) {
      this.msg.error('Form invalid, cannot create client', 'Error');
      return;
    }

    this.loading = true;
    this.clientsService.createClient(this.newClientForm.value).subscribe(
      (res: any) => {
        this.loading = false;
        this.rerender(res.data.createClient);
        dialog.close();
      },
      (e) => {
        console.error(e);
        this.loading = false;
        this.msg.error('Could not create client', 'Error!');
      }
    );
  }

  getClients() {
    this.clientsService.getClients().subscribe(
      (res: any) => {
        this.clients = JSON.parse(
          JSON.stringify(res.data.clientMany)
        ) as Client[];
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

  getFavoriteClients() {
    this.clientsService.getFavoriteClients().subscribe(
      (res: any) => {
        let favs = res.data.Me.favorites as Client[];
        if (!!favs) {
          for (const fav of favs) {
            this.favoriteClients.push(fav._id);
          }
        }
      },
      (e) => {
        console.error(e);
        this.msg.defaultError();
      },
      () => {
        this.dtTrigger.next();
        this.chRef.detectChanges();
      }
    );
  }

  toggleFavorite(client: Client) {
    this.clientsService.toggleFavorite(client._id).subscribe(
      (res: any) => {
        let favs = res.data.updateFavorite.favorites;
        console.log(favs);
        this.favoriteClients = [];
        for (const fav of favs) {
          this.favoriteClients.push(fav._id);
        }
        this.rerender();
      },
      (e) => {
        console.error(e);
        this.msg.error('Could toggle this client from favorites', 'Error!');
      }
    );
  }

  isFavorite(clientId: string) {
    return this.favoriteClients.includes(clientId);
  }

  rerender(client?: Client): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();

      if (client) {
        this.clients = [...this.clients, client];
        this.chRef.detectChanges();
      }

      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
    this.chRef.detectChanges();
  }

  get n() {
    return this.newClientForm.controls;
  }

  ngOnDestroy() {
    this.chRef.detach();
  }
}
