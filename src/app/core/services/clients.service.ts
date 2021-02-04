import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Client } from '../models/client';

const clientMany = gql`
  {
    clientMany {
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
`;

const clientOne = gql`
  query($_id: MongoID!) {
    clientById(_id: $_id) {
      name
      surname
      location
      description
      revenue
      balance
      isVendor
      vendorType
    }
  }
`;

const favoriteClients = gql`
  {
    Me {
      favorites {
        _id
        name
        surname
        balance
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  constructor(private apollo: Apollo) {}

  //  QUERIES
  getClients() {
    return this.apollo.query({
      query: clientMany,
    });
  }

  getFavoriteClients() {
    return this.apollo.query({
      query: favoriteClients,
    });
  }

  getClientById(clientId: string) {
    return this.apollo.query({
      query: clientOne,
      variables: {
        _id: clientId,
      },
      fetchPolicy: 'network-only',
    });
  }

  //  MUTATIONS
  toggleFavorite(clientId: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation {
          updateFavorite(clientId: "${clientId}") {
            _id
            favorites {
              _id
            }
          }
        }
      `,
    });
  }

  createClient(client: Client) {
    return this.apollo.mutate({
      mutation: gql`
        mutation {
          createClient(
            name: "${client.name}"
            surname: "${client.surname}"
            location: "${client.location}"
            description: "${client.description}"
          ) {
            _id
            name
            surname
            location
            createdAt
            description
          }
        }
      `,
    });
  }

  makeVendor(clientId: string, vendorType: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation {
          clientUpdateById(
            record: { _id: "${clientId}", isVendor: true, vendorType: "${vendorType}" }
          ) {
            record {
              isVendor
              vendorType
            }
          }
        }
      `,
    });
  }
}
