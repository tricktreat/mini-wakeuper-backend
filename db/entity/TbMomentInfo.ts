import "reflect-metadata";
import {Entity, PrimaryColumn, Column, BaseEntity,ManyToOne,JoinColumn, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import { UserInfo } from "./TbUserInfo";
import { url } from "inspector";
import { LikeInfo } from "./TbLikeInfo";
import { CommentInfo } from "./TbCommentInfo";

@Entity()
export class MomentInfo extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    mid: number;

    @Column()
    createTime:Date;

    @Column()
    type:string;

    @Column({
        length:1000
    })
    content:string;

    @Column({
        default:''
    })
    url:string;

    @OneToMany(type => LikeInfo, likeinfo => likeinfo.moment)
    likeInfos: LikeInfo[];

    @OneToMany(type => CommentInfo, commentinfo => commentinfo.moment)
    commentInfos: LikeInfo[];

    @ManyToOne(type => UserInfo, user => user.momentinfos)
    @JoinColumn({ name: 'user' })
    user:string;
}