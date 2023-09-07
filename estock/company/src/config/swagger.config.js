export const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "E-Stock API",
            version: "1.0.0",
            description: "API to handle E-Stock Market"
        },
        servers: [
            {
                url: "http://localhost:5080"
            }
        ]
    },
    apis: ["/var/www/company/src/routes/CompanyRoutes.js", "/var/www/company/src/models/Company.js"]
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