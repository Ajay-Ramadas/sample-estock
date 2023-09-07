// export const dbUrl = process.env.pgConn || 'postgres://postgres@localhost:5432/estock';
export const dbDetails = {
    DB_SCHEMA: process.env.DB_SCHEMA || 'postgres',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 5432,
}