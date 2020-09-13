import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { NgxAuthRoutingModule } from './auth-routing.module'
import { NbAuthModule } from '@nebular/auth'
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
} from '@nebular/theme'
import { NgxLoginComponentComponent } from './ngx-login-component/ngx-login-component.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NgxAuthRoutingModule,
    NbAuthModule,
    ReactiveFormsModule,
  ],
  declarations: [
    // ... here goes our new components
    NgxLoginComponentComponent,
  ],
})
export class NgxAuthModule {}
