import 'dotenv/config';
import express from 'express';
import { logger } from './logger';
import cors from 'cors';
import axios from 'axios';
import cheerio from 'cheerio';
import cron from 'node-cron';
import { Item } from './types/item';
import { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

const baseUrl = 'https://kolesa.kz/cars/hyundai/sonata/almaty/?auto-car-grbody=1';
let currentPage = 1;
const maxPages = 25;

const fetchData = async (page:number): Promise<string | any> => {
  try{
    const responce = await axios.get(`${baseUrl}`);
    return responce.data;

  }catch(e){
    console.log(e);
    return null;
  }
}

const parseData = (html:string) : Item[] => {
  const $ = cheerio.load(html);

  const items: Item[] = [];

  $('.a-card__info').each((index, element) => {
    const title = $(element).find('.a-card__link').text().trim();
    const price = $(element).find('.a-card__price').text().trim();
    const link = $(element).find('.a-card__link').attr('href');
    if (title && price && link) {
      items.push({ title, price, link: `https://kolesa.kz/${link}` });
    }
  });

  return items;
}

app.get('/kolesa-parse', async (req: Request, res: Response) => {
  const html = await fetchData(currentPage);
  if (html) {
    const data = parseData(html);
    res.json(data);
  } else {
    res.status(500).send('Error fetching data');
  }
});

cron.schedule('0 0 1 * *', async () => {
  console.log(`Running cron job for page ${currentPage}`);
  const html = await fetchData(currentPage);

  if(html){
    const data = parseData(html);
    console.log(`Data for page ${currentPage}:`, data);
  }
});

app.use(cors());
app.use(logger);
app.use(express.json());





app.listen(PORT, () => {
  console.log(`Server runs at http://localhost:${PORT}`);
});
