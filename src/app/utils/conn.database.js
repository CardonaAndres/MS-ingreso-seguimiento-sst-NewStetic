import sql from 'mssql';

export class ConnDataBase {
    constructor() {
        this.pool = null;
        this.databases = [
            String(process.env.DB_COMP_NAME),
            String(process.env.DB_SST_NAME)
        ];
    }

    connect(databaseName) {
        if (!this.databases.includes(databaseName)) {
            console.log(`La base de datos ${databaseName} no está soportada.`);
            return null;
        }

        switch(databaseName) {
            case String(process.env.DB_COMP_NAME):
                try {
                    const pool = new sql.ConnectionPool({
                        user: process.env.DB_COMP_USER,
                        password: process.env.DB_COMP_PASSWORD,
                        server: process.env.DB_COMP_SERVER,
                        options: {
                            encrypt: true,
                            trustServerCertificate: true 
                        }
                    });

                    pool.on('connect', () => console.log('✓ Conexión exitosa a COMPESACIONES'));
                    pool.on('error', (err) => console.error('Error en la conexión a COMPESACIONES:', err.message));

                    this.pool = pool.connect();
                    return pool;

                } catch (err) {
                    console.error('Error al conectar a la base de datos:', err);
                    throw err;
                } 

            case String(process.env.DB_SST_NAME):
                try {
                    const pool = new sql.ConnectionPool({
                        user: process.env.DB_SST_USER,
                        password: process.env.DB_SST_PASSWORD,
                        server: process.env.DB_SST_SERVER,
                        database: process.env.DB_SST_NAME,
                        options: {
                            encrypt: false,
                            trustServerCertificate: true 
                        }
                    });

                    pool.on('connect', () => console.log('✓ Conexión exitosa a SST'));
                    pool.on('error', (err) => console.error('Error en la conexión a SST: ', err.message));

                    this.pool = pool.connect();
                    return pool;

                } catch (err) {
                    console.error('Error al conectar a la base de datos:', err);
                    throw err;
                } 
                
            default:
                console.log(`La base de datos ${databaseName} no está soportada.`);
                return null;
        }
    }
}