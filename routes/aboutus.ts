import "reflect-metadata";
import {Router,Request, Response,NextFunction} from "express";
import connection from "../db/connection";
import { AboutUs } from "../db/entity/TbAboutUs";
const router = Router();

router.get('/', function(req:Request, res:Response,next:NextFunction) {
    let args=req.query
    connection.then(
    async conn=>{
        const aboutUsRepository = conn.getRepository(AboutUs);
        const aboutus=await aboutUsRepository.find()
        res.json({message:"success",data:aboutus});
    })
});

export default router;