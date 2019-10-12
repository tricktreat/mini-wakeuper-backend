import "reflect-metadata";
import * as express from "express";
import {Request, Response} from "express";
import * as bodyParser from  "body-parser";
import userinfo from "./routes/userinfo";
import signin from "./routes/signin";
import aboutus from "./routes/aboutus";
import swiperimage from "./routes/swiperimage";
import moment from "./routes/moment";
import message from "./routes/message";

const app = express();
app.use(bodyParser.json());
app.use('/userinfo',userinfo);
app.use('/signin',signin);
app.use('/aboutus',aboutus);
app.use('/swiperimage',swiperimage);
app.use('/moment',moment);
app.use('/formid',message);

app.get('/',function(req: Request, res: Response){
	res.status(200).send("wakeuper")
});

app.listen(8888);