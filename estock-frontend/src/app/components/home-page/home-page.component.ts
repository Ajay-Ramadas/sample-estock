import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, take } from 'rxjs';
import { AddCompanyModalComponent } from '../add-company-modal/add-company-modal.component';

@Component({
	selector: 'app-home-page',
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
	modalRef?: BsModalRef<AddCompanyModalComponent>;
	alertOptions?: { showAlert: boolean; success?: boolean } = { showAlert: false };
	deleteCompanyAlertOptions?: { showAlert: boolean; success?: boolean } = { showAlert: false };
	showAllCompanies = false;
	companyDetailsOfCode = 0;

	refresh = new BehaviorSubject<void>(undefined);

	constructor(private modalService: BsModalService, private fb: FormBuilder) {}

	searchBox = this.fb.group({
		searchText: '',
	});

	ngOnInit(): void {}

	addCompany() {
		this.modalRef = this.modalService.show(AddCompanyModalComponent);
		this.modalRef.onHide?.pipe(take(1)).subscribe(() => {
			switch (this.modalRef?.content?.onClose) {
				case 'success':
					this.alertOptions = { showAlert: true, success: true };
					this.showAllCompaniesList();
					break;
				case 'fail':
					this.alertOptions = { showAlert: true, success: false };
					break;
				default:
					this.alertOptions = { showAlert: false };
			}
		});
	}

	showAllCompaniesList() {
		this.refresh.next();
		this.showAllCompanies = true;
	}

	showMore(code: number) {
		this.showAllCompanies = false;
		this.companyDetailsOfCode = code;
	}

	resetAlerts() {
		this.alertOptions = {
			showAlert: false,
			success: undefined,
		};
		this.deleteCompanyAlertOptions = {
			showAlert: false,
			success: undefined,
		};
	}

	onCompanyDeletion() {
		this.deleteCompanyAlertOptions = {
			showAlert: true,
			success: true,
		};
		this.showAllCompaniesList();
	}

	search() {
		const searchText = this.searchBox.value['searchText'];
		this.showAllCompanies = false;
		this.companyDetailsOfCode = searchText;
	}
}
