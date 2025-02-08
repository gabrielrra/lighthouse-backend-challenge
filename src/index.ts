import express from 'express';
import { db } from './db/database';
import { products } from './db/schema';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  const a = await db.select().from(products);
  res.json(a);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
