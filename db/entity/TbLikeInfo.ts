import {Entity, PrimaryColumn, Column, BaseEntity,ManyToOne,JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import { UserInfo } from "./TbUserInfo";

@Entity()
export class LikeInfo extends BaseEntity {

    // @PrimaryColumn()
    // openId: string;

    @PrimaryColumn()
    likeTime: Date;

    @PrimaryColumn({name:"from"})
    fromUser:string;

    @ManyToOne(type => UserInfo, user => user.likeinfos)
    @JoinColumn({ name: 'to' })
    toUser:UserInfo;
}