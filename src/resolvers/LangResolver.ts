import { Lang } from '../entity/Lang';
import { 
  Resolver, 
  Mutation, 
  Field, 
  InputType,
  Arg,
  Query,
  FieldResolver,
  Root
  // Query
 } from 'type-graphql'
 import { getConnection } from "typeorm";
 import toHump from './ToHump'
import { Title } from '../entity/Title';
import { Content } from '../entity/Content';

@InputType()
class CreateLangInput implements Partial<Lang> {
  @Field()
  langName: string;
}

@Resolver(Lang)
export class LangResolver {
  @Mutation(() => Lang)
  async createLang(@Arg("variables") variables: CreateLangInput
  ): Promise<Lang> {
    const newLang = Lang.create(variables)
    return await newLang.save()
  }


  @Query(() => [Lang])
  Langs() {
    return Lang.find();
  }

  @FieldResolver(() => [Title])
  titles(@Root() lang: Lang) {
    const abc = Title.find({
      where:[{langId:lang.id, deletedAt: null}]
    })
    return abc
  }

  @Mutation(() => Lang, { nullable: true })
  async editLang(
    @Arg('id') id: string,
    @Arg('langName') langName: string
  ) {
    const result = await getConnection()
    .createQueryBuilder()
    .update(Lang)
    .set({ langName })
    .where({
      id
    })
    .returning("*")
    .execute();
    return toHump(result.raw[0])
  }

  @Query(() => Lang, { nullable: true })
  langByLangName(
    @Arg('langName') langName: string
  ){
    return Lang.findOne({
      where:[{langName, deletedAt: null}]
    });
  }
  
  @FieldResolver(() => [Content], { nullable: true })
  async contents(
    @Arg('titleId') titleId: string,
    @Root() lang: Lang
  ):Promise<Content[] | null>{
    if(titleId) {
      const res = await Content.find({
        where:[{titleId, deletedAt: null}]
      })
      return res
    } else {
      // 如果没有传入titleId则默认拿里面的第一个title里面的数据
      const dbTitle = await Title.find({
        where: { langId: lang.id},
        skip: 0,
        take: 1
      })
      // return null
      if(dbTitle.length > 0){
        return Content.find({
          where:[{titleId: dbTitle[0]?.id || '',deletedAt: null}]
        })
      } else {
        return null
      }
    }
  }
}