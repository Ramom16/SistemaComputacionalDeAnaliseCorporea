import 'dotenv/config'
import mysql from 'mysql2/promise';


// Padrão de projeto utilizado na classe de conexão com banco de dados : SINGLETON
class Database {
    static #instance = null;
    #pool;

    #createPool(){
        this.#pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            port : process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            password : process.env.DB_PASSWORD,
            waitForConnections: true,
            connectionLimit: 100,
            queueLimit: 0
        });
    };

    static getInstance(){
        if(!Database.#instance){
            Database.#instance= new Database();
            Database.#instance.#createPool();
        }
        return Database.#instance;
    }

    getPool(){
        return this.#pool;
    }
};

export const connection = Database.getInstance().getPool();