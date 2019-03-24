import "reflect-metadata";
import {Entity, PrimaryColumn, Column, BaseEntity,ManyToOne,JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import { UserInfo } from "./TbUserInfo";
import { generateKeyPair } from "crypto";
import "reflect-metadata";

@Entity()
export class SigninInfo extends BaseEntity {

    // @PrimaryColumn()
    // openId: string;

    @PrimaryColumn()
    signTime: Date;

    @ManyToOne(type => UserInfo, user => user.signinfos)
    @JoinColumn({name:"openId"})
    user: UserInfo;

    @Column({
        default:1
    })
    corn:number;


}