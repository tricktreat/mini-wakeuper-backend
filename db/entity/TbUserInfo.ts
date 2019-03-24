import "reflect-metadata";
import {Entity, PrimaryColumn, Column, BaseEntity,OneToMany, CreateDateColumn} from "typeorm";
import { SigninInfo } from "./TbSigninInfo";
import { LikeInfo } from "./TbLikeInfo";

@Entity()
export class UserInfo extends BaseEntity {

    @PrimaryColumn()
    openId: string;

    @Column({
        default:""
    })
    phoneNumber: string;

    @Column({
        default:""
    })
    name: string;

    @Column({
        default:""
    })
    studentId: string;

    @Column({
        default:"比较懒，未设置个性签名"
    })
    motto: string;

    @Column({
        default:""
    })
    campus: string;

    @Column({
        default:""
    })
    department: string;

    @Column({
        default:""
    })
    master: string;

    @Column({
        default:""
    })
    avatarUrl: string;

    @Column({
        default:""
    })
    nickName: string;

    @Column({
        default:1
    })
    gender: number;

    
    @Column({
        default:0
    })
    member: number;

    @Column({
        default:null
    })
    birthday: Date;

    @Column({
        default:""
    })
    city: string;

    @Column({
        default:""
    })
    province: string;

    @Column({
        default:""
    })
    country: string;

    @Column({
        default:"未设置标签"
    })
    tag: string;

    @CreateDateColumn()
    registerTime:Date;

    @OneToMany(type => SigninInfo, signinfo => signinfo.user)
    signinfos: SigninInfo[];
    
    @OneToMany(type => LikeInfo, likeinfo => likeinfo.toUser)
    likeinfos: SigninInfo[];
}