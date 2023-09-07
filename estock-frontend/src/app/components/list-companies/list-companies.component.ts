import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, Subject, takeUntil } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { CompanyService } from 'src/app/services/company.service';

@Component({
	selector: 'app-list-companies',
	templateUrl: './list-companies.component.html',
	styleUrls: ['./list-companies.component.scss'],
})
export class ListCompaniesComponent implements OnInit, OnDestroy {
	companyList: Company[] = [];
	destroy$ = new Subject<void>();
	@Input() refresh = new BehaviorSubject<void>(undefined);
	@Output() selectedCompanyCode = new EventEmitter();

	noFetchedCompanies = false;

	constructor(private companyService: CompanyService) {}

	ngOnInit(): void {
		this.refresh.pipe(takeUntil(this.destroy$)).subscribe(() => this.fetchCompanies());
	}

	fetchCompanies() {
		console.log('fetching');
		this.companyService
			.listAllCompanies()
			.pipe(
				catchError((err) => {
					this.noFetchedCompanies = true;
					return EMPTY;
				})
			)
			.subscribe((response) => {
				this.noFetchedCompanies = false;
				this.companyList = response;
			});
	}

	showMore(code = 0) {
		if (code !== 0) {
			this.selectedCompanyCode.emit(code);
		}
	}
	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
