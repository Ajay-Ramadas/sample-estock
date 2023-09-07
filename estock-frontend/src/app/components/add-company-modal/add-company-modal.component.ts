import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, EMPTY, map, Subject, takeUntil } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';

@Component({
	selector: 'app-add-company-modal',
	templateUrl: './add-company-modal.component.html',
	styleUrls: ['./add-company-modal.component.scss'],
})
export class AddCompanyModalComponent implements OnInit, OnDestroy {
	constructor(
		private modalRef: BsModalRef,
		public fb: FormBuilder,
		private companyService: CompanyService
	) {}

	showAlert = false;
	onClose?: 'success' | 'fail' | 'hide';
	websiteRegex =
		/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gim;

	registerForm = this.fb.group({
		name: '',
		ceo: '',
		website: '',
		turnover: '',
		exchange: '',
	});

	destroy$ = new Subject<void>();

	ngOnInit(): void {}

	close() {
		this.modalRef.hide();
	}

	submit() {
		const formData = this.registerForm.value;
		const request: Company = {
			name: formData?.['name'],
			ceo: formData?.['ceo'],
			turnover: formData?.['turnover'],
			website: formData?.['website'],
			stock: formData?.['exchange'],
		};
		this.companyService
			.registerCompany(request)
			.pipe(
				takeUntil(this.destroy$),
				map((response) => {
					this.onClose = response.message === 'Register Success' ? 'success' : 'fail';
				}),
				catchError(() => {
					this.onClose = 'fail';
					this.modalRef.hide();
					return EMPTY;
				})
			)
			.subscribe(() => this.modalRef.hide());
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
