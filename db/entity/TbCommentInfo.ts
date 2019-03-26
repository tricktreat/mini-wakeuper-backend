import "reflect-metadata";
import {Entity, PrimaryColumn, Column, BaseEntity,ManyToOne,JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import { UserInfo } from "./TbUserInfo";
import { MomentInfo } from "./TbMomentInfo";

@Entity()
export class CommentInfo extends BaseEntity {

    // @PrimaryColumn()
    // openId: string;

    @PrimaryColumn()
    createTime:Date;

    @Column()
    content: string;

    @ManyToOne(type => UserInfo, user => user.fromlikeinfos,{primary:true})
    @JoinColumn({ name: 'from' })
    fromUser:string;

    @ManyToOne(type => UserInfo, user => user.tolikeinfos)
    @JoinColumn({ name: 'to' })
    toUser:UserInfo;

    @ManyToOne(type => MomentInfo, moment => moment.mid)
    @JoinColumn({ name: 'mid' })
    moment:MomentInfo;
}