import { Title } from '../entity/Title';
import { 
  Resolver, 
  Mutation, 
  Field, 
  InputType,
  Arg,
  FieldResolver,
  Root,
  Query
 } from 'type-graphql'
import { Lang } from '../entity/Lang';
import { Content } from '../entity/Content';
//  import { getConnection } from "typeorm";
//  import toHump from './ToHump'

@InputType()
class CreateTitleInput implements Partial<Title> {
  @Field()
  titleName: string;
  @Field()
  langId: string;
}

@Resolver(Title)
export class LangResolver {
  @Mutation(() => Title)
  async createTitle(@Arg("variables") variables: CreateTitleInput
  ): Promise<Title> {
    const newTitle = Title.create(variables)
    const res = await newTitle.save()
    return res
  }

  @FieldResolver(() => Lang)
  lang(@Root() title: Title) {
    console.log(title)
    const res  = Lang.findOne({
      where:[{id:title.langId, deletedAt: null}]
    });
    return res
  }

  @FieldResolver(() => [Content])
  contents(@Root() title: Title) {
    const res = Content.find({
      where:[{titleId:title.id, deletedAt: null}]
    })
    return res
  }

  @Query(() => [Title])
  Titles() {
    return Title.find();
  }

  // @Mutation(() => Lang, { nullable: true })
  // async editLang(
  //   @Arg('id') id: string,
  //   @Arg('langName') langName: string
  // ) {
  //   const result = await getConnection()
  //   .createQueryBuilder()
  //   .update(Lang)
  //   .set({ langName })
  //   .where({
  //     id
  //   })
  //   .returning("*")
  //   .execute();
  //   return toHump(result.raw[0])
  // }
}