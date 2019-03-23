import {Router,Request, Response,NextFunction} from "express";
import axios from "axios";
import * as qs from 'querystring';
import connection from "../db/connection";
import { SigninInfo } from "../db/entity/SigninInfo";
import {MoreThanOrEqual} from "typeorm";
const router = Router();

router.post('/', function(req:Request, res:Response,next:NextFunction) {
    let args=req.body
    connection.then(
    async conn=>{
        const signinInfoRepository = conn.getRepository(SigninInfo);
        const signinfo=signinInfoRepository.create({"user":args.openId,"signTime":new Date(parseInt(args.signTime))})
        signinInfoRepository.save(signinfo);
        res.json({"message":"success"});
    })
});

router.get('/day', function(req:Request, res:Response,next:NextFunction) {
    let args=req.query
    console.log(args)
    connection.then(
    async conn=>{
        const signinInfoRepository = conn.getRepository(SigninInfo);
        const signinfos=await signinInfoRepository.find({
            relations:["user"],
            where:{signTime:MoreThanOrEqual(new Date(parseInt(args.date)))},
        });
        res.json({"message":"success","data":signinfos});
    })
});

router.get('/month', function(req:Request, res:Response,next:NextFunction) {
    let args=req.query
    connection.then(
    async conn=>{
        const signinInfoRepository = conn.getRepository(SigninInfo);
        const signinfo=signinInfoRepository.create({"user":args.openId,"signTime":new Date(parseInt(args.signTime))})
        signinInfoRepository.save(signinfo);
        res.json({"message":"success"});
    })
});

router.get('/all', function(req:Request, res:Response,next:NextFunction) {
    let args=req.query
    connection.then(
    async conn=>{
        const signinInfoRepository = conn.getRepository(SigninInfo);
        const signinfo=signinInfoRepository.create({"user":args.openId,"signTime":new Date(parseInt(args.signTime))})
        signinInfoRepository.save(signinfo);
        res.json({"message":"success"});
    })
});

export default router;