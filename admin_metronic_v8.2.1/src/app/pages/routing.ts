import { Routes } from '@angular/router';

const Routing: Routes = [
  //DASHBOARD
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  //BUILDER
  {
    path: 'builder',
    loadChildren: () => import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  //CRAFTED->PROFILE
  {
    path: 'crafted/pages/profile',
    loadChildren: () => import('../modules/profile/profile.module').then((m) => m.ProfileModule),
    // data: { layout: 'light-sidebar' },
  },
  //CRAFTED->ACCOUNT
  {
    path: 'crafted/account',
    loadChildren: () => import('../modules/account/account.module').then((m) => m.AccountModule),
    // data: { layout: 'dark-header' },
  },
  //CRAFTED->PAGES->WIZARDS
  {
    path: 'crafted/pages/wizards',
    loadChildren: () => import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
    // data: { layout: 'light-header' },
  },
  //CRAFTED->WIDGETS
  {
    path: 'crafted/widgets',
    loadChildren: () => import('../modules/widgets-examples/widgets-examples.module').then((m) => m.WidgetsExamplesModule),
    // data: { layout: 'light-header' },
  },
  //APPS->CHAT
  {
    path: 'apps/chat',
    loadChildren: () => import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
    // data: { layout: 'light-sidebar' },
  },
  //APPS->USERS
  {
    path: 'apps/users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  //APPS->ROLES
  {
    path: 'apps/roles',
    loadChildren: () => import('./role/role.module').then((m) => m.RoleModule),
  },
  //APPS->PERMISSIONS
  {
    path: 'apps/permissions',
    loadChildren: () => import('./permission/permission.module').then((m) => m.PermissionModule),
  },
  //MÓDULOS CREADOS POR MI MISMO --> localhost:4200/roles/list
  //ROLES
  {
    path: 'roles',
    loadChildren: () => import('../modules/roles/roles.module').then((m) => m.RolesModule),
  },
  //USUARIOS
  {
    path: 'usuarios',
    loadChildren: () => import('../modules/users/users.module').then((m) => m.UsersModule),
  },
  //MÓDULOS CREADOS POR MI MISMO --> localhost:4200/configuraciones/sucursales/list
  //CONFIGURACIONES
  {
    path: 'configuraciones',
    loadChildren: ()=> import('../modules/configuration/configuration.module').then((m) => m.ConfigurationModule)
  },
  //PRODUCTOS
  {
    path: 'productos',
    loadChildren: ()=> import('../modules/products/products.module').then((m) => m.ProductsModule)
  },
  //DASHBOARD->COMPLETO
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  //ERROR 404
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
