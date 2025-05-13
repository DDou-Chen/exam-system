## prisma

初始化
`npx prisma init`
然后修改 **schema.prisma** 配置，和 **env 的 DATABASE_URL**

重置数据库
`npx prisma migrate reset`

创建新的 migration
`npx prisma migrate dev --name **(user)`
