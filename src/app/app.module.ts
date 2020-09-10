import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { UserService } from "./services/user.service";
import { DataTableFilterService } from "./services/dataTableFilter.service";
import { AuthenticationService } from "./services/authentication.service";
import { AlertService } from "./services/alert.service";
import { AdminGuard } from "./guard/admin.guard";

import { AppComponent } from "./app.component";
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { Home2Component } from './home2/home2.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './helpers/errorInterceptor.helper';
import { AddTokenInterceptor } from './helpers/add-token-interceptor.helper';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';
import { EmpliationComponent } from './empliation/empliation.component';
import { DataTableModule } from "angular-6-datatable";
import { NotifierModule, NotifierOptions } from "angular-notifier";
import { EditGroupComponent } from './edit-group/edit-group.component';
import { RoleComponent } from './role/role.component';
import { NewRoleComponent } from './new-role/new-role.component';
import { UiSwitchModule } from "ngx-toggle-switch";
import { EditRoleComponent } from './edit-role/edit-role.component';
import { UsersComponent } from './users/users.component';
import { WorkflowsComponent } from './workflows/workflows.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from "./edit-user/edit-user.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { MetadatasComponent } from './metadatas/metadatas.component';
import { EditMetadataComponent } from './edit-metadata/edit-metadata.component';
import { StoragesComponent } from './storages/storages.component';
import { EditStorageComponent } from './edit-storage/edit-storage.component';
import { LogsComponent } from './logs/logs.component';

import { GroupComponent } from './group/group.component';
import { SharingService } from './services/sharing.service';
import { VersementComponent } from './versement/versement.component';
import { FileDropModule } from 'ngx-file-drop';
import { MetadataService } from './services/metadata.service';
import { GroupService } from './services/group.service';
import { ProgressBarModule } from 'angular-progress-bar';
import { ArchiveService } from './services/archive.service';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { LeftSideComponent } from './left-side/left-side.component';
import { SearchComponent } from './search/search.component';
//import { DataTableModule } from 'ng2-data-table';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadResourceService } from './services/load-resource.service';
import { CoverComponent } from './cover/cover.component';
//import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TrashComponent } from './trash/trash.component';
import { ExportComponent } from './export/export.component';
import { Export2Component } from './export2/export2.component';
import { ArchiveDetailComponent } from './archive-detail/archive-detail.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { UserProfilComponent } from './user-profil/user-profil.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { CategoryComponent } from './category/category.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { AdminExportComponent } from './admin-export/admin-export.component';
import { ReplicationComponent } from './replication/replication.component';
import { CategoryService } from './services/category.service';
import { PrivilegeGuard } from './guard/privilege.guard';
import { ShowCategoryComponent } from './show-category/show-category.component';
import { AddWorkflowComponent } from './add-workflow/add-workflow.component';
import { EditWorkflowComponent } from './edit-workflow/edit-workflow.component';
import { DisseminationService } from './services/dissemination.service';
import { LogoutComponent } from './logout/logout.component';
import { FileTypeComponent } from './file-type/file-type.component';

import { AutocompleteLibModule } from 'angular-ng-autocomplete';

const appRoutes: Routes = [
	{ path: "", component: LoginComponent },
	{ path: "login", component: LoginComponent },
	{ path: "logout", component: LogoutComponent },
	{ path: "forgot-password", component: ForgotPasswordComponent },
	{
		path: "home",
		component: HomeComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 1 }
	},
	{
		path: "home2",
		component: Home2Component,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 1 }
	},
	{
		path: "user-profil",
		component: UserProfilComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 2 }
	},
	{
		path: "group",
		component: GroupComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 11 }
	},
	{
		path: "category",
		component: ShowCategoryComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 11 }
	},
	{
		path: "trash",
		component: TrashComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 16 }
	},
	{
		path: "export",
		component: ExportComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 14 }
	},
	{
		path: "export2",
		component: Export2Component,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 14 }
	},
	{
		path: "search",
		component: SearchComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 10 }
	},
	{
		path: "importer",
		component: VersementComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 12 }
	},
	{
		path: "archive/:id",
		component: ArchiveDetailComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 10 }
	},

	/*===============================================================================*/

	{
		path: "admin",
		component: HomeAdminComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 1 }
	},
	{
		path: "admin/groups",
		component: EmpliationComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 40 }
	},
	{
		path: "admin/type-de-fichier",
		component: FileTypeComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 40 }
	},
	{
		path: "admin/categories",
		component: CategoryComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 80 }
	},
	{
		path: "admin/roles",
		component: RoleComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 30 }
	},
	{
		path: "admin/storages",
		component: StoragesComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 60 }
	},
	{
		path: "admin/users",
		component: UsersComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 20 }
	},
	{
		path: "admin/workflows",
		component: WorkflowsComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 70 }
	},
	{
		path: "admin/logs",
		component: LogsComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 95 }
	},
	{
		path: "admin/metadatas",
		component: MetadatasComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 50 }
	},
	{
		path: "admin/role/add",
		component: NewRoleComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 31 }
	},
	{
		path: "admin/replication",
		component: ReplicationComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 90 }
	},
	{
		path: "admin/home",
		component: HomeAdminComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 1 }
	},
	{
		path: "admin/user/add",
		component: AddUserComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 21 }
	},
	{
		path: "admin/category/add",
		component: AddCategoryComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 81 }
	},
	{
		path: "admin/roles/:id",
		component: EditRoleComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 32 }
	},
	{
		path: "admin/export",
		component: AdminExportComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 97 }
	},
	{
		path: "admin/users/:id",
		component: EditUserComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 22 }
	},
	{
		path: "admin/categories/:id",
		component: EditCategoryComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 82 }
	},
	{
		path: "admin/storages/:id",
		component: EditStorageComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 62 }
	},
	{
		path: "admin/metadatas/:id",
		component: EditMetadataComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 52 }
	},
	{
		path: "admin/groups/:id",
		component: EditGroupComponent,
		canActivate: [PrivilegeGuard],
		data: { privilegeID: 42 }
	},

	{
		path: "admin/workflows/:id",
		component: EditWorkflowComponent,
		canActivate: [AdminGuard]
	},

	{
		path: "admin/workflow/add",
		component: AddWorkflowComponent,
		canActivate: [AdminGuard]
	},
	/*===============================================================================*/
	{ path: "not-found", component: FourOhFourComponent },
	{ path: "**", redirectTo: "not-found" }
];

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: "right",
      distance: 12
    },
    vertical: {
      position: "top",
      distance: 12,
      gap: 10
    }
  },
  theme: "material",
  behaviour: {
    autoHide: 10000,
    onClick: "hide",
    onMouseover: "pauseAutoHide",
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: "slide",
      speed: 300,
      easing: "ease"
    },
    hide: {
      preset: "fade",
      speed: 300,
      easing: "ease",
      offset: 50
    },
    shift: {
      speed: 300,
      easing: "ease"
    },
    overlap: 150
  }
};
@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    FourOhFourComponent,
    EmpliationComponent,
    EditGroupComponent,
    RoleComponent,
    NewRoleComponent,
    EditRoleComponent,
    UsersComponent,
    AddUserComponent,
    EditUserComponent,
    MetadatasComponent,
    EditMetadataComponent,
    WorkflowsComponent,
    StoragesComponent,
    EditStorageComponent,
    LogsComponent,
    FourOhFourComponent,
    GroupComponent,
    VersementComponent,
    LeftSideComponent,
    SearchComponent,
    CoverComponent,
    TrashComponent,
    ExportComponent,
    ArchiveDetailComponent,
    UserProfilComponent,
    AvatarComponent,
    ForgotPasswordComponent,
    HomeAdminComponent,
    CategoryComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    AdminExportComponent,
    ReplicationComponent,
    //CategoryComponent,
    Home2Component,
    Export2Component,
    ShowCategoryComponent,
    AddWorkflowComponent,
    EditWorkflowComponent,
    LogoutComponent,
    FileTypeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    DataTableModule,
    UiSwitchModule,
    NgMultiSelectDropDownModule.forRoot(),
    NotifierModule.withConfig(customNotifierOptions),
    FileDropModule,
    ProgressBarModule,
    FilterPipeModule,
    DataTableModule,
    NgxPaginationModule,
    AngularMultiSelectModule,
		NgMultiSelectDropDownModule,
		AutocompleteLibModule 
  ],
  providers: [
    UserService,
    MetadataService,
    GroupService,
    AuthenticationService,
    DataTableFilterService,
    AlertService,
    ArchiveService,
		SharingService,
		CategoryService,
		LoadResourceService,
		DisseminationService,
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
