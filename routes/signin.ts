import "reflect-metadata";
import {Router,Request, Response,NextFunction} from "express";
import axios from "axios";
import * as qs from 'querystring';
import connection from "../db/connection";
import { SigninInfo } from "../db/entity/TbSigninInfo";
import { UserInfo } from "../db/entity/TbUserInfo";
import {MoreThanOrEqual, Not} from "typeorm";
const router = Router();

router.post('/', function(req:Request, res:Response,next:NextFunction) {
    let args=req.body
    // console.log("签到参数："+args.signTime)
    connection.then(
    async conn=>{
        const signinInfoRepository = conn.getRepository(SigninInfo);
        const signinfo=signinInfoRepository.create({"user":args.openId,"signTime":new Date(args.signTime)})
        console.log(signinfo)
        signinInfoRepository.save(signinfo);
        res.json({"message":"success"});
    })
});

router.get('/day', function(req:Request, res:Response,next:NextFunction) {
    let args=req.query
    // console.log("day："+args.date)
    connection.then(
    async conn=>{
        const signinInfoRepository = conn.getRepository(SigninInfo);
        const signinfos=await signinInfoRepository.find({
            relations:["user"],
            join:{
                alias: "signinfo",
            },
            where:{signTime:MoreThanOrEqual(args.date)},
            order: {
                signTime: "ASC",
            }
        });
        res.json({message:"success",data:signinfos});
    })
});

router.get('/month', function(req:Request, res:Response,next:NextFunction) {
    let args=req.query
    // console.log("month："+args.month)
    connection.then(
    async conn=>{
        const userInfoRepository = conn.getRepository(UserInfo);
        const userinfos=await userInfoRepository.find({
            relations:["signinfos"],
            join:{
                alias: "userinfo",
            },
            where:{avatarUrl:Not("")}
            // where:{"userinfo.signinfos.signTime":MoreThanOrEqual(args.month)},
        });
        userinfos.filter((userinfo)=>{
            let _signinfos=[]
            for(let signinfo of userinfo.signinfos){
                // 这里构造时间加不加GMT应该没什么区别的，但是不加时间就不对了
                if(signinfo.signTime>new Date(args.month+' GMT+08')){
                    _signinfos.push(signinfo)
                }
                userinfo.signinfos=_signinfos
            }
        })
        userinfos.sort((a,b)=>{
            if(a.signinfos.length>b.signinfos.length){
                return -1
            }else{
                return 1
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
            where:{avatarUrl:Not("")}
        });
        userinfos.sort((a,b)=>{
            if(a.signinfos.length>b.signinfos.length){
                return -1
            }else{
                return 1
            }
        })
        res.json({message:"success",data:userinfos});
    })
});

export default router;