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
 import { sendEmail } from '../utils/sendEmail';
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
  password: string;
  @Field()
  name: string;
}


@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(@Arg("variables") variables: UserRegisterInput
  ): Promise<User> {
    // await sendEmail('414578531@qq.com','wooo!!!')
    const newUser = User.create(variables)
    return await newUser.save()
  }

  @Mutation(() => User, { nullable: true })
  async getPIN(
    @Arg("email") email: string
  ): Promise<User | undefined> {
    let pin = "";
　　for(let i=0;i<6;i++){
　　　　let radom = Math.floor(Math.random()*10);
　　　　pin += radom;
　　}
    await sendEmail(email,pin)
    const user = await User.findOne({
      where:[{email}]
    })
    console.log(user)
    let res
    if(!user){
      console.log(123)
      const dbUser = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({ email, pin:pin })
      .returning("*")
      .execute()
      res = dbUser.raw[0]
    } else {
      console.log(456)
      const dbUser = await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ pin })
      .where({
        email
      })
      .returning("*")
      .execute()
      res = dbUser.raw[0]
    }
    console.log(res)
    return res
  }

  @Query(() => User, { nullable: true })
  UserByName(
    @Arg('name') name: string
  ){
    return User.findOne({
      where:[{name, deletedAt: null}]
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
    .execute()
    return result.raw[0]
  }
}