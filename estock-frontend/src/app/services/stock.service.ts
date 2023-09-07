import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { STOCK } from '../constants/stock.constants';
import { StockResponseObject } from '../models/stock-response.model';
import { Stock } from '../models/stock.model';

@Injectable({
	providedIn: 'root',
})
export class StockService {
	private base = environment.stock_base;

	constructor(private http: HttpClient) {}

	fetchStocks(companyCode: number, from: string, to: string): Observable<StockResponseObject[]> {
		const url = this.base + STOCK.get + companyCode + '/' + from + '/' + to;
		return this.http.get<StockResponseObject[]>(url);
	}

	addStockPrice(companyCode: number, price: number) {
		const url = this.base + STOCK.add + companyCode;
		const requestBody: Stock = { price: price };
		return this.http.post<{ message: string }>(url, requestBody);
	}
}
