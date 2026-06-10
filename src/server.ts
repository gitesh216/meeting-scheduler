import { app } from './app.js';
import { PORT } from './config/env.js';

async function startServer() {
    app.listen(PORT, () => {
        console.log(`[server]: Running on port ${PORT}`)
    });
}


startServer();