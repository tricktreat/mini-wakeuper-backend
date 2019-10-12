import "reflect-metadata";
import {Entity, PrimaryColumn, Column, BaseEntity,ManyToOne,JoinColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class FormId extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    formId:string

    @Column()
    openId:string

    @Column({  default: () => `now()`})
    createTime: Date;
}