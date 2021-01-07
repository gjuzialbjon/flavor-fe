import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { User } from '../models/user';

const userMany = gql `
{
  userMany{
    _id
    email
    name
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

  getUsers() {
    return this.apollo.query(
      {
        query: userMany,
      }
    )
  }

  getStores() {
    return this.apollo.query(
      {
        query: storeMany,
        fetchPolicy:"cache-first"
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
            role:${user.role}
            stores:${JSON.stringify(user.stores)}
          }){
            record{
              email
              name
              role
              stores{
                _id
              }
            }
        }
      }
      `
    })
  }
}
