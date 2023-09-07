import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddCompanyModalComponent } from './components/add-company-modal/add-company-modal.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ListCompaniesComponent } from './components/list-companies/list-companies.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';

@NgModule({
	declarations: [
		AppComponent,
		HomePageComponent,
		AddCompanyModalComponent,
		ListCompaniesComponent,
		CompanyDetailsComponent,
		StockDetailsComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,

		// Bootstrap Modules
		ModalModule.forRoot(),
		AlertModule.forRoot(),
		BsDatepickerModule.forRoot(),
	],
	providers: [DatePipe],
	bootstrap: [AppComponent],
})
export class AppModule {}
