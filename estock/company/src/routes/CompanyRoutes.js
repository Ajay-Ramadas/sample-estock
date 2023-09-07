import express from "express";
import { corsOptions } from "../config/cors.config.js";
import { deleteCompany, getAllCompanies, getCompanyInfoFromDB, registerNewCompanyIntoDB } from '../services/CompanyService.js';
import cors from 'cors';
import { getLatestStock, deleteStocks } from "../services/CompanyHttpService.js";

const router = express.Router();



/**
 * @swagger
 * /api/v1.0/market/company/info/{code}:
 *      get:
 *          summary: Return the details of the company based on company code
 *          tags: [Company]
 *          parameters:
 *              - in: path
 *                name : code
 *                schema:
 *                  type: number
 *                required: true
 *                description: The company code
 *          responses:
 *              200:
 *                  description: The details of the company
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              items:
 *                                  $ref: '#/components/schemas/Company'
 *              404:
 *                  description: No Company found
 */
router.get("/info/:code", (request, response) => {
    getCompanyInfoFromDB(request.params.code)
        .then((company) => {
            console.log(company)
            if (!company) {
                response.sendStatus(404);
            } else {
                getLatestStock(request.params.code)
                .then((latestStockPrice) => {
                    console.log("latest",latestStockPrice)
                    if (latestStockPrice?.data?.price?.["$numberDecimal"]) {
                        company['dataValues']['latestStockPrice'] = latestStockPrice.data.price["$numberDecimal"];
                    } else {
                        company['dataValues']['latestStockPrice'] = -1;
                    }
                    response.json(company);
                })
                .catch((error) => {
                    console.log(error);
                    response.json(company)
                })
            }
        })
        .catch((error) => {
            console.error("Error: ", error);
            response.json({
                message: 'Failed'
            });
        })
});

/**
 * @swagger
 * /api/v1.0/market/company/register:
 *      post:
 *          summary: Register a new Company
 *          tags: [Company]
 *          requestBody:
 *              required: true
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Company'
 *          responses:
 *              200:
 *                  description: Registration Success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              items:
 *                                  $ref: '#/components/schemas/Company'
 *              400:
 *                  description: Bad Request
 *              500:
 *                  description: Registration Failed
 */
router.post("/register", (request, response) => {
    if (request.body['turnover'] < 100000000) {
        response.status(400).json({
            message: "Company Turnover should be greater than 10Cr"
        })
        return;
    }
    registerNewCompanyIntoDB(request.body['name'], request.body['ceo'], request.body['stock'], request.body['turnover'], request.body['website'])
        .then((res) => {
            console.log('Company added with new code : ' + res.code);
            response.json({
                message: 'Register Success'
            })
        })
        .catch((error) => {
            console.error(error);
            response.sendStatus(500);
        })
});

/**
 * @swagger
 * /api/v1.0/market/company/getall:
 *      get:
 *          summary: Get details of all companies
 *          tags: [Company]
 *          responses: 
 *               200:
 *                  description: All Companies
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Company'
 *               404:
 *                  description: No Companies Found
 */
router.get("/getall", (_request, response) => {
    getAllCompanies()
        .then((companies) => {
            const promises = [];
            companies = companies.map((company) => {
                if (company['code']) {
                    promises.push(getLatestStock(company?.['code'])
                    .then((latestStockPrice) => {
                        if (latestStockPrice?.data?.price?.["$numberDecimal"]) {
                            company['dataValues']['latestStockPrice'] = latestStockPrice.data.price["$numberDecimal"];
                        } else {
                            company['dataValues']['latestStockPrice'] = -1;
                        }
                        return company;
                    }))
                }  
            })
            Promise.all(promises)
            .then((companies) => response.json(companies))
            .catch((error) => {
                console.log("Error: ",error);
                response.sendStatus(500);
            })
        })
        .catch((error) => {
            console.error('Error: ', error);
            response.sendStatus(404);
        })
});

/**
 * @swagger
 * /api/v1.0/market/company/delete/{code}:
 *      delete:
 *          summary: Delete the company and associated stocks
 *          tags: [Company]
 *          parameters:
 *              - in: path
 *                name : code
 *                schema:
 *                  type: number
 *                required: true
 *                description: The company code
 *          responses:
 *              200:
 *                  description: Company Deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *                              items:
 *                                  $ref: '#/components/schemas/Company'
 *              404:
 *                  description: Company not found
 *              500:
 *                  description: Unable to delete
 */
router.delete("/delete/:code", cors(corsOptions), (request, response) => {
    deleteCompany(request.params.code)
        .then((deletedCompanyCount) => {
            deleteStocks(request.params.code)
            .then((deletedStockCount) => {
                if (deletedCompanyCount) {
                    response.json({
                        message: "Company has been deleted along with it's "+deletedStockCount?.deletedCount? deletedStockCount?.deletedCount : 0 +" Stocks"
                    })
                }
                else {
                    response.sendStatus(404);
                }
            })
        })
        .catch((error) => {
            console.error("Error: ", error);
            response.json({
                message: "Deletion Failed"
            })
            response.sendStatus(500);
        })
});

export { router };