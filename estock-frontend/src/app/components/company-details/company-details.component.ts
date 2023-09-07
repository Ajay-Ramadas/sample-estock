import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
	TemplateRef,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { catchError, EMPTY, Subject, takeUntil } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';
import { StockService } from 'src/app/services/stock.service';

interface AlertOptions {
	showAlert: boolean;
	success?: boolean;
}

@Component({
	selector: 'app-company-details',
	templateUrl: './company-details.component.html',
	styleUrls: ['./company-details.component.scss'],
})
export class CompanyDetailsComponent implements OnChanges, OnDestroy {
	@Input() code!: number;
	@Output() companyDeleted = new EventEmitter<boolean>();
	company?: Company;
	showError = false;
	stockAdditionAlertOptions?: AlertOptions = { showAlert: false };
	deleteCompanyAlertOptions?: AlertOptions = { showAlert: false };
	addStockModal?: BsModalRef;
	deleteCompanyModal?: BsModalRef;

	destroy$ = new Subject<void>();

	constructor(
		private companyService: CompanyService,
		private stockService: StockService,
		private fb: FormBuilder,
		private modalService: BsModalService
	) {}

	addStockForm = this.fb.group({
		newPrice: 0,
	});
	ngOnChanges(changes: SimpleChanges): void {
		this.showError = false;
		this.fetchCompany();
	}
	fetchCompany() {
		this.companyService
			.getCompanyDetails(this.code)
			.pipe(
				takeUntil(this.destroy$),
				catchError(() => {
					this.showError = true;
					return EMPTY;
				})
			)
			.subscribe((company) => {
				this.company = company;
				console.log(company);
			});
	}

	openWebsite() {
		let url = this.company?.website as string;
		if (!url.includes('http')) {
			url = 'https://' + url;
		}
		window.open(url);
	}

	openNewStockPriceModal(modal: TemplateRef<any>) {
		this.addStockModal = this.modalService.show(modal);
	}
	closeNewStockPriceModal() {
		this.addStockModal?.hide();
	}
	addNewStockPrice() {
		const formData = this.addStockForm.value;
		if (this.company?.code) {
			this.stockService
				.addStockPrice(this.company?.code, formData?.['newPrice'])
				.pipe(
					catchError((err) => {
						this.stockAdditionAlertOptions = {
							showAlert: true,
							success: false,
						};
						this.addStockModal?.hide();
						return EMPTY;
					})
				)
				.subscribe((resonse) => {
					if (resonse.message === 'Stock added') {
						this.stockAdditionAlertOptions = {
							showAlert: true,
							success: true,
						};
						this.fetchCompany();
					} else {
						this.stockAdditionAlertOptions = {
							showAlert: true,
							success: false,
						};
					}
					this.addStockModal?.hide();
				});
		}
	}

	openDeleteCompanyConfirmation(modal: TemplateRef<any>) {
		this.deleteCompanyModal = this.modalService.show(modal);
	}
	closeDeleteCompanyModal() {
		this.deleteCompanyModal?.hide();
	}

	deleteCompany() {
		if (this.company?.code) {
			this.companyService
				.deleteCompany(this.company.code)
				.pipe(
					catchError((err) => {
						this.deleteCompanyAlertOptions = {
							showAlert: true,
							success: false,
						};
						this.deleteCompanyModal?.hide();
						return EMPTY;
					})
				)
				.subscribe(() => {
					this.deleteCompanyAlertOptions = {
						showAlert: true,
						success: true,
					};
					this.deleteCompanyModal?.hide();
					this.companyDeleted.emit(true);
				});
		}
	}

	resetAlerts() {
		this.stockAdditionAlertOptions = {
			showAlert: false,
			success: undefined,
		};
		this.deleteCompanyAlertOptions = {
			showAlert: false,
			success: undefined,
		};
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
