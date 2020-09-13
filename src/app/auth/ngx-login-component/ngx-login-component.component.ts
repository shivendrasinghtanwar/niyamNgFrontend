import { Component, OnInit, OnDestroy, NgZone } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ProfileData } from '../../dataServices/ProfileData.service'
import { ProfileDataResponse } from '../../models/ProfileDataResponse'
import { Router } from '@angular/router'
import { UserData } from '../../@core/data/users'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'

@Component({
  selector: 'ngx-ngx-login-component',
  templateUrl: './ngx-login-component.component.html',
  styleUrls: ['./ngx-login-component.component.scss'],
})
export class NgxLoginComponentComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>()
  userPictureOnly: boolean = false
  user: any
  error: any
  registerForm: FormGroup
  authInstance: any
  gapiSetup: any
  profileData: any = null
  submitted = false

  constructor(
    private profileService: ProfileData,
    private routerService: Router,
    private userService: UserData,
    private ngZone: NgZone,
    private formBuilder: FormBuilder
  ) {}

  async initGoogleAuth(): Promise<void> {
    //  Create a new Promise where the resolve
    // function is the callback passed to gapi.load
    const pload = new Promise((resolve) => {
      gapi.load('auth2', resolve)
    })

    // When the first promise resolves, it means we have gapi
    // loaded and that we can call gapi.init
    return pload.then(async () => {
      await gapi.auth2
        .init({
          client_id:
            '61993714184-468fb6f5ad4tndihua44m49cbvl7n8n7.apps.googleusercontent.com',
        })
        .then((auth) => {
          this.gapiSetup = true
          this.authInstance = auth
        })
    })
  }

  async checkIfUserAuthenticated(): Promise<boolean> {
    // Initialize gapi if not done yet
    if (!this.gapiSetup) {
      await this.initGoogleAuth()
    }

    return this.authInstance.isSignedIn.get()
  }

  async authenticate(): Promise<gapi.auth2.GoogleUser> {
    // Initialize gapi if not done yet
    if (!this.gapiSetup) {
      await this.initGoogleAuth()
    }

    // Resolve or reject signin Promise
    return new Promise(async () => {
      await this.authInstance.signIn().then(
        (user) => {
          const profile = user.getBasicProfile()
          this.user.name = profile.getName()
          this.user.picture = profile.getImageUrl()
          this.user.email = profile.getEmail()
          this.user.userId = profile.getId()
          this.user.access_token = user.getAuthResponse().id_token
          this.ngZone.run(() => this.getAllProfileData(this.user.access_token))
        },
        (error) => (this.error = error)
      )
    })
  }

  getAllProfileData(id_token) {
    console.log(id_token)
    this.profileService.getAll(id_token).subscribe(
      (response: any) => {
        this.profileData = JSON.parse(response || {})
        const { status = '0' } = this.profileData
        if (status === '1') {
          this.routerService.navigate(['/pages/dashboard'])
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  getVerifiedData(code) {
    this.profileService.getVerification(this.user.access_token, code).subscribe(
      (response: any) => {
        this.profileData = JSON.parse(response || {})
        const { status = '0' } = this.profileData
        debugger
        if (status === '1') {
          this.routerService.navigate(['/pages/dashboard'])
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  get f() {
    return this.registerForm.controls
  }

  onVerifySubmit() {
    this.submitted = true

    if (this.registerForm.invalid) {
      return
    }
    const { code = '' } = this.registerForm.value
    this.getVerifiedData(code)
  }

  async ngOnInit() {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => (this.user = users.nick))
    this.registerForm = this.formBuilder.group({
      code: ['', Validators.required],
    })
    if (await this.checkIfUserAuthenticated()) {
      const profile = this.authInstance.currentUser.get().getBasicProfile()
      this.user.name = profile.getName()
      this.user.picture = profile.getImageUrl()
      this.user.email = profile.getEmail()
      this.user.userId = profile.getId()
      this.user.access_token = this.authInstance.currentUser
        .get()
        .getAuthResponse().id_token
      await this.getAllProfileData(this.user.access_token)
    }
  }
  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
