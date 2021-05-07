import { Field, ObjectType } from "type-graphql"
import { 
    Entity, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn,
    BeforeInsert,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    VersionColumn,
    PrimaryGeneratedColumn
} from "typeorm"
import { v4 } from 'uuid'
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

    @Field()
    @Column({ nullable: true, name: 'deleted_at' })
    deletedAt: Date

    @Field()
    @VersionColumn({ name: 'seq_id'})
    seqId: number

    @Field()
    @Column({ name: 'title_name'})
    titleName: string

    @ManyToOne(() => Lang, (lang) => lang.titles)
    @JoinColumn({ name: "lang_id", referencedColumnName: 'id'})
    lang: Lang;

    @BeforeInsert()
    addId() {
		this.id = v4();
	}
}