import "reflect-metadata"
import { startServer } from "./app"

import { connect } from './type-orm.config'

const main = async () => {
  // 链接数据库
  connect()
  const app = await startServer()  
  app.listen(4000, () => {
    console.log('server started on localhost:4000')
  })
}

main()