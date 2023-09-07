import axios from 'axios';

export function getLatestStock(companyCode) {
   return axios.get('http://localhost:8080/api/v1.0/market/stock/latest/'+companyCode);
}

export function deleteStocks(companyCode) {
    return axios.delete('http://localhost:8080/api/v1.0/market/stock/delete/'+companyCode)
}
