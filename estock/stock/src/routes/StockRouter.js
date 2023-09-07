import express from 'express';
import { corsOptions } from '../config/cors.config.js';
import { addNewStock, deleteStocks, getAllStocks, getStocks, latestStock } from '../services/StockService.js';
import cors from 'cors';
import {getCompanyInfo} from '../services/StockHttpService.js'

const router = express.Router();

/**
 * @swagger
 * /api/v1.0/market/stock/add/{companyCode}:
 *      post:
 *          summary: Add a new stock
 *          tags: [Stock]
 *          parameters:
 *              - in: path
 *                name: companyCode
 *                required: true
 *                schema:
 *                      type: number
 *                      description: The Company to which the Stocks will be added
 *          responses:
 *              200:
 *                  description: Stock added Successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: string
 *              404:
 *                  description: Company not found
 *              500:
 *                  description: Stock addition failed
 */
router.post('/add/:companyCode', (request, response) => {
    getCompanyInfo(request.params.companyCode)
        .then((company) => {
            if (company) {
                addNewStock(request.params.companyCode, request.body['price'], request.body['date'])
                    .then(() => {
                        response.json({
                            message: "Stock added"
                        })
                    })
                    .catch((error) => {
                        console.error("Stock addition failed. Error: ", error);
                        response.sendStatus(500);
                    })
            } else {
                response.sendStatus(404);
            }
        })
});

/**
 * @swagger
 * /api/v1.0/market/stock/get/{companyCode}/{startDate}/{endDate}:
 *      get:
 *          summary: Get Stocks within Date Range
 *          tags: [Stock]
 *          parameters:
 *              - in: path
 *                name: companyCode
 *                required: true
 *                schema:
 *                      type: number
 *                      description: The Company to which the Stocks will be added
 *              - in: path
 *                name: startDate
 *                required: true
 *                schema:
 *                      type: string
 *                      description: The date range start date
 *              - in: path
 *                name: endDate
 *                required: true
 *                schema:
 *                      type: string
 *                      description: The date range end date
 *          responses:
 *              200:
 *                  description: Stocks found successfully
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/Stock'
 *              404:
 *                  description: No Stocks found
 *              500:
 *                  description: Get Stocks Failed
 */
router.get('/get/:companyCode/:startDate/:endDate', (request, response) => {
    getStocks(request.params.companyCode, request.params.startDate, request.params.endDate)
        .then((stocks) => {
            console.log(stocks)
            if (!Object.keys(stocks).length) {
                response.sendStatus(404);
            } else {
                response.json(stocks)
            }
        })
        .catch((error) => {
            console.error("Cannot fetch stocks. Error: ", error)
            response.sendStatus(500);
        });

})

router.get('/all', (_req, res) => {
    getAllStocks()
        .then((result) => {
            res.json(result);
        })
})

router.delete('/delete/:companycode', cors(corsOptions), (request, response) => {
    deleteStocks(request.params.companycode)
        .then((res) => {
            response.json({
                message: res.deletedCount ? res.deletedCount + " Stock(s) Deleted" : "No Stocks Deleted"
            })
        })
        .catch((error) => {
            console.error(error);
            response.sendStatus(500);
        })
})

router.get('/latest/:companyCode', (request, response) => {
    const latestStockPrice = latestStock(request.params.companyCode);
    latestStockPrice.then((latestStock) => {
        if (latestStock) {
            response.json(latestStock);
        } else {
            response.json(0);
        }
    })
    .catch((err)=>{
        response.sendStatus(404);
    })
})

export { router };