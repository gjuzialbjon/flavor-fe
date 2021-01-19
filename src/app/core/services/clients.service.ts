import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

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
      accounts {
        type
        name
        description
      }
    }
  }
`;

const transactionMany = gql`
  query($clientId: MongoID!) {
    transactionMany(filter: { client: $clientId }) {
      type
      createdAt
      status
      comments {
        _id
        comment
        issue
        createdAt
        user {
          name
        }
      }
      direction
      description
      user {
        name
      }
      posts {
        date
        type
        details
        ammount
        fee
        currency {
          symbol
        }
        user {
          name
        }
      }
      currency {
        symbol
      }
      store {
        name
      }
      _id
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

  getClientById(clientId: string) {
    return this.apollo.query({
      query: clientOne,
      variables: {
        _id: clientId,
      },
      fetchPolicy: 'network-only',
    });
  }

  getClientTransactions(clientId: string) {
    return this.apollo.query({
      query: transactionMany,
      variables: {
        clientId: clientId,
      },
      fetchPolicy: 'network-only',
    });
  }
}
