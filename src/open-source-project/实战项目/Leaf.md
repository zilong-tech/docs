---
title: 分布式ID解决方案
author: 程序员子龙
index: true
icon: discover
category:
- 开源项目
---
在复杂分布式系统中，往往需要对大量的数据和消息进行唯一标识，也就是唯一id，那业务系统对ID号的要求有哪些呢？

1. 全局唯一性：不能出现重复的ID号。
2. 趋势递增：在MySQL InnoDB引擎中使用的是聚集索引，由于多数RDBMS使用B-tree的数据结构来存储索引数据，在主键的选择上面应该尽量使用有序的主键保证写入性能。
3. 单调递增：保证下一个ID一定大于上一个ID。
4. 信息安全：如果ID是连续的，恶意用户的扒取工作就非常容易做了，直接按照顺序下载指定URL即可；所以在一些应用场景下，会需要ID无规则。

目前主流的分布式ID生成方式，大致都是基于数据库号段模式和雪花算法（snowflake），而美团（Leaf）刚好同时兼具了这两种方式，可以根据不同业务场景灵活切换。

### Leaf-segment方案

利用proxy server批量获取，每次获取一个segment(step决定大小)号段的值。用完之后再去数据库获取新的号段，可以大大的减轻数据库的压力。 - 各个业务不同的发号需求用biz_tag字段来区分，每个biz-tag的ID获取相互隔离，互不影响。如果以后有性能需求需要对数据库扩容，不需要上述描述的复杂的扩容操作，只需要对biz_tag分库分表就行。

![image](https://awps-assets.meituan.net/mit-x/blog-images-bundle-2017/5e4ff128.png)



项目源码克隆下来

需要到leaf-server子项目中resource目录下面leaf.properties配置,开启segment模式。

```yaml
leaf.name=com.sankuai.leaf.opensource.test
leaf.segment.enable=true
leaf.jdbc.url=jdbc:mysql://localhost:3306/leaf?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
leaf.jdbc.username=root
leaf.jdbc.password=123456

leaf.snowflake.enable=false
```

创建表

```mysql
CREATE TABLE `leaf_alloc` (
  `biz_tag` varchar(128)  NOT NULL DEFAULT '',
  `max_id` bigint(20) NOT NULL DEFAULT '1',
  `step` int(11) NOT NULL,
  `description` varchar(256)  DEFAULT NULL,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`biz_tag`)
) ENGINE=InnoDB;

insert into leaf_alloc(biz_tag, max_id, step, description) values('leaf-segment-test', 1, 2000, 'Test leaf Segment Mode Get Id')
```

字段说明：biz_tag用来区分业务，max_id表示该biz_tag目前所被分配的ID号段的最大值，step表示每次分配的号段长度。原来获取ID每次都需要写数据库，现在只需要把step设置得足够大，比如1000。那么只有当1000个号被消耗完了之后才会去重新读写一次数据库。读写数据库的频率从1减小到了1/step。

访问：http://127.0.0.1:8080/api/segment/get/leaf-segment-test

注意调用接口的key，是表中的 biz_tag 字段值。

![](http://img.xxfxpt.top/202204242237500.png)

优点：

- Leaf服务可以很方便的线性扩展，性能完全能够支撑大多数业务场景。
- ID号码是趋势递增的8byte的64位数字，满足上述数据库存储的主键要求。
- 容灾性高：Leaf服务内部有号段缓存，即使DB宕机，短时间内Leaf仍能正常对外提供服务。
- 可以自定义max_id的大小，非常方便业务从原有的ID方式上迁移过来。

缺点：

- ID号码不够随机，能够泄露发号数量的信息，不太安全。

### Leaf-snowflake方案

这种方案大致来说是一种以划分命名空间来生成ID的一种算法，这种方案把64-bit分别划分成多段，分开来标示机器、时间等，比如在snowflake中的64-bit分别表示如下图所示：

![image](https://p0.meituan.net/travelcube/01888770c8f84b1df258ddd1d424535c68559.png@1112w_282h_80q)

41-bit的时间可以表示（1L<<41）/(1000L*3600*24*365)=69年的时间，10-bit机器可以分别表示1024台机器。如果我们对IDC划分有需求，还可以将10-bit分5-bit给IDC，分5-bit给工作机器。这样就可以表示32个IDC，每个IDC下可以有32台机器，可以根据自身需求定义。12个自增序列号可以表示2^12个ID，理论上snowflake方案的QPS约为409.6w/s，这种分配方式可以保证在任何一个IDC的任何一台机器在任意毫秒内生成的ID都是不同的。

![image](https://awps-assets.meituan.net/mit-x/blog-images-bundle-2017/a3f985a8.png)


1. 启动Leaf-snowflake服务，连接Zookeeper，在leaf_forever父节点下检查自己是否已经注册过（是否有该顺序子节点）。
2. 如果有注册过直接取回自己的workerID（zk顺序节点生成的int类型ID号），启动服务。
3. 如果没有注册过，就在该父节点下面创建一个持久顺序节点，创建成功后取回顺序号当做自己的workerID号，启动服务。

启动Leaf-snowflake模式也比较简单，启动本地ZooKeeper，修改一下项目中的leaf.properties文件，关闭leaf.segment模式，启用leaf.snowflake模式即可。

```yaml
leaf.segment.enable=false


leaf.snowflake.enable=true
leaf.snowflake.zk.address=127.0.0.1
leaf.snowflake.port=2181
```

访问：http://127.0.0.1:8080/api/snowflake/get/leaf-segment-test

![](http://img.xxfxpt.top/202204242229189.png)

- 优点：
  ID号码是趋势递增的8 byte的64位数字，满足上述数据库存储的主键要求。

  id号码随机性高，更安全

- 缺点：
  依赖ZooKeeper，存在服务不可用风险

## 总结

对于Leaf具体使用哪种模式，还是根据具体的业务场景使用。