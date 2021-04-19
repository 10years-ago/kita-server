import { User } from '../entity/User';
import { 
  Resolver, 
  Mutation, 
  Field, 
  InputType,
  Arg,
  Query
  // ObjectType
 } from 'type-graphql'
 import { getConnection } from "typeorm";
// import { getConnection } from "typeorm";

// @ObjectType()
// class FieldError {
//   @Field()
//   field: string;
//   @Field()
//   message: string;
// }

// @ObjectType()
// class UserResponse {
//   @Field(() => [FieldError], { nullable: true })
//   errors?: FieldError[];
//   @Field(() => User, { nullable: true })
//   user?: User
// }

@InputType()
class UserRegisterInput implements Partial<User> {
  @Field()
  email: string;
  @Field()
  username: string;
  @Field()
  password: string;
  @Field()
  name: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(@Arg("variables") variables: UserRegisterInput
  ): Promise<User> {
    const newUser = User.create(variables)
    return await newUser.save()
  }


  @Query(() => [User])
  Users() {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  UserByName(
    @Arg('name') name: string
  ){
    return User.findOne({
      where:[{name, deleted_at: null}]
    });
  }

  @Mutation(() => User, { nullable: true })
  async editUser(
    @Arg('id') id: string,
    @Arg('name') name: string
  ) {
    const result = await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ name })
    .where({
      id
    })
    .returning("*")
    .execute();
    return result.raw[0]
  }
}