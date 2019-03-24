import {Router,Request, Response,NextFunction} from "express";
import axios from "axios";
import * as qs from 'querystring';
import connection from "../db/connection";
import { SigninInfo } from "../db/entity/TbSigninInfo";
import { UserInfo } from "../db/entity/TbUserInfo";
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
    connection.then(
    async conn=>{
        const signinInfoRepository = conn.getRepository(SigninInfo);
        const signinfos=await signinInfoRepository.find({
            relations:["user"],
            join:{
                alias: "signinfo",
            },
            where:{signTime:MoreThanOrEqual(new Date(parseInt(args.date)))},
            order: {
                signTime: "ASC",
            }
        });
        res.json({message:"success",data:signinfos});
    })
});

router.get('/month', function(req:Request, res:Response,next:NextFunction) {
    let args=req.query
    connection.then(
    async conn=>{
        const userInfoRepository = conn.getRepository(UserInfo);
        const userinfos=await userInfoRepository.find({
            relations:["signinfos"],
            join:{
                alias: "userinfo",
            },
            where:{"userinfo.signinfos.signTime":MoreThanOrEqual(new Date(parseInt(args.month)))},
        });
        userinfos.sort((a,b)=>{
            if(a.signinfos.length>b.signinfos.length){
                return 1
            }else{
                return -1
            }
        })
        res.json({message:"success",data:userinfos});
    })
});

router.get('/all', function(req:Request, res:Response,next:NextFunction) {
    connection.then(
    async conn=>{
        const userInfoRepository = conn.getRepository(UserInfo);
        const userinfos=await userInfoRepository.find({
            relations:["signinfos"],
            join:{
                alias: "userinfo",
            },
        });
        userinfos.sort((a,b)=>{
            if(a.signinfos.length>b.signinfos.length){
                return 1
            }else{
                return -1
            }
        })
        res.json({message:"success",data:userinfos});
    })
});

export default router;