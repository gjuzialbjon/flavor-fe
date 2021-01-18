import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const clientMany = gql`
{
  clientMany{
    _id
    name
    surname
    location
    description
    createdAt
    isVendor
    vendorType
  }
}
`

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private apollo: Apollo) { }

  getClients() {
    return this.apollo.query(
      {
        query: clientMany
      },
    )
  }
}
