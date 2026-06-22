import express, { Express } from 'express';
import userRouter from './routers/user.router.js';

const app: Express = express();

app.use(express.json()); // deserialize json body to javascript object.
app.use(express.text()); 
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok!',
    timestamp: new Date().toISOString()
  })

});

app.use("/api/users", userRouter);

export { app };