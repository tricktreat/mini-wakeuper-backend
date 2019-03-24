import "reflect-metadata";
import {Router,Request, Response,NextFunction} from "express";
import connection from "../db/connection";
import { SwiperImage } from "../db/entity/TbSwiperImage";
const router = Router();

router.get('/', function(req:Request, res:Response,next:NextFunction) {
    let args=req.query
    connection.then(
    async conn=>{
        const swiperImageRepository = conn.getRepository(SwiperImage);
        const wiperimages=await swiperImageRepository.find()
        res.json({message:"success",data:wiperimages});
    })
});

export default router;