import "reflect-metadata";
import {Router,Request, Response,NextFunction} from "express";
import axios from "axios";
import * as qs from 'querystring';
import connection from "../db/connection";
import { UserInfo } from "../db/entity/TbUserInfo";
import {MoreThanOrEqual, MoreThan, Like} from "typeorm";
import { SigninInfo } from "../db/entity/TbSigninInfo";
const router = Router();

router.get('/', function(req:Request, res:Response,next:NextFunction) {
    let args = req.query
    connection.then(
        async conn=>{
            const userInfoRepository = conn.getRepository(UserInfo);
            const signInfoRepository = conn.getRepository(SigninInfo);
            let now = new Date()
            let year=now.getFullYear()
            let month = now.getMonth()+1
            let date = now.getDate()
            let todaysigninfo=await signInfoRepository.find({
              where:{user:args.openId,signTime:MoreThanOrEqual( year + "-" + (month[1] ? month : '0' + month) + "-" + (date[1] ? date : '0' + date))},
            })
            let allsigninfo=await signInfoRepository.find({
              where:{user:args.openId},
            })
            const userinfo=await userInfoRepository.findOne({
              relations:["tolikeinfos"],
              join:{
                  alias: "userinfo",
              },
              where:args,
            })
            userinfo['signinfos']=todaysigninfo
            userinfo["tags"]=userinfo["tag"].split(';',3)
            delete userinfo.tag
            userinfo["corn"]=allsigninfo.reduce((prev,cur)=>{
              return prev+cur.corn
            },0)
            userinfo["like"]=userinfo.tolikeinfos.length
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

router.get('/member', function(req:Request, res:Response,next:NextFunction) {
  let args = req.query
  connection.then(
      async conn=>{
          const userInfoRepository = conn.getRepository(UserInfo);
          let where={}
          where["member"]=MoreThan(0)
          if(args.patten){
            where["name"]=Like("%"+args.patten+"%")
          }
          const userinfo=await userInfoRepository.find({
            where:where,
            order: {
              member: "DESC",
              registerTime:"ASC"
          }
          });
          res.json({message:"success",data:userinfo});
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
            // console.log(new Date().toLocaleDateString())
            const userInfoRepository = conn.getRepository(UserInfo);
            const signInfoRepository = conn.getRepository(SigninInfo);
            let now = new Date()
            let year=now.getFullYear()
            let month = now.getMonth()+1
            let date = now.getDate()
            let todaysigninfo=await signInfoRepository.find({
              where:{user:openId,signTime:MoreThanOrEqual( year + "-" + (month[1] ? month : '0' + month) + "-" + (date[1] ? date : '0' + date))},
            })
            let allsigninfo=await signInfoRepository.find({
              where:{user:openId},
            })
            let userinfo=await userInfoRepository.findOne({
              relations:["tolikeinfos"],
              join:{
                  alias: "userinfo",
              },
              where:{openId:openId},
            })
            if(!userinfo){
              userinfo=userInfoRepository.create({openId:openId})
              userInfoRepository.save(userinfo);
              userinfo["tolikeinfos"]=[];
            }
            userinfo["signinfos"]=todaysigninfo;
            userinfo["tags"]=userinfo["tag"].split(';',3)
            delete userinfo.tag
            userinfo["corn"]=allsigninfo.reduce((prev,cur)=>{
              return prev+cur.corn
            },0)
            userinfo["like"]=userinfo.tolikeinfos.length
            res.json({message:"success",data:userinfo});
          }
        )
      }else{
        res.json({message:"fail",data:response.data});
      }
    })
});

export default router;