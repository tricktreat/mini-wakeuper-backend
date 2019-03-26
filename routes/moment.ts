import "reflect-metadata";
import {Router,Request, Response,NextFunction} from "express";
import connection from "../db/connection";
import { MomentInfo } from "../db/entity/TbMomentInfo";
import { CommentInfo } from "../db/entity/TbCommentInfo";
import { LikeInfo } from "../db/entity/TbLikeInfo";
const router = Router();

router.get('/', function(req:Request, res:Response,next:NextFunction) {
    let args=req.query
    connection.then(
    async conn=>{
        const momentRepository = conn.getRepository(MomentInfo);
        const moments=await momentRepository.find({
            relations:["user","likeInfos","commentInfos","commentInfos.fromUser"],
            // where:{},
            skip:args.offset,
            take:args.limit,
            order:{
                createTime:"DESC"
            }
        })
        res.json({message:"success",data:moments});
    })
});

router.get('/addmoment', function(req:Request, res:Response,next:NextFunction) {
    let args=req.query
    connection.then(
    async conn=>{
        const momentRepository = conn.getRepository(MomentInfo);
        let moment=momentRepository.create(args)
        await momentRepository.save(moment)
        res.json({message:"success",data:moment});
    })
});

export default router;