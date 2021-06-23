import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@env';
import { Apollo, gql } from 'apollo-angular';
import { MessageService } from '../helper-services/message.service';

const myData = gql`
	{
		Me {
			name
			email
			role
		}
	}
`;

const userMany = gql`
	{
		userMany {
			_id
			name
		}
	}
`;

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	jwtHelper: JwtHelperService;
	user: any;
	username!: string;

	constructor(private router: Router, private msg: MessageService, private apollo: Apollo, private http: HttpClient) {
		this.jwtHelper = new JwtHelperService();
		this.initUserFromToken();
	}

	initUserFromToken() {
		const token = localStorage.getItem('flavorToken');
		const fakeToken = localStorage.getItem('flavorFakeToken');

		if (!!fakeToken && fakeToken.length > 10) {
			this.user = this.jwtHelper.decodeToken(fakeToken);
		} else if (!!token && token.length > 10) {
			this.user = this.jwtHelper.decodeToken(token);
		} else {
			this.router.navigateByUrl('/auth/login');
		}
	}

	getMyData() {
		return this.apollo.query({
			query: myData,
		});
	}

	getUsersToImpersonate() {
		return this.apollo.query({
			query: userMany,
		});
	}

	isTokenExpired() {
		if (!!localStorage.getItem('flavorFakeToken')) {
			return this.jwtHelper.isTokenExpired(localStorage.getItem('flavorFakeToken') + '');
		} else if (!!localStorage.getItem('flavorToken')) {
			return this.jwtHelper.isTokenExpired(localStorage.getItem('flavorToken') + '');
		} else {
			return true;
		}
	}

	login(email: string, password: string) {
		return this.http.post(`https${environment.API_URL}login`, {
			email: `${email}`,
			password: `${password}`,
		});
	}

	resetPassword(newPassword: string) {
		return this.apollo.mutate({
			mutation: gql`
				mutation{
					resetPassword(
					new:"${newPassword}"
					){
					message
					}
				}
				`,
		});
	}

	forgotPassword(email: string) {
		return this.apollo.mutate({
			mutation: gql`
				mutation{
					forgotPassword(
					email:"${email}"
					){
					message
					}
				}
				`,
		});
	}

	resetForgotPassword(newPassword: string, token: string) {
		return this.apollo.mutate({
			mutation: gql`
				mutation{
					resetforgotPassword(
					new:"${newPassword}"
					token:"${token}"
					){
					message
					}
				}
				`,
		});
	}

	updateMyName(newName: string) {
		return this.apollo.mutate({
			mutation: gql`
				mutation {
					updateMyName(name: "${newName}") {
						name
					}
					}
				`,
		});
	}

	updateMyEmail(newEmail: string) {
		return this.apollo.mutate({
			mutation: gql`
				mutation {
				updateMyEmail(email: "${newEmail}") {
					name
				}
				}
			`,
		});
	}

	impersonate(userId: string) {
		return this.apollo.mutate({
			mutation: gql`
				mutation {
				impersonate(userId: "${userId}")
				}
			`,
		});
	}

	hasCryptoStore() {
		console.log(this.user, this.username)
		return this.apollo.query({
			query: gql`
			{
				userById(_id:"${this.user._id}"){
				  rstores{
					_id
				  }
				}
			  }`,
		}).toPromise()
	}
}
