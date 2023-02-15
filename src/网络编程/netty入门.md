---
title: Netty 入门
author: 程序员子龙
index: true
icon: discover
category:
- Netty
---
![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91Y2MuYWxpY2RuLmNvbS9waWMvZGV2ZWxvcGVyLWVjb2xvZ3kvYjNmYzZlYjY5MDQ2NDk0MGI0YTliMTEwMGNmZWQ1YTIucG5n?x-oss-process=image/format,png)

### Netty概述

**Netty**是 一个**异步事件驱动**的网络应用程序框架，用于**快速开发可维护的高性能协议服务器和客户端**。

Netty 对 JDK 自带的 NIO 的 API 进行了良好的封装，解决了上述问题。且Netty拥有高性能、 吞吐量更高，延迟更低，减少资源消耗，最小化不必要的内存复制等优点。 

Netty 现在都在用的是4.x，5.x版本已经废弃，Netty 4.x 需要JDK 6以上版本支持。

### 为什么使用Netty

**NIO的缺点**
NIO的主要问题是：

- NIO的类库和API繁杂，学习成本高，你需要熟练掌握Selector、ServerSocketChannel、SocketChannel、ByteBuffer等。
- 需要熟悉Java多线程编程。这是因为NIO编程涉及到Reactor模式，你必须对多线程和网络编程非常熟悉，才能写出高质量的NIO程序。
- 臭名昭著的 epoll bug。它会导致Selector空轮询，最终导致CPU 100%。直到JDK1.7版本依然没得到根本性的解决。

 **Netty的优点**

- API使用简单，学习成本低。
- 功能强大，内置了多种解码编码器，支持多种协议。
- 性能高，对比其他主流的NIO框架，Netty的性能最优。
- 社区活跃，发现BUG会及时修复，迭代版本周期短，不断加入新的功能。

### Netty的使用场景

互联网行业：在分布式系统中，各个节点之间需要远程服务调用，高性能的 RPC 框架必不可少，Netty 作为异步高性能的通信框架，往往作为基础通信组件被这些 RPC 框架使用。典型的应用有：阿里分布式服务框架 Dubbo 的 RPC 框架使用 Dubbo 协议进行节点间通信，Dubbo 协议默认使用 Netty 作为基础通信组件，用于实现。各进程节点之间的内部通信。Rocketmq底层也是用的Netty作为基础通信组件。

游戏行业：无论是手游服务端还是大型的网络游戏，Java 语言得到了越来越广泛的应用。Netty 作为高性能的基础通信组件，它本身提供了 TCP/UDP 和 HTTP 协议栈。

大数据领域：经典的 Hadoop 的高性能通信和序列化组件 Avro 的 RPC 框架，默认采用 Netty 进行跨界点通信，它的 Netty Service 基于 Netty 框架二次封装实现。

### 线程模型


 目前存在的线程模式：

- 传统阻塞IO的服务模型
- Reactor模式

根据Reactor的数量和1处理资源的线程数不同，又分3种：

- Reactor单线程；
- Reactor多线程；
- 主从Reactor多线程

Netty的线程模型是基于主从Reactor多线程做了改进。

**2、传统阻塞IO的线程模型**
 采用阻塞IO获取输入的数据，每个连接都需要独立的线程来处理逻辑。存在的问题就是，当并发数很大时，就需要创建很多的线程，占用大量的资源。连接创建后，如果当前线程没有数据可读，该线程将会阻塞在读数据的方法上，造成线程资源浪费。

![](https://gitee.com/zysspace/pic/raw/master/images/202205122138037.png)

**3、Reactor模式(分发者模式/反应器模式/通知者模式)**
 针对传统阻塞IO的模型，做了以下两点改进：

- 基于IO复用模型：多个客户端共用一个阻塞对象，而不是每个客户端都对应一个阻塞对象
- 基于线程池复用线程资源：使用了线程池，而不是每来一个客户端就创建一个线程

Reactor模式的核心组成：

- Reactor：Reactor就是多个客户端共用的那一个阻塞对象，它单独起一个线程运行，负责监听和分发事件，将请求分发给适当的处理程序来进行处理
- Handler：处理程序要完成的实际事件，也就是真正执行业务逻辑的程序，它是非阻塞的

**4、单线程Reactor**

![](https://gitee.com/zysspace/pic/raw/master/images/202205122136323.png)

![](https://upload-images.jianshu.io/upload_images/11531502-3c33570d200d3984.png?imageMogr2/auto-orient/strip|imageView2/2/w/951/format/webp)

多个客户端请求连接，然后Reactor通过selector轮询判断哪些通道是有事件发生的，如果是连接事件，就到了Acceptor中建立连接；如果是其他读写事件，就有dispatch分发到对应的handler中进行处理。这种模式的缺点就是Reactor和Handler是在一个线程中的，如果Handler阻塞了，那么程序就阻塞了。

**5、Reactor多线程**

![](https://gitee.com/zysspace/pic/raw/master/images/202205122140389.png)

![](https://upload-images.jianshu.io/upload_images/11531502-26bbee6a1dcc9707.png?imageMogr2/auto-orient/strip|imageView2/2/w/1164/format/webp)

处理流程如下：

- Reactor对象通过Selector监听客户端请求事件，通过dispatch进行分发；
- 如果是连接事件，则由Acceptor通过accept方法处理连接请求，然后创建一个Handler对象响应事件；
- 如果不是连接请求，则由Reactor对象调用对应handler对象进行处理；handler只响应事件，不做具体的业务处理，它通过read方法读取数据后，会分发给线程池的某个线程进行业务处理，并将处理结果返回给handler；
- handler收到响应后，通过send方法将结果返回给client。

相比单Reactor单线程，这里将业务处理的事情交给了不同的线程去做，发挥了多核CPU的性能。但是Reactor只有一个，所有事件的监听和响应，都由一个Reactor去完成，并发性还是不好。

**6、主从Reactor多线程**

![](https://gitee.com/zysspace/pic/raw/master/images/202205122144933.png)

![](https:////upload-images.jianshu.io/upload_images/11531502-1eabcc75516598e4.png?imageMogr2/auto-orient/strip|imageView2/2/w/939/format/webp)



这个模型相比单reactor多线程的区别就是：专门搞了一个MainReactor来处理连接事件，如果不是连接事件，就分发给SubReactor进行处理。图中这个SubReactor只有一个，其实是可以有多个的，所以性能就上去了。

- 优点：父线程与子线程的交互简单、职责明确，父线程负责接收连接，子线程负责完成后续的业务处理；
- 缺点：编程复杂度高

### Netty线程模型

![](https://note.youdao.com/yws/public/resource/bbc5cfef81b2951d769807ed748343b9/xmlnote/C48453E100EB42049B7349168EA17EC1/85277)

Netty模型是基于主从Reactor多线程模型设计的。

- Netty有两组线程池，一个Boss Group，它专门负责客户端连接，另一个Work Group，专门负责网络读写；

- Boss Group和Work Group的类型都是NIOEventLoopGroup；

- NIOEventLoopGroup相当于一个事件循环组，这个组包含了多个事件循环，每一个循环都是NIOEventLoop；

- NIOEventLoop表示一个不断循环执行处理任务的线程，每个NIOEventLoop都有一个Selector，用于监听绑定在其上的socketChannel的网络通讯；

- Boss Group下的每个NIOEventLoop的执行步骤有3步：

  (1). 轮询accept连接事件；

  (2). 处理accept事件，与client建立连接，生成一个NioSocketChannel，并将其注册到某个work group下的NioEventLoop的selector上；

  (3). 处理任务队列的任务，即runAllTasks；

- 每个Work Group下的NioEventLoop循环执行以下步骤：

  (1). 轮询read、write事件；

  (2). 处理read、write事件，在对应的NioSocketChannel处理；

  (3). 处理任务队列的任务，即runAllTasks；

- 每个Work Group下的NioEventLoop在处理NioSocketChannel业务时，会使用pipeline(管道)，管道中维护了很多 handler 处理器用来处理 channel 中的数据。

### 重要组件

#### **NioEventLoop**

NioEventLoop 中维护了一个线程和任务队列，支持异步提交执行任务，线程启动时会调用 NioEventLoop 的 run 方法，执行 I/O 任务和非 I/O 任务：

I/O 任务，即 selectionKey 中 ready 的事件，如 accept、connect、read、write 等，由 processSelectedKeys 方法触发。

非 IO 任务，添加到 taskQueue 中的任务，如 register0、bind0 等任务，由 runAllTasks 方法触发。

#### **NioEventLoopGroup**

NioEventLoopGroup，主要管理 eventLoop 的生命周期，可以理解为一个线程池，内部维护了一组线程，每个线程(NioEventLoop)负责处理多个 Channel 上的事件，而一个 Channel 只对应于一个线程。

每个EventLoopGroup里包括一个或多个EventLoop，每个EventLoop中维护一个Selector实例。

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91Y2MuYWxpY2RuLmNvbS9waWMvZGV2ZWxvcGVyLWVjb2xvZ3kvN2E5NWVlYjkzM2JlNDQ3MGFjZGM1ZjBmMDdhZmJjMmEucG5n?x-oss-process=image/format,png)

#### **Bootstrap、ServerBootstrap**

一个 Netty 应用通常由一个 Bootstrap 开始，主要作用是配置整个 Netty 程序，串联各个组件，Netty 中 Bootstrap 类是客户端程序的启动引导类，ServerBootstrap 是服务端启动引导类。

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91Y2MuYWxpY2RuLmNvbS9waWMvZGV2ZWxvcGVyLWVjb2xvZ3kvNDBjZjc2MjY2MGQ5NDU1ZWI2MDY2MTE5Y2Y1ZWViNDkucG5n?x-oss-process=image/format,png)

一般来说，使用Bootstrap创建启动器的步骤可分为以下几步：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91Y2MuYWxpY2RuLmNvbS9waWMvZGV2ZWxvcGVyLWVjb2xvZ3kvYWU1YzZlZDMwMDhkNDMyM2FhYTgxN2U5Y2I0NjQzN2EucG5n?x-oss-process=image/format,png)

##### group()

服务端要使用两个线程组：

bossGroup 用于监听客户端连接，专门负责与客户端创建连接，并把连接注册到workerGroup的Selector中。
workerGroup用于处理每一个连接发生的读写事件。
一般创建线程组直接使用以下new就完事了：

```java
EventLoopGroup bossGroup = new NioEventLoopGroup();
EventLoopGroup workerGroup = new NioEventLoopGroup();
```

既然是线程组，那线程数默认是多少呢？深入源码：


```java
 //使用一个常量保存
    private static final int DEFAULT_EVENT_LOOP_THREADS;
static {
    //NettyRuntime.availableProcessors() * 2，cpu核数的两倍赋值给常量
    DEFAULT_EVENT_LOOP_THREADS = Math.max(1, SystemPropertyUtil.getInt(
            "io.netty.eventLoopThreads", NettyRuntime.availableProcessors() * 2));
 
    if (logger.isDebugEnabled()) {
        logger.debug("-Dio.netty.eventLoopThreads: {}", DEFAULT_EVENT_LOOP_THREADS);
    }
}

protected MultithreadEventLoopGroup(int nThreads, Executor executor, Object... args) {
    //如果不传入，则使用常量的值，也就是cpu核数的两倍
    super(nThreads == 0 ? DEFAULT_EVENT_LOOP_THREADS : nThreads, executor, args);
}
```
默认的线程数是cpu核数的两倍。

假设想自定义线程数，可以使用有参构造器：

```java
//设置bossGroup线程数为1
EventLoopGroup bossGroup = new NioEventLoopGroup(1);
//设置workerGroup线程数为16
EventLoopGroup workerGroup = new NioEventLoopGroup(16)
```

##### channel()

这个方法用于设置通道类型，当建立连接后，会根据这个设置创建对应的Channel实例。

```java
bootstrap.group(bossGroup, workerGroup) //设置两个线程组
        // 使用NioServerSocketChannel作为服务器的通道实现
        .channel(NioServerSocketChannel.class)
```

通道类型有以下：

NioSocketChannel： 异步非阻塞的客户端 TCP Socket 连接。

NioServerSocketChannel： 异步非阻塞的服务器端 TCP Socket 连接。

常用的就是这两个通道类型，因为是异步非阻塞的。所以是首选。

OioSocketChannel： 同步阻塞的客户端 TCP Socket 连接。

OioServerSocketChannel： 同步阻塞的服务器端 TCP Socket 连接。

##### option()与childOption()

option()设置的是服务端用于接收进来的连接，也就是boosGroup线程。

childOption()是提供给父管道接收到的连接，也就是workerGroup线程。

我们看一下常用的一些设置有哪些：

SocketChannel参数，也就是childOption()常用的参数：
**SO_RCVBUF** Socket参数，TCP数据接收缓冲区大小。
**TCP_NODELAY** TCP参数，立即发送数据，默认值为Ture。
**SO_KEEPALIVE** Socket参数，连接保活，默认值为False。启用该功能时，TCP会主动探测空闲连接的有效性。

ServerSocketChannel参数，也就是option()常用参数：

**SO_BACKLOG** Socket参数，服务端接受连接的队列长度，如果队列已满，客户端连接将被拒绝。默认值，Windows为200，其他为128

#### **Future、ChannelFuture**

- Netty中的I/O操作都是异步的，包括bind、write和connect。这些操作会返回一个ChannelFuture对象，而不会立即返回操作结果。
- 调用者不能立即得到返回结果，而是通过Futrue-Listener机制，用户可以主动获取或者通过通知机制获得IO操作的结果。
- Netty的异步是建立在future和callback之上的。callback是回调，future表示异步执行的结果，它的核心思想是：假设有个方法fun()，计算过程可能非常耗时，等待fun()返回要很久，那么可以在调用fun()的时候，立马返回一个future，后续通过future去监控fun()方法的处理过程，这就是future-listener机制。
- ChannelFuture提供操作完成时一种异步通知的方式。一般在Socket编程中，等待响应结果都是同步阻塞的，而Netty则不会造成阻塞，因为ChannelFuture是采取类似观察者模式的形式进行获取结果。
- 用户可以通过注册监听函数，来获取操作真正的结果，ChannelFuture常用的函数如下

```
// 判断当前操作是否完成
isDone
// 判断当前操作是否成功
isSuccess
// 获取操作失败的原因
getCause
// 判断当前操作是否被取消
isCancelled
// 注册监听器
addListener
```

**使用监听器：**
在NettyServer中的“启动并绑定端口”下面加上如下代码：

```java
// 5. 启动服务器并绑定端口
ChannelFuture cf = bootstrap.bind(6666).sync();
// 注册监听器
cf.addListener(new ChannelFutureListener() {
    @Override
    public void operationComplete(ChannelFuture cf) throws Exception {
        if (cf.isSuccess()) {
            System.out.println("绑定端口成功");
        } else {
            System.out.println("绑定端口失败");
        }
    }
});
```

#### **Channel**

Netty 网络通信的组件，能够用于执行网络 I/O 操作。Channel 为用户提供：

1）当前网络连接的通道的状态（例如是否打开？是否已连接？）

2）网络连接的配置参数 （例如接收缓冲区大小）

3）提供异步的网络 I/O 操作(如建立连接，读写，绑定端口)，异步调用意味着任何 I/O 调用都将立即返回，并且不保证在调用结束时所请求的 I/O 操作已完成。

4）调用立即返回一个 ChannelFuture 实例，通过注册监听器到 ChannelFuture 上，可以 I/O 操作成功、失败或取消时回调通知调用方。

5）支持关联 I/O 操作与对应的处理程序。

不同协议、不同的阻塞类型的连接都有不同的 Channel 类型与之对应。

下面是一些常用的 Channel 类型：

 NioSocketChannel，异步的客户端 TCP Socket 连接。

 NioServerSocketChannel，异步的服务器端 TCP Socket 连接。 

 NioDatagramChannel，异步的 UDP 连接。

 NioSctpChannel，异步的客户端 Sctp 连接。

 NioSctpServerChannel，异步的 Sctp 服务器端连接。 这些通道涵盖了 UDP 和 TCP 网络 IO 以及文件 IO。        

##### 获取channel的状态

```
boolean isOpen(); //如果通道打开，则返回true
boolean isRegistered();//如果通道注册到EventLoop，则返回true
boolean isActive();//如果通道处于活动状态并且已连接，则返回true
boolean isWritable();//当且仅当I/O线程将立即执行请求的写入操作时，返回true。
```

#####  获取channel的配置参数

```java
ChannelConfig config = channel.config();//获取配置参数
//获取ChannelOption.SO_BACKLOG参数,
Integer soBackLogConfig = config.getOption(ChannelOption.SO_BACKLOG);
```

##### channel支持的IO操作

**写操作**，这里演示从服务端写消息发送到客户端：

```java
@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
    ctx.channel().writeAndFlush(Unpooled.copiedBuffer("这波啊，这波是肉蛋葱鸡~", CharsetUtil.UTF_8));
}
```

通过channel获取ChannelPipeline，并做相关的处理：

```java
//获取ChannelPipeline对象
ChannelPipeline pipeline = ctx.channel().pipeline();
//往pipeline中添加ChannelHandler处理器，装配流水线
pipeline.addLast(new MyServerHandler());
```

Channel和EventLoop关系图

![](https://gitee.com/zysspace/pic/raw/master/images/202205212236802.png)

#### **Selector**

Netty 基于 Selector 对象实现 I/O 多路复用，通过 Selector 一个线程可以监听多个连接的 Channel 事件。

当向一个 Selector 中注册 Channel 后，Selector 内部的机制就可以自动不断地查询(Select) 这些注册的 Channel 是否有已就绪的 I/O 事件（例如可读，可写，网络连接完成等），这样程序就可以很简单地使用一个线程高效地管理多个 Channel 。

#### **ChannelHandler**

ChannelHandler 是一个接口，处理 I/O 事件或拦截 I/O 操作，并将其转发到其 ChannelPipeline(业务处理链)中的下一个处理程序。

ChannelHandler 本身并没有提供很多方法，因为这个接口有许多的方法需要实现，方便使用期间，可以继承它的子类：

 ChannelInboundHandler 用于处理入站 I/O 事件。

 ChannelOutboundHandler 用于处理出站 I/O 操作。              

或者使用以下适配器类：

  ChannelInboundHandlerAdapter 用于处理入站 I/O 事件。

  ChannelOutboundHandlerAdapter 用于处理出站 I/O 操作。  

ChannelInboundHandlerAdapter处理器常用的事件有：

- 注册事件 fireChannelRegistered。

- 连接建立事件 fireChannelActive。
- 读事件和读完成事件 fireChannelRead、fireChannelReadComplete。
- 异常通知事件 fireExceptionCaught。
- 用户自定义事件 fireUserEventTriggered。
- Channel 可写状态变化事件 fireChannelWritabilityChanged。
- 连接关闭事件 fireChannelInactive。

ChannelOutboundHandler处理器常用的事件有：

- 端口绑定 bind。
- 连接服务端 connect。
- 写事件 write。
- 刷新时间 flush。
- 读事件 read。
- 主动断开连接 disconnect。
- 关闭 channel 事件 close。

#### **ChannelHandlerContext**

在Netty中，Handler处理器是有我们定义的，上面讲过通过集成入站处理器或者出站处理器实现。这时如果我们想在Handler中获取pipeline对象，或者channel对象，怎么获取呢。

于是Netty设计了这个ChannelHandlerContext上下文对象，就可以拿到channel、pipeline等对象，就可以进行读写等操作。
![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91Y2MuYWxpY2RuLmNvbS9waWMvZGV2ZWxvcGVyLWVjb2xvZ3kvNGM2ZTkzMTkyMTNiNDg5YmJmY2MyZDc2OTdjZjAzYjAucG5n?x-oss-process=image/format,png)

#### **ChannelPipline**

在前面介绍Channel时，我们知道可以在channel中装配ChannelHandler流水线处理器，那一个channel不可能只有一个channelHandler处理器，肯定是有很多的，既然是很多channelHandler在一个流水线工作，肯定是有顺序的。

于是pipeline就出现了，pipeline相当于处理器的容器。初始化channel时，把channelHandler按顺序装在pipeline中，就可以实现按序执行channelHandler了。

ChannelPipline 保存 ChannelHandler 的 List，用于处理或拦截 Channel 的入站事件和出站操作。

ChannelPipeline 实现了一种高级形式的拦截过滤器模式，使用户可以完全控制事件的处理方式，以及 Channel 中各个的 ChannelHandler 如何相互交互。

在 Netty 中每个 Channel 都有且仅有一个 ChannelPipeline 与之对应，它们的组成关系如下： 

![](https://note.youdao.com/yws/public/resource/bbc5cfef81b2951d769807ed748343b9/xmlnote/324C604C8D5241E7A415FF19FCF9F91F/84844)



一个 Channel 包含了一个 ChannelPipeline，而 ChannelPipeline 中又维护了一个由 ChannelHandlerContext 组成的双向链表，并且每个 ChannelHandlerContext 中又关联着一个 ChannelHandler。

read事件(入站事件)和write事件(出站事件)在一个双向链表中，入站事件会从链表 head 往后传递到最后一个入站的 handler，出站事件会从链表 tail 往前传递到最前一个出站的 handler，两种类型的 handler 互不干扰。

在Bootstrap中childHandler()方法需要初始化通道，实例化一个ChannelInitializer，这时候需要重写initChannel()初始化通道的方法，装配流水线就是在这个地方进行。代码演示如下：

```java
//使用匿名内部类的形式初始化通道对象
bootstrap.childHandler(new ChannelInitializer<SocketChannel>() {
    @Override
    protected void initChannel(SocketChannel socketChannel) throws Exception {
        //给pipeline管道设置自定义的处理器
        socketChannel.pipeline().addLast(new MyServerHandler());
    }
});
```

#### bind()

提供用于服务端或者客户端绑定服务器地址和端口号，默认是异步启动。如果加上sync()方法则是同步。

#### 优雅地关闭EventLoopGroup

```java
//释放掉所有的资源，包括创建的线程
bossGroup.shutdownGracefully();
workerGroup.shutdownGracefully();
```

会关闭所有的child Channel。关闭之后，释放掉底层的资源。

### hello world

服务端

```java
public class NettyServer {

    public static void main(String[] args) throws Exception {

        // 创建两个线程组bossGroup和workerGroup, 含有的子线程NioEventLoop的个数默认为cpu核数的两倍
        // bossGroup只是处理连接请求 ,真正的和客户端业务处理，会交给workerGroup完成
        EventLoopGroup bossGroup = new NioEventLoopGroup(3);
        EventLoopGroup workerGroup = new NioEventLoopGroup(8);
        try {
            // 创建服务器端的启动对象
            ServerBootstrap bootstrap = new ServerBootstrap();
            // 使用链式编程来配置参数
            bootstrap.group(bossGroup, workerGroup) //设置两个线程组
                    // 使用NioServerSocketChannel作为服务器的通道实现
                    .channel(NioServerSocketChannel.class)
                    // 初始化服务器连接队列大小，服务端处理客户端连接请求是顺序处理的,所以同一时间只能处理一个客户端连接。
                    // 多个客户端同时来的时候,服务端将不能处理的客户端连接请求放在队列中等待处理
                    .option(ChannelOption.SO_BACKLOG, 1024)
                    .childHandler(new ChannelInitializer<SocketChannel>() {//创建通道初始化对象，设置初始化参数，在 SocketChannel 建立起来之前执行

                        @Override
                        protected void initChannel(SocketChannel ch) throws Exception {
                            //对workerGroup的SocketChannel设置处理器
                            ch.pipeline().addLast(new NettyServerHandler());
                        }
                    });
            System.out.println("netty server start。。");
            // 绑定一个端口并且同步, 生成了一个ChannelFuture异步对象，通过isDone()等方法可以判断异步事件的执行情况
            // 启动服务器(并绑定端口)，bind是异步操作，sync方法是等待异步操作执行完毕
            ChannelFuture cf = bootstrap.bind(9000).sync();
            // 给cf注册监听器，监听我们关心的事件
            /*cf.addListener(new ChannelFutureListener() {
                @Override
                public void operationComplete(ChannelFuture future) throws Exception {
                    if (cf.isSuccess()) {
                        System.out.println("监听端口9000成功");
                    } else {
                        System.out.println("监听端口9000失败");
                    }
                }
            });*/
            // 等待服务端监听端口关闭，closeFuture是异步操作
            // 通过sync方法同步等待通道关闭处理完毕，这里会阻塞等待通道关闭完成，内部调用的是Object的wait()方法
            cf.channel().closeFuture().sync();
        } finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }
}
```

定义NettyServerHandler

```java
/**
 * 自定义Handler需要继承netty规定好的某个HandlerAdapter(规范)
 */
public class NettyServerHandler extends ChannelInboundHandlerAdapter {

    /**
     * 当客户端连接服务器完成就会触发该方法
     *
     * @param ctx
     * @throws Exception
     */
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        System.out.println("客户端连接通道建立完成");
    }

    /**
     * 读取客户端发送的数据
     *
     * @param ctx 上下文对象, 含有通道channel，管道pipeline
     * @param msg 就是客户端发送的数据
     * @throws Exception
     */
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        //Channel channel = ctx.channel();
        //ChannelPipeline pipeline = ctx.pipeline(); //本质是一个双向链接, 出站入站
        //将 msg 转成一个 ByteBuf，类似NIO 的 ByteBuffer
        ByteBuf buf = (ByteBuf) msg;
        System.out.println("收到客户端的消息:" + buf.toString(CharsetUtil.UTF_8));
    }

    /**
     * 数据读取完毕处理方法
     *
     * @param ctx
     * @throws Exception
     */
    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) {
        ByteBuf buf = Unpooled.copiedBuffer("HelloClient".getBytes(CharsetUtil.UTF_8));
        ctx.writeAndFlush(buf);
    }

    /**
     * 处理异常, 一般是需要关闭通道
     *
     * @param ctx
     * @param cause
     * @throws Exception
     */
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        ctx.close();
    }
}
```

客户端：

```java
public class NettyClient {
    public static void main(String[] args) throws Exception {
        //客户端需要一个事件循环组
        EventLoopGroup group = new NioEventLoopGroup();
        try {
            //创建客户端启动对象
            //注意客户端使用的不是ServerBootstrap而是Bootstrap
            Bootstrap bootstrap = new Bootstrap();
            //设置相关参数
            bootstrap.group(group) //设置线程组
                    .channel(NioSocketChannel.class) // 使用NioSocketChannel作为客户端的通道实现
                    .handler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) throws Exception {
                            //加入处理器
                            ch.pipeline().addLast(new NettyClientHandler());
                        }
                    });

            System.out.println("netty client start。。");
            //启动客户端去连接服务器端
            ChannelFuture cf = bootstrap.connect("127.0.0.1", 9000).sync();
            //对通道关闭进行监听
            cf.channel().closeFuture().sync();
        } finally {
            group.shutdownGracefully();
        }
    }
}
```

定义NettyClientHandler

```java
public class NettyClientHandler extends ChannelInboundHandlerAdapter {

    /**
     * 当客户端连接服务器完成就会触发该方法
     *
     * @param ctx
     * @throws Exception
     */
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        ByteBuf buf = Unpooled.copiedBuffer("HelloServer".getBytes(CharsetUtil.UTF_8));
        ctx.writeAndFlush(buf);
    }

    //当通道有读取事件时会触发，即服务端发送数据给客户端
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        ByteBuf buf = (ByteBuf) msg;
        System.out.println("收到服务端的消息:" + buf.toString(CharsetUtil.UTF_8));
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        cause.printStackTrace();
        ctx.close();
    }
}
```

服务端开启9000端口后，客户端和服务端可以进行通讯了。

服务端：

> netty server start。。
> 客户端连接通道建立完成
> 收到客户端的消息:HelloServer

客户端：

> netty client start。。
> 收到服务端的消息:HelloClient

### 总结

本文主要讲述Netty的一些特性以及重要组件，希望看完之后能对Netty框架有一个比较直观的感受，希望能帮助读者快速入门Netty，减少一些弯路。

我们平常在使用的时候，只需要定义各种各样的Handler，其他的都是固定的API。
