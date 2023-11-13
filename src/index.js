import express from 'express';
import dotenv from 'dotenv';
import configViewEngine from './config/viewEngine';
import initWebRoute from './route/web';
import connection from './config/connectDB';
import bodyParser from 'body-parser';
import RedisStore from "connect-redis";
import session from "express-session";
import { createClient } from "redis";
import categoryModel from './services/categoryModel';


const app = express();
dotenv.config();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// Initialize client.
let redisClient = createClient();
redisClient.connect().catch(console.error);

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});
app.use(
  session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: "keyboard cat",
  })
);

// all routes bien cuc bo
app.use("*", async function  (req, res, next) {
  // gan vao bien  locals de cac trang views deu nhan duoc
  // thong tin user
  res.locals.user = req?.session?.user || null;
  res.locals.cart = req?.session?.cart || null;
  
  //goi danh muc tu csdl de hien thi len header trang chu
  let listCategory = await categoryModel.getAllCategory();
  res.locals.categories = listCategory;
  // console.log(res.locals.categories);
  next();
});

configViewEngine(app);

initWebRoute(app);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})