import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from 'src/app/models/company.model';
import { environment } from 'src/environments/environment';
import { COMPANY } from '../constants/company.constants';

@Injectable({
	providedIn: 'root',
})
export class CompanyService {
	private base = environment.company_base;

	constructor(private http: HttpClient) {}

	registerCompany(company: Company): Observable<{ message: string }> {
		const url = this.base + COMPANY.register;
		return this.http.post<{ message: string }>(url, company);
	}

	listAllCompanies(): Observable<Company[]> {
		const url = this.base + COMPANY.all;
		return this.http.get<Company[]>(url);
	}

	getCompanyDetails(code: number): Observable<Company> {
		const url = this.base + COMPANY.info + code;
		return this.http.get<Company>(url);
	}

	deleteCompany(code: number) {
		const url = this.base + COMPANY.delete + code;
		return this.http.delete<{}>(url);
	}
}
