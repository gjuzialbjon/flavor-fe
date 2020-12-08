import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { User } from '../models/user';

const userMany = gql `
{
  userMany{
    _id
    email
    name
    confirmed
    invited
    role
    stores{
      _id
      name
    }
  }
}
`

const storeMany = gql `
{
  storeMany{
    _id
    name
  }
}
`

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apollo: Apollo) { }

  getUsers(fetchPolicy: 'cache-first' | 'network-only' = 'cache-first') {
    return this.apollo.query(
      {
        query: userMany,
        fetchPolicy: fetchPolicy
      }
    )
  }

  getStores() {
    return this.apollo.query(
      {
        query: storeMany,
      }
    )
  }

  updateUser(userId: string, user: User){
    return this.apollo.mutate({
      mutation: gql`
      mutation{
        userUpdateById(
          record:{
            _id:"${userId}"
            name:"${user.name}"
            email:"${user.email}"
            confirmed:${user.confirmed}
            invited:${user.invited}
            stores:${JSON.stringify(user.stores)}
          }){
          recordId
        }
      }

      `
    })
  }
}
