const e=JSON.parse('{"key":"v-013a1979","path":"/Spring/%E8%81%8A%E8%81%8Aspring%E4%BA%8B%E5%8A%A1%E5%A4%B1%E6%95%88%E7%9A%84%E5%9C%BA%E6%99%AF.html","title":"聊聊spring事务失效的场景","lang":"zh-CN","frontmatter":{"title":"聊聊spring事务失效的场景","author":"程序员子龙","index":true,"icon":"discover","category":["Spring"],"description":"对于从事java开发工作的同学来说，spring的事务肯定再熟悉不过了。 在某些业务场景下，如果一个请求中，需要同时写入多张表的数据。为了保证操作的原子性（要么同时成功，要么同时失败），避免数据不一致的情况，我们一般都会用到spring事务。 确实，spring事务用起来贼爽，就用一个简单的注解：@Transactional，就能轻松搞定事务。我猜大部...","head":[["meta",{"property":"og:url","content":"https://zilong-tech.github.io/docs/docs/Spring/%E8%81%8A%E8%81%8Aspring%E4%BA%8B%E5%8A%A1%E5%A4%B1%E6%95%88%E7%9A%84%E5%9C%BA%E6%99%AF.html"}],["meta",{"property":"og:site_name","content":"子龙技术"}],["meta",{"property":"og:title","content":"聊聊spring事务失效的场景"}],["meta",{"property":"og:description","content":"对于从事java开发工作的同学来说，spring的事务肯定再熟悉不过了。 在某些业务场景下，如果一个请求中，需要同时写入多张表的数据。为了保证操作的原子性（要么同时成功，要么同时失败），避免数据不一致的情况，我们一般都会用到spring事务。 确实，spring事务用起来贼爽，就用一个简单的注解：@Transactional，就能轻松搞定事务。我猜大部..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-02-10T09:01:37.000Z"}],["meta",{"property":"article:author","content":"程序员子龙"}],["meta",{"property":"article:modified_time","content":"2023-02-10T09:01:37.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"聊聊spring事务失效的场景\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-02-10T09:01:37.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"程序员子龙\\"}]}"]]},"headers":[{"level":3,"title":"数据库引擎不支持事务","slug":"数据库引擎不支持事务","link":"#数据库引擎不支持事务","children":[]},{"level":3,"title":"没有被 Spring 管理","slug":"没有被-spring-管理","link":"#没有被-spring-管理","children":[]},{"level":3,"title":"方法不是public的","slug":"方法不是public的","link":"#方法不是public的","children":[]},{"level":3,"title":"方法内部调用","slug":"方法内部调用","link":"#方法内部调用","children":[]},{"level":3,"title":"方法用final修饰","slug":"方法用final修饰","link":"#方法用final修饰","children":[]},{"level":3,"title":"异常被吃了","slug":"异常被吃了","link":"#异常被吃了","children":[]},{"level":3,"title":"手动抛了别的异常","slug":"手动抛了别的异常","link":"#手动抛了别的异常","children":[]},{"level":3,"title":"抛出自定义异常","slug":"抛出自定义异常","link":"#抛出自定义异常","children":[]},{"level":3,"title":"多线程","slug":"多线程","link":"#多线程","children":[]},{"level":3,"title":"错误的传播属性","slug":"错误的传播属性","link":"#错误的传播属性","children":[]},{"level":3,"title":"嵌套事务回滚多了","slug":"嵌套事务回滚多了","link":"#嵌套事务回滚多了","children":[]},{"level":3,"title":"总结","slug":"总结","link":"#总结","children":[]}],"git":{"createdTime":1676019697000,"updatedTime":1676019697000,"contributors":[{"name":"javacode","email":"zysspace@163.com","commits":1}]},"readingTime":{"minutes":7.9,"words":2369},"filePathRelative":"Spring/聊聊spring事务失效的场景.md","localizedDate":"2023年2月10日","autoDesc":true}');export{e as data};
