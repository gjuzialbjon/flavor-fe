import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const storeBase = gql `
{
  storeMany{
    _id
    name
  }
}`

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apollo: Apollo) { }

  getStoreBase(){
    return this.apollo.query({
      query: storeBase
    })
  }
}
