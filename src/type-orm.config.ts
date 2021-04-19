import { createConnection } from "typeorm";
export async function connect() {
  //线上
  // await createConnection({
  //   type: "postgres",
  //   host: "121.4.125.167",
  //   port: 5432,
  //   username: "wwy",
  //   password: "wuweiyao",
  //   database: "wwydb",
  //   entities: [__dirname + "/entity/*.ts"],
  //   synchronize: true,
  //   logging: false,
  // })

  //本地
  await createConnection({
    type: "postgres",
    host: "127.0.0.1",
    port: 5432,
    username: "kita",
    password: "991129",
    database: "kita_blog",
    entities: [__dirname + "/entity/*.ts"],
    synchronize: true,
    logging: false,
  })
}