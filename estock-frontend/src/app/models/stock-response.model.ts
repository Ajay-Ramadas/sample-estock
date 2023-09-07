export interface StockResponseObject {
	_id: string;
	price: { $numberDecimal: number };
	date: string;
	companyCode: number;
}
