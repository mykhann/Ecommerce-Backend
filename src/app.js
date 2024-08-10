import express, { urlencoded } from 'express';
import { dbConnect } from './db/index.js';
import routes from "./routes/user.route.js"
import productRoutes from "./routes/product.route.js"
import orderRoutes from "./routes/order.route.js"
import cors from "cors"
import cookieParser from 'cookie-parser';
const app = express();

// database connections 
dbConnect()
// using middlewares 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}));
app.use(express.json({
    limit:"16kb"
}))
app.use(cookieParser());

app.use(express.urlencoded());
// app.use(express.static("public"))



// user routes 
app.use("/api/v1/users",routes);

// product routes
app.use("/api/v1/products",productRoutes)

// order routes 
app.use("/api/v1/orders",orderRoutes)


// Server
app.listen(process.env.PORT,(req,res)=>{
    console.log(`listening on http:localhost:${process.env.PORT}`);

})
export {app}