import { Company } from "../models/Company.js";

export function getCompanyInfoFromDB(code) {
    return Company.findByPk(code, {
        attributes: ['code', 'name', 'ceo', 'turnover', 'website', 'stock_exchange']
    });
}

export function registerNewCompanyIntoDB(name,ceo,stock_exchange,turnover,website) {
    return Company.create({
        name: name,
        ceo: ceo,
        stock_exchange: stock_exchange,
        turnover: turnover,
        website: website
    },
    {
        fields: ['code', 'name', 'ceo', 'turnover', 'website', 'stock_exchange']
    })
}

export function getAllCompanies() {
    return Company.findAll({
        attributes: ['code', 'name', 'ceo', 'turnover', 'website', 'stock_exchange']
    })
}

export function deleteCompany(code) {
    return Company.destroy({
        where: { code: code }
    });
};