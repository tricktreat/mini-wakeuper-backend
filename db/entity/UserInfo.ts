import {Entity, PrimaryColumn, Column, BaseEntity,OneToMany} from "typeorm";
import { SigninInfo } from "./SigninInfo";

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

    @OneToMany(type => SigninInfo, signinfo => signinfo.user)
    signinfos: SigninInfo[];
}