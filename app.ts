import * as express from "express";
import {Request, Response} from "express";
import * as bodyParser from  "body-parser";
import userinfo from "./routes/userinfo";
import signin from "./routes/signin";
const app = express();
app.use(bodyParser.json());
app.use('/userinfo',userinfo);
app.use('/signin',signin);

app.get('/',function(req: Request, res: Response){
	res.status(200).send("wakeuper")
});


app.listen(8899);