import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { JwtHelperService } from '@auth0/angular-jwt'
import { Apollo } from 'apollo-angular'
import { AuthenticationService } from 'src/app/core/services/authentication.service'

@Component({
	selector: 'app-reset',
	templateUrl: './reset.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetComponent implements OnInit {
	passwordForm: FormGroup
	loading = false
	token = ''
	changed = false

	tokenInvalid = false

	jwtHelper = new JwtHelperService()

	constructor(
		private fb: FormBuilder,
		private authService: AuthenticationService,
		private chRef: ChangeDetectorRef,
		private route: ActivatedRoute,
		private apollo: Apollo
	) {
		this.passwordForm = this.fb.group({
			password: ['', [Validators.required, Validators.minLength(6)]],
			repeatPassword: ['', [Validators.required, Validators.minLength(6)]],
		})
		this.token = this.route.snapshot.queryParams.token

		this.tokenInvalid = this.jwtHelper.isTokenExpired(this.token)
		console.log('Token is ', this.token)
		console.log('Token expired ', this.tokenInvalid)
	}

	ngOnInit(): void {
		this.apollo.client.resetStore()
	}

	resetPassword() {
		if (this.passwordForm.invalid || this.passwordForm.value.password !== this.passwordForm.value.repeatPassword) {
			return
		}

		this.loading = true
		console.log('Resetting password ', this.passwordForm.value.password)
		this.authService.resetForgotPassword(this.passwordForm.value.password, this.token).subscribe(
			(res: any) => {
				console.log(res)

				if (res.data.resetforgotPassword.message === 'Done') {
					this.changed = true
				} else {
					console.error('Not sure if changed')
				}

				this.loading = false
				this.chRef.detectChanges()
			},
			(e) => {
				console.error(e)
				this.loading = false
				this.chRef.detectChanges()
			}
		)
	}

	get p() {
		return this.passwordForm.controls
	}
}
