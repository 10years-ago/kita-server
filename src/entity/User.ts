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

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: String

    @Field()
    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date

    @Field()
    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date

    @Field()
    @Column({ nullable: true, name: 'deleted_at' })
    deletedAt: Date

    @Field()
    @VersionColumn({ name: 'seq_id'})
    seqId: number

    @Field()
    @Column()
    username: string

    @Field()
    @Column()
    password: string

    @Field()
    @Column()
    name: string

    @Field()
    @Column({ nullable: true, name: 'user_photo' })
    userPhoto: string

    @Field()
    @Column({ nullable: true })
    email: string

    @BeforeInsert()
    addId() {
		this.id = v4();
	}
}