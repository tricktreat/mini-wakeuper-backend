import {Router,Request, Response,NextFunction} from "express";
import axios from "axios";
import * as qs from 'querystring';
import connection from "../db/connection";
import { UserInfo } from "../db/entity/TbUserInfo";
import {MoreThanOrEqual} from "typeorm";
const router = Router();

router.get('/', function(req:Request, res:Response,next:NextFunction) {
    let args = req.query
    connection.then(
        async conn=>{
            const userInfoRepository = conn.getRepository(UserInfo);
            const userinfo=await userInfoRepository.findOne({
              relations:["signinfos","likeinfos"],
              join:{
                  alias: "userinfo",
              },
              where:Object.assign(args,{"userinfo.signinfos.signTime":MoreThanOrEqual(new Date().setHours(0,0,0,0))}),
            })
            userinfo["corn"]=userinfo.signinfos.reduce((prev,cur)=>{
              return prev+cur.corn
            },0)
            userinfo["like"]=userinfo.likeinfos.reduce((prev,cur)=>{
              return prev+cur.corn
            },0)
            res.json({message:"success",data:userinfo});
            res.json({message:"success",data:userinfo});
          }
    )
});

router.post('/updateuser', function(req:Request, res:Response,next:NextFunction) {
    let args = req.body
    connection.then(
        async conn=>{
            const userInfoRepository = conn.getRepository(UserInfo);
            const userinfo=await userInfoRepository.findOne(args.openId);
            userInfoRepository.merge(userinfo, args);
            userInfoRepository.save(userinfo);
            res.json({message:"success"});
          }
    )
});

router.get('/register', function(req:Request, res:Response,next:NextFunction) {
    //3597e6cfb8339a61cacb77ced622d3f3
    //wxce0af3f23f9eee19
    let args = req.query;
    Object.assign(args,{grant_type: "authorization_code" });

    axios.get('https://api.weixin.qq.com/sns/jscode2session?' + qs.stringify(args))
    .then(function(response){
      let openId=response.data.openid
      if(openId){
        connection.then(
          async conn=>{
            const userInfoRepository = conn.getRepository(UserInfo);
            let userinfo=await userInfoRepository.findOne({
              relations:["signinfos","likeinfos"],
              join:{
                  alias: "userinfo",
              },
              where:{"userinfo.signinfos.signTime":MoreThanOrEqual(new Date().setHours(0,0,0,0))},
            })
            if(!userinfo){
              userinfo=userInfoRepository.create({"openId":openId})
              userInfoRepository.save(userinfo);
              userinfo["signinfos"]=[]
              userinfo["likeinfos"]=[]
            }
            userinfo["corn"]=userinfo.signinfos.reduce((prev,cur)=>{
              return prev+cur.corn
            },0)
            userinfo["like"]=userinfo.likeinfos.reduce((prev,cur)=>{
              return prev+cur.corn
            },0)
            res.json({message:"success",data:userinfo});
          }
        )
      }else{
        res.json({message:"fail",data:response.data});
      }
    })
});

export default router;