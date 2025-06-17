import sql from 'mssql';

export const conn_db = async () => {

    try {
        const pool = await sql.connect({
            user : process.env.DB_USER,
            password : process.env.DB_PASSWORD,
            server: process.env.DB_SERVER,
            options: {
                encrypt: true,
                trustServerCertificate: true 
            }
        });

        return pool

    } catch (err) {
        throw new Error(err.message);
    }
}