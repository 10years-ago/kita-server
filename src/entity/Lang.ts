import { Field, ObjectType } from "type-graphql"
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    BeforeInsert,
    BaseEntity,
    OneToMany,
    VersionColumn
} from "typeorm"
import { v4 } from 'uuid'
import { Content } from "./Content"
import { Title } from "./Title"

@ObjectType()
@Entity()
export class Lang extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: String

    @Field()
    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date

    @Field()
    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date

    @Field({ nullable: true })
    @Column({ nullable: true, name: 'deleted_at' })
    deletedAt: Date

    @Field()
    @VersionColumn({ name: 'seq_id' })
    seqId: Number

    @Field()
    @Column({ name: 'lang_name' })
    langName: String

    @Field(() => [Content], { nullable: true })
    contents: Content[]

    @OneToMany(() => Title, (title) => title.lang)
    titles: Title[];

    @BeforeInsert()
    addId() {
		this.id = v4();
	}
}