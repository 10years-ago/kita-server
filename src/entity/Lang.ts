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

    @Field()
    @Column({ nullable: true, name: 'deleted_at' })
    deletedAt: Date

    @Field()
    @VersionColumn({ name: 'seq_id' })
    seqId: number

    @Field()
    @Column({ name: 'lang_name'})
    langName: string

    @OneToMany(() => Title, (title) => title.lang)
    titles: Title[];

    @BeforeInsert()
    addId() {
		this.id = v4();
	}
}