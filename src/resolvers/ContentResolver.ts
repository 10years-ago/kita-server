import { Content } from '../entity/Content';
import { 
  Resolver, 
  Mutation, 
  Field, 
  InputType,
  Arg,
  FieldResolver,
  Root,
  ObjectType
  // Query
 } from 'type-graphql'
import { Title } from '../entity/Title';
// import { Lang } from '../entity/Lang';
//  import { getConnection } from "typeorm";
//  import toHump from './ToHump'

@ObjectType()
class FieldError {
  @Field()
  field: string
  @Field()
  message: string
}

@ObjectType()
class ContentResolver {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]
  @Field(() => Content, { nullable: true })
  content?: Content
}


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
  @Mutation(() => ContentResolver)
  async createContent(@Arg("variables") variables: CreateContentInput
  ): Promise<ContentResolver> {
    if(!variables?.titleId) {
      return {
        errors: [
          {
            field:'titleId验证',
            message:'该titleId不能为空'
          }
        ]
      }
    }
    if(!variables?.contentTitle) {
      return {
        errors: [
          {
            field:'题目标题验证',
            message:'题目标题不能为空'
          }
        ]
      }
    }
    const dbTitle = await Title.findOne({
      where:[{id:variables.titleId, deletedAt: null}]
    })
    if(dbTitle?.id) {
      const newContent = Content.create(variables)
      const content = await newContent.save()
      return { content }
    } else {
      return {
        errors: [
          {
            field:'titleId验证',
            message:'该titleId不存在'
          }
        ]
      }
    }
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