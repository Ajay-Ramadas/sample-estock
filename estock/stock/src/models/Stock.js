import { Decimal128 } from "mongodb";
import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *      schemas:
 *          Stock:
 *              type: Object
 *              required:
 *                  - price
 *                  - date
 *                  - companyCode
 *              properties:
 *                  price:
 *                      type: number
 *                      description: The value of the stock
 *                  date:
 *                      type: Date
 *                      description: The date the stock was added
 *                  companyCode:
 *                      type: number
 *                      description: The company holding the stock
 *              example:
 *                  price: 50.00
 *                  date: 2022-06-09T14:54:30.820Z
 *                  companyCode: 17
 */
export const stockSchema = new mongoose.Schema({
    price: {
        type: Decimal128,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    companyCode: {
        type: Number,
        required: true
    }
});

stockSchema.index({ companyCode: 1, date: 1 });
export const Stock = new mongoose.model('Stock', stockSchema);
// Stock.cleanIndexes()