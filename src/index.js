import 'dotenv/config';
import { app } from './app.js';
import { dbConnection } from './db/databaseConnection.js';

dbConnection().then(app.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${process.env.PORT}/`)
}))