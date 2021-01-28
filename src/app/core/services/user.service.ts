import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { User } from '../models/user';

const userMany = gql`
  {
    userMany {
      _id
      email
      name
      role
      confirmed
      telegram {
        id
        name
        _id
      }
      stores {
        _id
        name
      }
    }
  }
`;

const storeMany = gql`
  {
    storeMany {
      _id
      name
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apollo: Apollo) {}

  //QUERIES
  getUsers() {
    return this.apollo.query({
      query: userMany,
    });
  }

  getStores() {
    return this.apollo.query({
      query: storeMany,
      fetchPolicy: 'cache-first',
    });
  }

  //MUTATIONS
  updateUser(userId: string, user: User) {
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
            confirmed:${user.confirmed}
            telegram:{
              id:${user.telegramId}
              name:"${user.telegramName}"
            }
          }){
            record{
              email
              name
              role
              confirmed
              telegram{
                id
                name
              }
              stores{
                _id
              }
            }
        }
      }
      `,
    });
  }

  registerUser(user: User) {
    return this.apollo.mutate({
      mutation: gql`
      mutation{
        registerUser(
          email:"${user.email}"
          role:${user.role}
          name:"${user.name}"
          password:"${user.password}"
        ){
          message
        }
      }
      `,
    });
  }

  resetPasswordByAdmin(userId: string, newPassword: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation {
          resetPasswordAdmin(new: "${newPassword}", user: "${userId}") {
            message
          }
        }
      `,
    });
  }
}
