import pg from "pg";
import dotenv from "dotenv";

const { Pool } = pg;

dotenv.config();

const connection = new Pool({
    
 connectionString: process.env.DATANASE_URL,
});
 

export const db = connection 