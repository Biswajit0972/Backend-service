import 'dotenv/config';
import { app } from './src/app.js';
import { dbConnection } from './src/db/databaseConnection.js';

dbConnection().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
});

// app.listen(3000, () => {
//     console.log("Server started on port 3000");
// })