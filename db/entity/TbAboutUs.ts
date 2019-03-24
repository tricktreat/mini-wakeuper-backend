import "reflect-metadata";
import {Entity, PrimaryColumn, Column, BaseEntity,ManyToOne,JoinColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class AboutUs extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type:string

    @Column({
        length:1000
    })
    content:string
}