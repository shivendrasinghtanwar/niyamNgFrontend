import { Component, OnDestroy, OnInit, NgZone } from '@angular/core'
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme'

import { ProfileData } from '../../../dataServices/ProfileData.service'
import { ProfileDataResponse } from '../../../models/ProfileDataResponse'

import { UserData } from '../../../@core/data/users'
import { LayoutService } from '../../../@core/utils'
import { map, takeUntil, filter } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { Router } from '@angular/router'

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>()
  userPictureOnly: boolean = false
  user: any
  error: any
  authInstance: any
  gapiSetup: any
  profileData: any = null

  // public auth2: any;
  // public googleInit() {
  //   gapi.load('auth2', () => {
  //     this.auth2 = gapi.auth2.init({
  //       client_id: '61993714184-468fb6f5ad4tndihua44m49cbvl7n8n7.apps.googleusercontent.com',
  //       cookie_policy: 'single_host_origin',
  //       scope: 'profile email'
  //     });
  //     this.attachSignin(document.getElementById('googleBtn'));
  //   });
  // }
  // public attachSignin(element) {
  //   this.auth2.attachClickHandler(element, {},
  //     (googleUser) => {

  //       let profile = googleUser.getBasicProfile();
  //       console.log('Token || ' + googleUser.getAuthResponse().id_token);
  //       console.log('ID: ' + profile.getId());
  //       console.log('Name: ' + profile.getName());
  //       console.log('Image URL: ' + profile.getImageUrl());
  //       console.log('Email: ' + profile.getEmail());
  //       //YOUR CODE HERE
  //       this.user.name = profile.getName();
  //       this.user.picture = profile.getImageUrl();
  //       this.user.email = profile.getEmail();
  //       this.user.userId = profile.getId();
  //       this.user.access_token = googleUser.getAuthResponse().id_token
  //       this.getAllProfileData(this.user.access_token);
  //     }, (error) => {
  //       alert(JSON.stringify(error, undefined, 2));
  //     });
  // }

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ]

  siteLogo = 'assets/images/DS_LOGO.jpg'

  currentTheme = 'default'

  userMenu = [{ title: 'Log out' }]

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private profileService: ProfileData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private routerService: Router,
    private ngZone: NgZone
  ) {}

  // ngAfterViewInit(){
  //       this.googleInit();
  // }

  async ngOnInit() {
    this.currentTheme = this.themeService.currentTheme
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => (this.user = users.nick))
    const { xl } = this.breakpointService.getBreakpointsMap()
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
      )
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
    } else {
      this.routerService.navigate(['/auth'])
    }

    this.menuService.onItemClick().subscribe((event) => {
      this.onItemSelection(event.item.title)
    })
    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe((themeName) => (this.currentTheme = themeName))
  }

  onItemSelection(title) {
    if (title === 'Log out') {
      // Do something on Log out
      // console.log('Log out Clicked ')
      this.signOut()
    } else if (title === 'Profile') {
      // Do something on Profile
      console.log('Profile Clicked ')
    }
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName)
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar')
    this.layoutService.changeLayoutSize()

    return false
  }

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
          this.getAllProfileData(this.user.access_token)
        },
        (error) => (this.error = error)
      )
    })
  }

  async checkIfUserAuthenticated(): Promise<boolean> {
    // Initialize gapi if not done yet
    if (!this.gapiSetup) {
      await this.initGoogleAuth()
    }

    return this.authInstance.isSignedIn.get()
  }

  signOut() {
    const auth2 = this.authInstance

    auth2.signOut().then(() => {
      console.log('User signed out.')
      this.user = {}
      this.profileData = {}
      this.ngZone.run(() => this.routerService.navigate(['/auth']))
    })
  }

  getAllProfileData(id_token) {
    console.log(id_token)
    this.profileService.getAll(id_token).subscribe(
      (response: any) => {
        this.profileData = JSON.parse(response || {})
        const { status = '0' } = this.profileData
        if (status !== '1') {
          this.routerService.navigate(['/auth'])
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }
  navigateHome() {
    this.menuService.navigateHome()
    return false
  }
}
