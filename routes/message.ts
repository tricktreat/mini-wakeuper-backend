import "reflect-metadata";
import {Router,Request, Response,NextFunction} from "express";
import connection from "../db/connection";
import { FormId } from "../db/entity/TbFormid";
import axios from "axios";
import { LessThanOrEqual, MoreThanOrEqual } from "typeorm";

const router = Router();

router.post('/put', function(req:Request, res:Response,next:NextFunction) {
    let args=req.body
    const formids: FormId[] = [];
    for(let formid of args.formids){
        const data = new FormId();
        data.openId=args.openId;
        data.formId=formid;
        data.createTime=new Date();
        formids.push(data);
    }
    connection.then(
        async conn=>{
            conn.manager.save(formids)
            res.json({"message":"success"});
        })
});

router.post('/send',function(req:Request, res:Response,next:NextFunction){
    //3597e6cfb8339a61cacb77ced622d3f3
    //wxce0af3f23f9eee19
    let args = req.body;
    if(typeof args.tousers =='string'){
        args.tousers=[args.tousers]
    }
    let respon={success:[],fail:[]}

    axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxce0af3f23f9eee19&secret=3597e6cfb8339a61cacb77ced622d3f3' )
    .then(function(response){
      let access_token=response.data.access_token
      if(access_token){
        connection.then(
          async conn=>{
            const formIdRepository = conn.getRepository(FormId);
            for(let touser of args.tousers){
                let formid=await formIdRepository.findOne({
                    where:{
                        createTime:MoreThanOrEqual(new Date(new Date().getTime()-7*24*60*60*1000)),
                        touser:touser
                    }
                })
                if(!formid){
                    respon.fail.push(touser)
                    continue
                }
                let senddata={
                    access_token:access_token,
                    touser:formid.openId,
                    template_id:args.template_id,
                    page:args.page,
                    form_id:formid.formId,
                    data: args.data,
                    emphasis_keyword: args.emphasis_keyword
                }
                formIdRepository.remove(formid)
                await axios.post('https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='+access_token,senddata).then(function(response){
                    respon.success.push(touser)
                })
            }
            res.json(respon)
          }
        )
      }
    })
})

router.post('/sendall',function(req:Request, res:Response,next:NextFunction){
    //3597e6cfb8339a61cacb77ced622d3f3
    //wxce0af3f23f9eee19
    let args = req.body;
    let respon={success:[],fail:[]}

    axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxce0af3f23f9eee19&secret=3597e6cfb8339a61cacb77ced622d3f3' )
    .then(function(response){
      let access_token=response.data.access_token
      if(access_token){
        connection.then(
          async conn=>{
            const formIdRepository=conn.getRepository(FormId)
            const qb=formIdRepository.createQueryBuilder("form_id")
            const formids = await qb.where({
                createTime:MoreThanOrEqual(new Date(new Date().getTime()-7*24*60*60*1000)),
            })
            .groupBy("form_id.openId")
            .getMany();
            if(formids.length&&formids.length>0){
                for(let formid of formids){
                    let senddata={
                        access_token:access_token,
                        touser:formid.openId,
                        template_id:args.template_id,
                        page:args.page,
                        form_id:formid.formId,
                        data: args.data,
                        emphasis_keyword: args.emphasis_keyword
                    }
                    formIdRepository.remove(formid)
                    await axios.post('https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='+access_token,senddata).then(function(response){
                        if(response.data.errcode==0){
                            respon.success.push(formid.openId)
                        }else{
                            respon.fail.push(formid.openId)
                        }
                    })
                }
            }
            res.json(respon)
          }
        )
      }
    })
})

export default router;