export const example = app => {
  app.use(async (ctx, next) => {
    console.log('example-before')
    await next()
    console.log('example-after')
  })
}
