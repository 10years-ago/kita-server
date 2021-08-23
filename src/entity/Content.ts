import { Field, ObjectType } from "type-graphql"
import { 
    Entity, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    BeforeInsert,
    BaseEntity,
    ManyToOne,
    // JoinColumn,
    VersionColumn,
    PrimaryGeneratedColumn,
    JoinColumn
} from "typeorm"
import { v4 } from 'uuid'
import { Title } from "./Title"

@ObjectType()
@Entity()
export class Content extends BaseEntity {
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
    @VersionColumn({ name: 'seq_id'})
    seqId: Number

    @Field({ nullable: true })
    @Column({ nullable: true, name: 'content_title' })
    contentTitle: String

    @Field({ nullable: true })
    @Column({ nullable: true })
    content: String

    @Field({ nullable: true })
    @Column({ nullable: true })
    code: String

    @Field()
    @Column({ name: 'title_id'})
    titleId: String

    @ManyToOne(() => Title, (title) => title.contents)
    @JoinColumn({name: 'title_id'})
    title: Title

    @BeforeInsert()
    addId() {
		this.id = v4();
	}
}