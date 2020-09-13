import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { NbAuthComponent } from '@nebular/auth'
import { NgxLoginComponentComponent } from './ngx-login-component/ngx-login-component.component'

export const routes: Routes = [
  // .. here goes our components routes
  {
    path: '',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NgxLoginComponentComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {}
