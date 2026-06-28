import { app } from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

connectDB().then(() => {
  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
}).catch((error) => {
  console.error('Database connection failed', error);
});
