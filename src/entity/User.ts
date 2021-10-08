import { Field, ObjectType } from "type-graphql"
import { 
    Entity, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    BeforeInsert,
    BaseEntity,
    VersionColumn,
    PrimaryGeneratedColumn
} from "typeorm"
import { v4 } from 'uuid'
import { Lang } from "./Lang"

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field({ nullable: true })
    @PrimaryGeneratedColumn('uuid')
    id: String

    @Field({ nullable: true })
    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date

    @Field({ nullable: true })
    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date

    @Field({ nullable: true })
    @Column({ nullable: true, name: 'deleted_at' })
    deletedAt: Date

    @Field({ nullable: true })
    @VersionColumn({ name: 'seq_id'})
    seqId: number

    @Field({ nullable: true })
    @Column({ nullable: true })
    password: string

    @Field({ nullable: true })
    @Column({ nullable: true })
    pin: string

    @Field({ nullable: true })
    @Column({ nullable: true,name: 'pin_time' })
    pinTime: Date

    @Field({ nullable: true })
    @Column({ nullable: true })
    name: string

    @Field({ nullable: true })
    @Column({ nullable: true, name: 'user_photo' })
    userPhoto: string

    @Field({ nullable: true })
    @Column()
    email: string

    @Field({ nullable: true })
    @Column({ nullable: true })
    token: string
    
    @Field({ nullable: true })
    @Column({ nullable: true, name: 'token_at' })
    tokenAt: Date

    @Field({ nullable: true })
    @Column({ nullable: true, default: 'false' })
    admin: Boolean

    @Field(() => Lang, { nullable: true })
    lang: Lang

    @BeforeInsert()
    addId() {
		this.id = v4();
	}
}