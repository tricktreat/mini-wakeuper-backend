import {Router,Request, Response,NextFunction} from "express";
import axios from "axios";
import * as qs from 'querystring';
import connection from "../db/connection";
import { UserInfo } from "../db/entity/UserInfo";
const router = Router();

router.get('/', function(req:Request, res:Response,next:NextFunction) {
    let args = req.body
    connection.then(
        async conn=>{
            const userInfoRepository = conn.getRepository(UserInfo);
            const userinfo=await userInfoRepository.findOne(args.openId);
            userInfoRepository.merge(userinfo, args);
            userInfoRepository.save(userinfo);
            res.json({"message":"success"});
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
            res.json({"message":"success"});
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
            const userinfo=await userInfoRepository.findOne(openId)
            if(!userinfo){
              const newuser=userInfoRepository.create({"openId":openId})
              userInfoRepository.save(newuser);
              res.json({"openid":openId});
            }
            res.json(userinfo);
          }
        )
      }else{
        res.json(response.data);
      }
    })
});

export default router;