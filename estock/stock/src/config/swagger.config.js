export const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "E-Stock API",
            version: "1.0.0",
            description: "API to handle E-Stock Market's Stock"
        },
        servers: [
            {
                url: "http://localhost:8080"
            }
        ]
    },
    apis: ["/var/www/stock/src/routes/StockRouter.js", "/var/www/stock/src/models/Stock.js"]
}

/**
 * @swagger
 * tags:[
 * {
 *  name: Company
 *  desciption: The Company Managing API
 * },
 * {
 *  name: Stock
 *  desciption: The Stock Managing API
 * } 
 * ]
 */