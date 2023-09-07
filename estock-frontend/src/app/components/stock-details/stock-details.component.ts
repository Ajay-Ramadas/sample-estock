import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { catchError, EMPTY, map, Subject, takeUntil } from 'rxjs';
import { Stock } from 'src/app/models/stock.model';
import { StockService } from 'src/app/services/stock.service';

interface StockStats {
	min: number | 'NA';
	max: number | 'NA';
	avg: number | 'NA';
}

@Component({
	selector: 'app-stock-details',
	templateUrl: './stock-details.component.html',
	styleUrls: ['./stock-details.component.scss'],
})
export class StockDetailsComponent implements OnInit, OnDestroy {
	@Input() companyCode!: number;
	stocks: Stock[] = [];

	readonly today = new Date();
	fromDate = this.today;
	toDate = this.today;
	stockStats: StockStats = {
		min: 'NA',
		max: 'NA',
		avg: 'NA',
	};
	noFetchedStocks = false;
	destroy$ = new Subject<void>();

	constructor(private stockService: StockService, private datePipe: DatePipe) {}

	ngOnInit(): void {}

	fetchStocks() {
		const formattedFromDate = this.datePipe.transform(this.fromDate, 'YYYY-MM-dd') as string;
		const formatttedToDate = this.datePipe.transform(this.toDate, 'YYYY-MM-dd') as string;

		this.stockService
			.fetchStocks(this.companyCode, formattedFromDate, formatttedToDate)
			.pipe(
				takeUntil(this.destroy$),
				map((response) => {
					return response.map((stockReponseObject) => {
						const stock: Stock = {
							price: 0,
							date: undefined,
						};
						stock.price = stockReponseObject.price.$numberDecimal;
						stock.date = new Date(stockReponseObject.date);
						return stock;
					});
				}),
				catchError((err) => {
					this.noFetchedStocks = true;
					return EMPTY;
				})
			)
			.subscribe((response: Stock[]) => {
				this.noFetchedStocks = false;
				this.stocks = response;
				this.calculateStats();
			});
	}
	calculateStats() {
		if (this.stocks.length > 0) {
			let min = this.stocks[0].price,
				max = this.stocks[0].price,
				sum = 0;
			this.stocks.forEach((stock) => {
				if (stock.price < min) {
					min = stock.price;
				}
				if (stock.price > max) {
					max = stock.price;
				}
				sum += stock.price;
			});
			this.stockStats = {
				min: min,
				max: max,
				avg: sum / this.stocks.length,
			};
		} else {
			this.stockStats = {
				min: 'NA',
				max: 'NA',
				avg: 'NA',
			};
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
