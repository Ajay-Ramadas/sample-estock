import mongoose from "mongoose";
import { Stock } from "../models/Stock.js";
import { dbUrl } from '../config/mongo.config.js';

mongoose.connect(dbUrl);
const db = mongoose.connection;

db.on('error',(error) => console.log(error));
db.once('open', () => console.log("Connected to Mongo Database"));

export function addNewStock(companyCode, price, date = new Date()) {
    date = new Date(date);
    return Stock.create({
        price: price,
        companyCode: companyCode,
        date: date
    })
}

export function getStocks(companyCode, startDate, endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    try {
        endDate.setDate(endDate.getDate()+1)
    } catch(error) {
        throw "Date Error"
    }
    return Stock.find({
        companyCode: companyCode,
        date: {
            $gte: startDate,
            $lte: endDate
        }
    })
    // .explain('allPlansExecution');
}

export function getAllStocks() {
    return Stock.find();
}

export function deleteStocks(companyCode) {
    return Stock.deleteMany({
        companyCode: companyCode
    })
}

export function latestStock(companyCode) {
    return Stock.findOne({ companyCode: companyCode }).sort({date: -1});
}