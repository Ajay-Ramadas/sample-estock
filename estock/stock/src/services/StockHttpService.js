import axios from 'axios';

export function getCompanyInfo(companycode) {
    return axios.get('http://localhost:5080/api/v1.0/market/company/info/'+companycode);
}
