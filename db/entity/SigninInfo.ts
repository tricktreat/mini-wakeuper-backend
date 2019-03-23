import {Entity, PrimaryColumn, Column, BaseEntity,ManyToOne,JoinColumn} from "typeorm";
import { UserInfo } from "./UserInfo";

@Entity()
export class SigninInfo extends BaseEntity {

    // @PrimaryColumn()
    // openId: string;

    @PrimaryColumn()
    signTime: Date;


    @ManyToOne(type => UserInfo, user => user.signinfos)
    @JoinColumn({ name: 'openId' })
    user: UserInfo;
}