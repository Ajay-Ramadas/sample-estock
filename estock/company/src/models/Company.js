import { DataTypes, Sequelize } from 'sequelize';
import { dbDetails } from '../config/pg.config.js';

const sequelize = new Sequelize(
    dbDetails.DB_SCHEMA,
    dbDetails.DB_USER,
    dbDetails.DB_PASSWORD,
    {
        host: dbDetails.DB_HOST,
        port: dbDetails.DB_PORT,
        dialect: 'postgres',
        dialectOptions: {}
    }
);

sequelize.authenticate()
    .then(() => console.info('Connection has been establised Successfully'))
    .catch((error) => console.error('Connection failed. Error:', error))

/**
 * @swagger
 * components:
 *      schemas:
 *          Company:
 *              type: Object
 *              required:
 *                  - name
 *                  - ceo
 *                  - stock
 *                  - website
 *                  - turnover
 *              properties:
 *                  code:
 *                      type: number
 *                      description: The auto-generated id of each Company
 *                      hidden: true
 *                  name:
 *                      type: string
 *                      description: The Name of the Company
 *                  ceo:
 *                      type: string
 *                      description: The Name of the CEO
 *                  website:
 *                      type: string
 *                      description: The URL to the Company's website
 *                  stock_exchange:
 *                      type: string
 *                      description: The Stock Exchange it is enlisted in
 *                  turnover:
 *                      type: decimal
 *                      description: The turnover of the Company
 *                  latestStockPrice:
 *                      type: decimal
 *                      description: The current stock price of the company
 *              example:
 *                  name: Cognizant Tech Services
 *                  ceo: Brian Humphries
 *                  stock: NSE
 *                  website: www.cognizant.com
 *                  turnover: 414314138833.00
 *                  latestStockPrice: 100.00
 */
export const Company = sequelize.define('Company', {
    code: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false, unique: true},
    name: { type: DataTypes.STRING, allowNull: false },
    ceo: { type: DataTypes.STRING, allowNull: false },
    website: { type: DataTypes.STRING, allowNull: false },
    stock_exchange: { type: DataTypes.STRING, allowNull: false },
    turnover: { type: DataTypes.DECIMAL, allowNull: false }
},
{
    freezeTableName: true,
    timestamps: false
});

sequelize.sync();