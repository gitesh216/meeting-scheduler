import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { PORT } from './config/env.js';

async function startServer() {
    app.listen(PORT, async () => {
        await connectDatabase();
        console.log(`[server]: Running on port ${PORT}`)
    });
}


startServer();