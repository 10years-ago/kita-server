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
  // Query
 } from 'type-graphql'
import { Lang } from '../entity/Lang';
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
    const abc = await newTitle.save()
    return abc
    // return toHump(result.raw[0])
  }

  @FieldResolver(() => Lang)
  lang(@Root() title: Title) {
    const abc  = Lang.findOne({
      where:[{id:title.langId, deletedAt: null}]
    });
    return abc
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