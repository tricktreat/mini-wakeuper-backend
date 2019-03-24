import "reflect-metadata";
import {Entity, PrimaryColumn, Column, BaseEntity,ManyToOne,JoinColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class SwiperImage extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content:string;

    @Column()
    url:string;
}