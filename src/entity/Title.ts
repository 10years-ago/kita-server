import { Field, ObjectType } from "type-graphql"
import { 
    Entity, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    BeforeInsert,
    BaseEntity,
    ManyToOne,
    VersionColumn,
    PrimaryGeneratedColumn,
    OneToMany,
    JoinColumn
} from "typeorm"
import { v4 } from 'uuid'
import { Content } from "./Content"
import { Lang } from "./Lang"

@ObjectType()
@Entity()
export class Title extends BaseEntity {
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

    @Field()
    @Column({ name: 'title_name'})
    titleName: String

    @Field()
    @Column({ name: 'lang_id'})
    langId: String

    @ManyToOne(() => Lang, (lang) => lang.titles)
    @JoinColumn({name: 'lang_id'})
    lang: Lang

    @OneToMany(() => Content, (content) => content.title)
    contents: Content[];


    @BeforeInsert()
    addId() {
		this.id = v4();
	}
}