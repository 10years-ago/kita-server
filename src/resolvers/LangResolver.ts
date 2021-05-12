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
}