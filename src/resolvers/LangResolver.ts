import { Lang } from '../entity/Lang';
import { 
  Resolver, 
  Mutation, 
  Field, 
  InputType,
  Arg
  // Query
 } from 'type-graphql'
 import { getConnection } from "typeorm";
 import toHump from './ToHump'

@InputType()
class CreateLangInput implements Partial<Lang> {
  @Field()
  langName: string;
}

@Resolver()
export class LangResolver {
  @Mutation(() => Lang)
  async createLang(@Arg("variables") variables: CreateLangInput
  ): Promise<Lang> {
    const newLang = Lang.create(variables)
    return await newLang.save()
  }


  // @Query(() => [Lang])
  // Langs() {
  //   return Lang.find();
  // }

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