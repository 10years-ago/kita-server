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
 import { v4 } from 'uuid'
 import toHump from './ToHump'


// @ObjectType()
// class FieldError {
//   @Field()
//   field: string;
//   @Field()
//   message: string;
// }

// @ObjectType()
// class UserResponse {
//   @Field(() => FieldError, { nullable: true })
//   error?: FieldError

//   @Field(() => User, { nullable: true })
//   user?: User
// }

@InputType()
class UserRegisterInput implements Partial<User> {
  @Field()
  email: string
  @Field()
  password: string
  @Field()
  name: string
  @Field()
  pin: string
}


@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(@Arg("variables") variables: UserRegisterInput
  ): Promise<User | Error> {
    const {
      email,
      password,
      name,
      pin
    } = variables
    switch(true){
      case !email.trim():
        return new Error('邮箱格式不正确')
      case !password.trim():
        return new Error('密码格式不正确')
      case !name.trim():
        return new Error('用户名格式不正确')
      case !pin.trim():
        return new Error('验证码格式不正确')
    }
    const dbUser = await User.findOne({
      where:[{email}]
    })
    if(!dbUser) {
      return new Error('请先获取验证码后再进行注册')
    } else if(dbUser?.name){
      return new Error('该邮箱已被注册')
    } else if (pin !== dbUser.pin) {
      return new Error('验证码不正确')
    } else if (new Date() > new Date(dbUser.pinTime)) {
      return new Error('验证码过期')
    }
    const registerUser = await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ 
        name,
        password
      })
      .where({
        email
      })
      .returning("*")
      .execute()
    return registerUser.raw[0]
  }

  @Mutation(() => User, { nullable: true })
  async getPIN(
    @Arg("email") email: string
  ){
    if(!email.trim()) {
      return new Error('请输入正确的邮箱')
    }
    let pin = "";
　　for(let i=0; i<6; i++){
　　　　let radom = Math.floor(Math.random()*10);
　　　　pin += radom;
　　}
    await sendEmail(email,pin)
    const user = await User.findOne({
      where:[{email}]
    })
    let res
    if(!user){
      const dbUser = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({ 
        email, 
        pin,
        pinTime: new Date(new Date().getTime() + 1000 * 60)
      })
      .returning("*")
      .execute()
      res = toHump(dbUser.raw[0])
    } else {
      const dbUser = await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({
        pin,
        pinTime: new Date(new Date().getTime() + 1000 * 60)
       })
      .where({
        email
      })
      .returning("*")
      .execute()
      res = toHump(dbUser.raw[0])
    }
    console.log(res)
    return res
  }

  @Query(() => User, { nullable: true })
  userByName(
    @Arg('name') name: string
  ){
    return User.findOne({
      where:[{name, deletedAt: null}]
    });
  }

  @Query(() => User, { nullable: true })
  userByToken(
    @Arg('token') token: string
  ){
    return User.findOne({
      where:[{token, deletedAt: null}]
    });
  }

  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string
  ){
    const dbUser = await User.findOne({
      where:[{email, password}]
    })
    if(!dbUser) {
      return new Error('邮箱或密码不正确')
    }
    if(!dbUser?.token || (new Date() > new Date(dbUser?.tokenAt))) {
      const result = await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ 
        token: v4(), 
        tokenAt: new Date(new Date().getTime() + 1000 * 3600 * 24 * 30)
      })
      .where({
        email
      })
      .returning("*")
      .execute()
      return toHump(result.raw[0])
    } else {
      return dbUser
    }
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


