import { Content } from '../entity/Content';
import { 
  Resolver, 
  Mutation, 
  Field, 
  InputType,
  Arg,
  FieldResolver,
  Root
  // Query
 } from 'type-graphql'
import { Title } from '../entity/Title';
// import { Lang } from '../entity/Lang';
//  import { getConnection } from "typeorm";
//  import toHump from './ToHump'

@InputType()
class CreateContentInput implements Partial<Content> {
  @Field()
  contentTitle: string
  @Field()
  content: string
  @Field()
  code: string
  @Field()
  titleId: string
}

@Resolver(Content)
export class LangResolver {
  @Mutation(() => Content)
  async createContent(@Arg("variables") variables: CreateContentInput
  ): Promise<Content> {
    const newContent = Content.create(variables)
    const res = await newContent.save()
    return res
  }

  @FieldResolver(() => Title)
  title(@Root() content: Content) {
    const res = Title.findOne({
      where:[{id:content.titleId, deletedAt: null}]
    });
    return res
  }

  // @Query(() => [Content])
  // Contents() {
  //   return Content.find()
  // }

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