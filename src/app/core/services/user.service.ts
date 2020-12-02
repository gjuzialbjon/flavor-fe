import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const userMany = gql `
  query{
    userMany{
      name
    }
  }
  `

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apollo: Apollo) { }

  get Users() {
    return this.apollo.query(
      {
        query: userMany
      }
    )
  }
}
