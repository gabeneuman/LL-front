import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './shared/modules/material.module';
import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialogComponent } from './shared/components/confirmation-dialog/confirmation-dialog.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotesComponent } from './shared/components/notes/notes.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environments } from './environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ConfirmationDialogComponent,
    LoaderComponent,
    LoginComponent,
    RegisterComponent,
    NotesComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environments.firebaseConfig),
    MaterialModule,
    HttpClientModule,
    CoreModule,
    UserModule,
    ToastrModule.forRoot(),
  ],
})
export class AppModule {}
