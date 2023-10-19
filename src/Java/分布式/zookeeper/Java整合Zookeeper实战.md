---
title: Java整合Zookeeper实战
author: 程序员子龙
index: true
icon: discover
category:
- Zookeeper
---
ZooKeeper应用的开发主要通过Java客户端API去连接和操作ZooKeeper集群。可供选择的Java客户端API有： 

- ZooKeeper官方的Java客户端API。 

- 第三方的Java客户端API，比如Curator。 

ZooKeeper官方API功能比较简单，在实际开发过程中比较笨重，一般不推荐使用。 本文主要介绍Curator。

### **Curator开源客户端**

Curator是Netflix公司开源的一套ZooKeeper客户端框架，和ZkClient一样它解决了非常底层的细节开发工作，包括连接、重连、反复注册Watcher的问题以及NodeExistsException 异常等。 

Curator是Apache基金会的顶级项目之一，Curator具有更加完善的文档，另外还提供了一套易用性和可读性更强的Fluent风格的客户端API框架。 

Curator还为ZooKeeper客户端框架提供了一些比较普遍的、开箱即用的、分布式开发用的解决方案，例如Recipe、共享锁服务、Master选举机制和分布式计算器等，帮助开发者避免了“重复造轮子”的无效开发工作。 

#### 引入依赖

```
<!-- zookeeper client -->
<dependency>
    <groupId>org.apache.zookeeper</groupId>
    <artifactId>zookeeper</artifactId>
    <version>3.8.0</version>
</dependency>

<!--curator-->
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>5.1.0</version>
    <exclusions>
        <exclusion>
            <groupId>org.apache.zookeeper</groupId>
            <artifactId>zookeeper</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

Curator 包含了几个包： 

curator-framework是对ZooKeeper的底层API的一些封装。 

curator-client提供了一些客户端的操作，例如重试策略等。 

curator-recipes封装了一些高级特性，如：Cache事件监听、选举、分布式锁、分布式计数器、分布式Barrier等。

注意：版本号要和zk的版本对应上，本示例使用zk版本号是3.5.8

#### 创建客户端实例

在使用curator-framework包操作ZooKeeper前，首先要创建一个客户端实例。这是一个 CuratorFramework类型的对象，有两种方法： 

- 使用工厂类CuratorFrameworkFactory的静态newClient()方法。

```java
//创建连接实例
private CuratorFramework client = null;
// 重试策略 baseSleepTimeMs：初始的重试等待时间  maxRetries：最多重试次数
RetryPolicy retryPolicy = new ExponentialBackoffRetry(1000, 3);
//创建客户端实例
client = CuratorFrameworkFactory.newClient(CONNECT_STR, retryPolicy);
//启动客户端
client.start();
```

- 使用工厂类CuratorFrameworkFactory的静态builder构造者方法。 

  ```java
  RetryPolicy retryPolicy = new ExponentialBackoffRetry(1000, 6);
  client = CuratorFrameworkFactory.builder().connectString(CONNECT_STR)
          .retryPolicy(retryPolicy)
          .sessionTimeoutMs(sessionTimeoutMs)
          .connectionTimeoutMs(connectionTimeoutMs)
          .build();
  client.getConnectionStateListenable().addListener((client, newState) -> {
      if (newState == ConnectionState.CONNECTED) {
          log.info("连接成功！");
      }
  
  });
  
  client.start();
  ```

参数说明：

connectionString：服务器地址列表，如果是多个地址，那么每个服务器地址列表用逗号分隔。

retryPolicy：重试策略，当客户端异常退出或者与服务端失去连接的时候，可以通过设置客户端重新连接 ZooKeeper 服务端。而 Curator 提供了 一次重试、多次重试等不同种类的实现方式。在 Curator 内部，可以通过判断服务器返回的 keeperException 的状态代码来判断是否进行重试处理，如果返回的是 OK 表示一切操作都没有问题，而 SYSTEMERROR 表示系统或服务端错误。 

| 策略名称                | 描述                                 |
| ----------------------- | ------------------------------------ |
| ExponentialBackoffRetry | 重试一组次数，重试之间的睡眠时间增加 |
| RetryNTimes             | 重试最大次数                         |
| RetryOneTime            | 只重试一次                           |
| RetryUntilElapsed       | 在给定的时间结束之前重试             |

超时时间：Curator 客户端创建过程中，有两个超时时间的设置。一个是 sessionTimeoutMs 会话超时时间，用来设置该条会话在 ZooKeeper 服务端的失效时间。另一个是 connectionTimeoutMs 客户端创建会话的超时时间，用来限制客户端发起一个会话连接到接收 ZooKeeper 服务端应答的时间。sessionTimeoutMs 作用在服务端，而 connectionTimeoutMs 作用在客户端。 

#### 创建节点

```java
//创建永久节点
client.create().forPath("/curator","curator data".getBytes());

//创建永久有序节点
client.create().withMode(CreateMode.PERSISTENT_SEQUENTIAL).forPath("/curator_sequential","/curator_sequential data".getBytes());

//创建临时节点
client.create().withMode(CreateMode.EPHEMERAL)
        .forPath("/curator/ephemeral","/curator/ephemeral data".getBytes());

//创建临时有序节点
client.create().withMode(CreateMode.EPHEMERAL_SEQUENTIAL)
        .forPath("/curator/ephemeral_path1","/curator/ephemeral_path1 data".getBytes());

//创建带层级结构的节点
String path = client.create().creatingParentsIfNeeded().forPath("/node-parent/sub-node");
```

在 Curator 中，可以使用 create 函数创建数据节点，并通过 withMode 函数指定节点类型（持久化节点，临时节点，顺序节点，临时顺序节点，持久化顺序节点等），默认是持久化节点，之后调用 forPath 函数来指定节点的路径和数据信息。 

#### 检测节点是否存在

```java
Stat stat1 = client.checkExists().forPath("/curator");
Stat stat2 = client.checkExists().forPath("/curator2");
```

#### 列出子节点

```java
String pathWithParent = "/node-parent";
List<String> nodes = client.getChildren().forPath(pathWithParent);
nodes.forEach( i-> log.info("node:{}",i));
```

#### 获取数据

```java
byte[] bytes = client.getData().forPath("/curator");
```

#### **更新节点**

通过客户端实例的 setData() 方法更新 ZooKeeper 服务上的数据节点

```java
client.setData().forPath("/curator", "changed!".getBytes());
```

#### **删除节点**

```java
String pathWithParent = "/node-parent";
client.delete().guaranteed().deletingChildrenIfNeeded().forPath(pathWithParent);
```

guaranteed：主要起到一个保障删除成功的作用，其底层工作方式是：只要该客户端的会话有效，就会在后台持续发起删除请求，直到该数据节点在 ZooKeeper 服务端被删除。 

deletingChildrenIfNeeded：在删除该数据节点的时候会以递归的方式直接删除其子节点，以及子节点的子节点。

#### **异步接口**

Curator 引入了BackgroundCallback 接口，用来处理服务器端返回来的信息，这个处理过程是在异步线程中调用，默认在 **EventThread** 中调用，也可以自定义线程池。

```java
BackgroundCallback callback = new BackgroundCallback() {

    @Override
    public void processResult(CuratorFramework client, CuratorEvent event)
            throws Exception {

        KeeperException.Code code = KeeperException.Code.get(event.getResultCode());

        log.info("path:{},data:{}" , event.getPath());


    }
};


client.setData().inBackground(callback).forPath(ZK_NODE,"/curator modified data with Callback".getBytes());


//为了防止单元测试结束从而看不到异步执行结果
Thread.sleep(20000);
```

第二种监听方式：

```java
    String ZK_NODE="/node-parent";
    //创建监听器
    CuratorListener listener = new CuratorListener() {

        @Override
        public void eventReceived(CuratorFramework client, CuratorEvent event)
                throws Exception {
            log.info("path:{}" , event.getPath());
        }
    };

    //添加监听器
    client.getCuratorListenable().addListener(listener);

    //异步设置某个节点数据
    client.setData().inBackground((client, event) -> {
        log.info(" background: {}", event);
    }).forPath(ZK_NODE,"data".getBytes());
}
```

指定线程池：

```java
ExecutorService executorService = Executors.newSingleThreadExecutor();
String ZK_NODE="/node-parent";
client.setData().inBackground((client, event) -> {
    log.info(" background: {}", event);
},executorService).forPath(ZK_NODE,"test".getBytes());
```