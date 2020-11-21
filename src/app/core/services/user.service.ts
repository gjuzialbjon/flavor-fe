import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apollo: Apollo) { }

  get Users() {
    return this.apollo.watchQuery(
      {
        query: gql `
          query{
            userMany{
              name
            }
          }
        `
      }
    ).valueChanges
  }
}
