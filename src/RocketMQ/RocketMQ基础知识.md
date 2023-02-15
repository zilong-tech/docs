---
title: RocketMQ基础知识
author: 程序员子龙
index: true
icon: discover
category:
- RocketMQ
---

### RocketMQ介绍

 RocketMQ是阿里巴巴开源的一个消息中间件，在阿里内部历经了双十一等很多高并发场景的考验，能够处理亿万级别的消息。2016年开源后捐赠给Apache，现在是Apache的一个顶级项目。在阿里内部，`RocketMQ` 很好地服务了集团大大小小上千个应用，在每年的双十一当天，更有不可思议的万亿级消息通过 `RocketMQ` 流转。

`RocketMQ` 是一个 **队列模型** 的消息中间件，具有**高性能、高可靠、高实时、分布式** 的特点。它是一个采用 `Java` 语言开发的分布式的消息系统，支持事务消息、顺序消息、批量消息、定时消息、消息回溯等。

### RocketMQ特性

 **订阅与发布**

消息的发布是指某个生产者向某个topic发送消息；消息的订阅是指某个消费者关注了某个topic中带有某些tag的消息，进而从该topic消费数据。

 **消息顺序**

消息有序指的是一类消息消费时，能按照发送的顺序来消费。例如：一个订单产生了三条消息分别是订单创建、订单付款、订单完成。消费时要按照这个顺序消费才能有意义，但是同时订单之间是可以并行消费的。RocketMQ可以严格的保证消息有序。

顺序消息分为全局顺序消息与分区顺序消息，全局顺序是指某个Topic下的所有消息都要保证顺序；部分顺序消息只要保证每一组消息被顺序消费即可。

- 全局顺序 对于指定的一个 Topic，所有消息按照严格的先入先出（FIFO）的顺序进行发布和消费。 适用场景：性能要求不高，所有的消息严格按照 FIFO 原则进行消息发布和消费的场景
- 分区顺序 对于指定的一个 Topic，所有消息根据 sharding key 进行区块分区。 同一个分区内的消息按照严格的 FIFO 顺序进行发布和消费。 Sharding key 是顺序消息中用来区分不同分区的关键字段，和普通消息的 Key 是完全不同的概念。 适用场景：性能要求高，以 sharding key 作为分区字段，在同一个区块中严格的按照 FIFO 原则进行消息发布和消费的场景。

**消息过滤**

RocketMQ的消费者可以根据Tag进行消息过滤，也支持自定义属性过滤。消息过滤目前是在Broker端实现的，优点是减少了对于Consumer无用消息的网络传输，缺点是增加了Broker的负担、而且实现相对复杂。

**消息可靠性**

RocketMQ支持消息的高可靠，影响消息可靠性的几种情况：

1. Broker非正常关闭
2. Broker异常Crash
3. OS Crash
4. 机器掉电，但是能立即恢复供电情况
5. 机器无法开机（可能是cpu、主板、内存等关键设备损坏）
6. 磁盘设备损坏

1)、2)、3)、4) 四种情况都属于硬件资源可立即恢复情况，RocketMQ在这四种情况下能保证消息不丢，或者丢失少量数据（依赖刷盘方式是同步还是异步）。

5)、6)属于单点故障，且无法恢复，一旦发生，在此单点上的消息全部丢失。RocketMQ在这两种情况下，通过异步复制，可保证99%的消息不丢，但是仍然会有极少量的消息可能丢失。通过同步双写技术可以完全避免单点，同步双写势必会影响性能，适合对消息可靠性要求极高的场合，例如与Money相关的应用。注：RocketMQ从3.0版本开始支持同步双写。

**至少一次**

至少一次(At least Once)指每个消息必须投递一次。Consumer先Pull消息到本地，消费完成后，才向服务器返回ack，如果没有消费一定不会ack消息，所以RocketMQ可以很好的支持此特性。

**事务消息**

RocketMQ事务消息（Transactional Message）是指应用本地事务和发送消息操作可以被定义到全局事务中，要么同时成功，要么同时失败。RocketMQ的事务消息提供类似 X/Open XA 的分布事务功能，通过事务消息能达到分布式事务的最终一致。

**定时消息**

定时消息（延迟队列）是指消息发送到broker后，不会立即被消费，等待特定时间投递给真正的topic。 broker有配置项messageDelayLevel，默认值为“1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h”，18个level。可以配置自定义messageDelayLevel。注意，messageDelayLevel是broker的属性，不属于某个topic。发消息时，设置delayLevel等级即可：msg.setDelayLevel(level)。level有以下三种情况：

- level == 0，消息为非延迟消息
- 1<=level<=maxLevel，消息延迟特定时间，例如level==1，延迟1s
- level > maxLevel，则level== maxLevel，例如level==20，延迟2h

定时消息会暂存在名为SCHEDULE_TOPIC_XXXX的topic中，并根据delayTimeLevel存入特定的queue，queueId = delayTimeLevel – 1，即一个queue只存相同延迟的消息，保证具有相同发送延迟的消息能够顺序消费。broker会调度地消费SCHEDULE_TOPIC_XXXX，将消息写入真实的topic。

需要注意的是，定时消息会在第一次写入和调度写入真实topic时都会计数，因此发送数量、tps都会变高。

**消息重试**

Consumer消费消息失败后，要提供一种重试机制，令消息再消费一次。Consumer消费消息失败通常可以认为有以下几种情况：

- 由于消息本身的原因，例如反序列化失败，消息数据本身无法处理（例如话费充值，当前消息的手机号被注销，无法充值）等。这种错误通常需要跳过这条消息，再消费其它消息，而这条失败的消息即使立刻重试消费，99%也不成功，所以最好提供一种定时重试机制，即过10秒后再重试。
- 由于依赖的下游应用服务不可用，例如db连接不可用，外系统网络不可达等。遇到这种错误，即使跳过当前失败的消息，消费其他消息同样也会报错。这种情况建议应用sleep 30s，再消费下一条消息，这样可以减轻Broker重试消息的压力。

RocketMQ会为每个消费组都设置一个Topic名称为“%RETRY%+consumerGroup”的重试队列（这里需要注意的是，这个Topic的重试队列是针对消费组，而不是针对每个Topic设置的），用于暂时保存因为各种异常而导致Consumer端无法消费的消息。考虑到异常恢复起来需要一些时间，会为重试队列设置多个重试级别，每个重试级别都有与之对应的重新投递延时，重试次数越多投递延时就越大。RocketMQ对于重试消息的处理是先保存至Topic名称为“SCHEDULE_TOPIC_XXXX”的延迟队列中，后台定时任务按照对应的时间进行Delay后重新保存至“%RETRY%+consumerGroup”的重试队列中。

**消息重投**

生产者在发送消息时，同步消息失败会重投，异步消息有重试，oneway没有任何保证。消息重投保证消息尽可能发送成功、不丢失，但可能会造成消息重复，消息重复在RocketMQ中是无法避免的问题。消息重复在一般情况下不会发生，当出现消息量大、网络抖动，消息重复就会是大概率事件。另外，生产者主动重发、consumer负载变化也会导致重复消息。如下方法可以设置消息重试策略：

- retryTimesWhenSendFailed:同步发送失败重投次数，默认为2，因此生产者会最多尝试发送retryTimesWhenSendFailed + 1次。不会选择上次失败的broker，尝试向其他broker发送，最大程度保证消息不丢。超过重投次数，抛出异常，由客户端保证消息不丢。当出现RemotingException、MQClientException和部分MQBrokerException时会重投。
- retryTimesWhenSendAsyncFailed:异步发送失败重试次数，异步重试不会选择其他broker，仅在同一个broker上做重试，不保证消息不丢。
- retryAnotherBrokerWhenNotStoreOK:消息刷盘（主或备）超时或slave不可用（返回状态非SEND_OK），是否尝试发送到其他broker，默认false。十分重要消息可以开启。

**死信队列**

死信队列用于处理无法被正常消费的消息。当一条消息初次消费失败，消息队列会自动进行消息重试；达到最大重试次数后，若消费依然失败，则表明消费者在正常情况下无法正确地消费该消息，此时，消息队列 不会立刻将消息丢弃，而是将其发送到该消费者对应的特殊队列中。

RocketMQ将这种正常情况下无法被消费的消息称为死信消息（Dead-Letter Message），将存储死信消息的特殊队列称为死信队列（Dead-Letter Queue）。在RocketMQ中，可以通过使用console控制台对死信队列中的消息进行重发来使得消费者实例再次进行消费。

### MQ 产品比较

![](https://note.youdao.com/yws/public/resource/f2a7001c83d43549dd4bfc76c3b9fa4c/90D2FA430B2C4BC2AB9E14AE619D4200?ynotemdtimestamp=1654951824028)

![](https://raw.githubusercontent.com/zysspace/images/master/images202206111527326.jpg)

官方提供了一些不同于kafka的对比差异： 
https://rocketmq.apache.org/docs/motivation/

### **物理架构**

![](https://github.com/apache/rocketmq/raw/master/docs/cn/image/rocketmq_architecture_3.png)

RocketMQ由以下这几个组件组成：

- NameServer : 提供轻量级的Broker路由服务，它是 RocketMQ 的服务注册中心。

  Broker 在启动时向所有 NameServer 注册（主要是服务器地址等），生产者在发送消息之前先从 NameServer 获取 Broker 服务器地址列表（消费者一 样），然后根据负载均衡算法从列表中选择一台服务器进行消息发送。 NameServer 与每台 Broker 服务保持长连接，并间隔 30S 检查 Broker 是否存活，如果检测到 Broker 宕机，则从路由注册表中将其移除。这样就可以实 现 RocketMQ 的高可用。

- Broker：实际处理消息存储、转发等服务的核心组件。

- Producer：消息生产者集群。通常是业务系统中的一个功能模块。

- Consumer：消息消费者集群。通常也是业务系统中的一个功能模块。

- Topic：区分消息的种类；一个发送者可以发送消息给一个或者多个Topic；一个消息的接收者可以订阅一个或者多个Topic消息

**物理架构中的整体运转** 

1、NameServer 先启动 

Broker 启动时向 NameServer 注册 

生产者在发送某个主题的消息之前先从 NamerServer 获取 Broker 服务器地址列表（有可能是集群），然后根据负载均衡算法从列表中选择一台 Broker 进行消息发送。 

NameServer 与每台 Broker 服务器保持长连接，并间隔 30S 检测 Broker 是否存活，如果检测到 Broker 宕机（使用心跳机制，如果检测超过120S），则从路由注册表中将其移除。 

消费者在订阅某个主题的消息之前从 NamerServer 获取 Broker 服务器地址列表（有可能是集群），但是消费者选择从 Broker 中订阅消息，订阅规则由 Broker 配置决定。 

### 安装RocketMQ 

#### window安装

下载地址：https://github.com/apache/rocketmq/releases。

4.7版本下载地址：https://rocketmq.apache.org/release_notes/release-notes-4.7.0/

![img](https://upload-images.jianshu.io/upload_images/11553600-f85fd825bdbdcfd7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/873/format/webp)

**下载后解压**

![](https://raw.githubusercontent.com/zysspace/images/master/images202206111606219.webp)

**配置环境变量**

变量名：JAVA_HOME

变量值：D:\software\java

变量名：ROCKETMQ_HOME
变量值：D:\Software\rocketmq-4.7.0

变量名：NAMESRV_ADDR

变量值：localhost:9876

注意：一定要配置JAVA_HOME、ROCKETMQ_HOME

**启动Name Server**

RocketMQ默认预设的JVM内存是4G，这是RocketMQ给我们的最佳配置。但是如果机器的配置不够4G内存的，所以需要调整下JVM内存大小。

```shell
JAVA_OPT="${JAVA_OPT} -server -Xms512m -Xmx512m -Xmn256m -
XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=320m"
```

打开新的 powershell 窗口。然后将目录更改为rocketmq类型并运行：

```shell
.\bin\mqnamesrv.cmd
```

![](https://upload-images.jianshu.io/upload_images/11553600-cb28b32c835b66b4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1000/format/webp)

**启动broker**

Broker的默认预设内存是8G，启动前，如果内存不够，同样需要调整下JVM内存。

```
JAVA_OPT="${JAVA_OPT} -server -Xms512m -Xmx512m"
```

修改$ROCKETMQ_HOME/conf/broker.conf

```
#自动创建topic
autoCreateTopicEnable=true
```

打开新的 powershell 窗口。然后将目录更改为rocketmq类型并运行（参数可以省略）：

```shell
.\bin\mqbroker.cmd -n localhost:9876 autoCreateTopicEnable=true
```

RocketMQ 环境已经搭建完毕！

**使用命令行发送和消费消息**

发送消息,默认会发1000条消息

```shell
.\bin\tools.cmd  org.apache.rocketmq.example.quickstart.Producer
```

消费消息

```shell
.\bin\tools.cmd  org.apache.rocketmq.example.quickstart.Consumer
```

#### Linux安装

**配置环境变量**

使用 vi ~/.bash_profile编辑文件，在下面加入以下内容：

```shell
export JAVA_HOME=/app/jdk1.8/
export ROCKETMQ_HOME=/app/rocketmq/rocketmq-all-4.9.1-bin-release
PATH=$ROCKETMQ_HOME/bin:$JAVA_HOME/bin:$PATH:$HOME/.local/bin:$HOME/bin
export PATH
```

执行source ~/.bash_profile让环境变量生效。

ROCKETMQ_HOME的环境变量是必须要单独配置的，如果不配置的话，启动NameSever和Broker都会报错。

**NameServer服务搭建**

根据实际情况修改内存，RocketMQ默认预设的JVM内存是4G，这是RocketMQ给我们的最佳配置。但是如果不够4G内存的，所以需要调整下JVM内存大小。

修改的方式是直接修改runserver.sh。 用vi runserver.sh编辑这个脚本，在脚本中找到这一行调整内存大小为512M

```shell
JAVA_OPT="${JAVA_OPT} -server -Xms512m -Xmx512m -Xmn256m -
XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=320m"
```

```shell
  > nohup sh bin/mqnamesrv &
  > tail -f ~/logs/rocketmqlogs/namesrv.log
  The Name Server boot success...
```

**Broker服务搭建**

 启动Broker的脚本是runbroker.sh。Broker的默认预设内存是8G，启动前，如果内存不够，同样需要调整下JVM内存。vi runbroker.sh，找到这一行，进行内存调整

```
JAVA_OPT="${JAVA_OPT} -server -Xms512m -Xmx512m"
```

找到$ROCKETMQ_HOME/conf/broker.conf， vi指令进行编辑，在最下面加入一个配置：

```
autoCreateTopicEnable=true
```

```shell
  > nohup sh bin/mqbroker -n localhost:9876 &
  > tail -f ~/logs/rocketmqlogs/broker.log 
  The broker[%s, 172.30.30.233:10911] boot success...
```

**发送消息和接收消息**

首先需要配置一个环境变量NAMESRV_ADDR指向我们启动的NameServer服务。

```
export NAMESRV_ADDR=localhost:9876
```

发送消息

```
sh bin/tools.sh org.apache.rocketmq.example.quickstart.Producer
```

消费消息

```
sh bin/tools.sh org.apache.rocketmq.example.quickstart.Consumer
```

**关闭服务**

```
> sh bin/mqshutdown broker
The mqbroker(36695) is running...
Send shutdown request to mqbroker(36695) OK

> sh bin/mqshutdown namesrv
The mqnamesrv(36664) is running...
Send shutdown request to mqnamesrv(36664) OK
```

#### 搭建管理平台

Rocket的社区扩展项目中提供了一个控制台，地址： https://github.com/apache/rocketmq-dashboard

下载后，解压并进入对应的目录，使用maven进行编译

```shell
mvn clean package -Dmaven.test.skip=true
```

要注意，在这个项目的application.yml中需要指定nameserver的地址。默认这个属性是指向本地。如果配置为空，会读取环境变量NAMESRV_ADDR。

然后执行：

```
java -jar rocketmq-dashboard-1.0.1-SNAPSHOT.jar
```

启动完成后，可以访问 http://127.0.0.1:8080

![](https://raw.githubusercontent.com/zysspace/images/master/images202206111941307.png)

### **RocketMQ** **概念模型** 

![](https://note.youdao.com/yws/public/resource/fa3c32cea984593b3c8cf5faeb16e634/526184557CED4B54988CD129B567474C?ynotemdtimestamp=1654930712053)

#### 消息模型（Message Model）

 RocketMQ主要由 Producer、Broker、Consumer 三部分组成，其中Producer 负责生产消息，Consumer 负责消费消息，Broker 负责存储消息。Broker 在实际部署过程中对应一台服务器，每个 Broker 可以存储多个Topic的消息，每个Topic的消息也可以分片存储于不同的 Broker。Message Queue 用于存储消息的物理地址，每个Topic中的消息地址存储于多个 Message Queue 中。ConsumerGroup 由多个Consumer 实例构成。

#### 消息队列(Message Queue)

简称 Queue 或 Q。消息物理管理单位。一个 Topic 将有若干个 Q。若一个 Topic 创建在不同的 Broker，则不同的 broker 上都有若干 Q，消息将物理地存储落在不同 Broker 结点上，具有水平扩展的能力。 

无论生产者还是消费者，实际的生产和消费都是针对 Q 级别。例如 Producer 发送消息的时候，会预先选择（默认轮询）好该 Topic 下面的某一条 Q 发送；Consumer 消费的时候也会负载均衡地分配若干个 Q，只拉取对应 Q 的消息。 

每一条 message queue 均对应一个文件，**这个文件存储了实际消息的索引信息**。并且即使文件被删除，也能通过实际纯粹的消息文件

（commit log） 恢复回来。

**一个 `Topic` 分布在多个 `Broker`上，一个 `Broker` 可以配置多个 `Topic` ，它们是多对多的关系**。

![img](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef38687488a5a4.jpg)

#### 主题（Topic）

 表示一类消息的集合，每个主题包含若干条消息，每条消息只能属于一个主题，是RocketMQ进行消息订阅的基本单位。

 Topic只是一个逻辑概念，并不实际保存消息。同一个Topic下的消息，会分片保存到不同的Broker上，而每一个分片单位，就叫做MessageQueue。MessageQueue是一个具有FIFO特性的队列结构，生产者发送消息与消费者消费消息的最小单位。

#### 消息生产者（Producer）

 负责生产消息，一般由业务系统负责生产消息。一个消息生产者会把业务应用系统里产生的消息发送到broker服务器。RocketMQ提供多种发送方式，同步发送、异步发送、顺序发送、单向发送。同步和异步方式均需要Broker返回确认信息，单向发送不需要。

 生产者中，会把同一类Producer组成一个集合，叫做生产者组。同一组的Producer被认为是发送同一类消息且发送逻辑一致。

#### 消息消费者（Consumer）

 负责消费消息，一般是后台系统负责异步消费。一个消息消费者会从Broker服务器拉取消息、并将其提供给应用程序。从用户应用的角度而言提供了两种消费形式：拉取式消费、推动式消费。

- 拉取式消费的应用通常主动调用Consumer的拉消息方法从Broker服务器拉消息、主动权由应用控制。一旦获取了批量消息，应用就会启动消费过程。
- 推动式消费模式下Broker收到数据后会主动推送给消费端，该消费模式一般实时性较高。

 消费者同样会把同一类Consumer组成一个集合，叫做消费者组，这类Consumer通常消费同一类消息且消费逻辑一致。消费者组使得在消息消费方面，实现负载均衡和容错的目标变得非常容易。要注意的是，消费者组的消费者实例必须订阅完全相同的Topic。RocketMQ 支持两种消息模式：集群消费（Clustering）和广播消费（Broadcasting）。

- 集群消费模式下, 相同Consumer Group的每个Consumer实例平均分摊消息。
- 广播消费模式下，相同Consumer Group的每个Consumer实例都接收全量的消息。

#### 代理服务器（Broker Server）

 消息中转角色，负责存储消息、转发消息。代理服务器在RocketMQ系统中负责接收从生产者发送来的消息并存储、同时为消费者的拉取请求作准备。代理服务器也存储消息相关的元数据，包括消费者组、消费进度偏移和主题和队列消息等。

Broker Server是RocketMQ真正的业务核心，包含了多个重要的子模块：

- Remoting Module：整个Broker的实体，负责处理来自clients端的请求。
- Client Manager：负责管理客户端(Producer/Consumer)和维护Consumer的Topic订阅信息
- Store Service：提供方便简单的API接口处理消息存储到物理硬盘和查询功能。
- HA Service：高可用服务，提供Master Broker 和 Slave Broker之间的数据同步功能。
- Index Service：根据特定的Message key对投递到Broker的消息进行索引服务，以提供消息的快速查询。

而Broker Server要保证高可用需要搭建主从集群架构。RocketMQ中有两种Broker架构模式：

- 普通集群：

这种集群模式下会给每个节点分配一个固定的角色，master负责响应客户端的请求，并存储消息。slave则只负责对master的消息进行同步保存，并响应部分客户端的读请求。消息同步方式分为同步同步和异步同步。

这种集群模式下各个节点的角色无法进行切换，也就是说，master节点挂了，这一组Broker就不可用了。

- Dledger高可用集群：

Dledger是RocketMQ自4.5版本引入的实现高可用集群的一项技术。这个模式下的集群会随机选出一个节点作为master，而当master节点挂了后，会从slave中自动选出一个节点升级成为master。

Dledger技术做的事情：1、从集群中选举出master节点 2、完成master节点往slave节点的消息同步。

#### 名字服务（Name Server）

 名称服务充当路由消息的提供者。Broker Server会在启动时向所有的Name Server注册自己的服务信息，并且后续通过心跳请求的方式保证这个服务信息的实时性。生产者或消费者能够通过名字服务查找各主题相应的Broker IP列表。多个Namesrv实例组成集群，但相互独立，没有信息交换。

 这种特性也就意味着NameServer中任意的节点挂了，只要有一台服务节点正常，整个路由服务就不会有影响。当然，这里不考虑节点的负载情况。

#### 消息（Message）

 消息系统所传输信息的物理载体，生产和消费数据的最小单位，每条消息必须属于一个主题Topic。RocketMQ中每个消息拥有唯一的Message ID，且可以携带具有业务标识的Key。系统提供了通过Message ID和Key查询消息的功能。

 并且Message上有一个为消息设置的标志，Tag标签。用于同一主题下区分不同类型的消息。来自同一业务单元的消息，可以根据不同业务目的在同一主题下设置不同标签。标签能够有效地保持代码的清晰度和连贯性，并优化RocketMQ提供的查询系统。消费者可以根据Tag实现对不同子主题的不同消费逻辑，实现更好的扩展性。

#### 分组(Group)

**生产者：**标识发送同一类消息的 Producer，通常发送逻辑一致。发送普通消息的时候，仅标识使用，并无特别用处。**主要作用用于事务消息**： 

（事务消息中如果某条发送某条消息的producer-A宕机，使得事务消息一直处于PREPARED状态并超时，则broker会回查同一个group的其它producer， 确认这条消息应该 commit 还是 rollback） 

**消费者：**标识一类 Consumer 的集合名称，这类 Consumer 通常消费一类消息，且消费逻辑一致。同一个 Consumer Group 下的各个实例将共同消费 topic 的消息，起到负载均衡的作用。 

消费进度以 Consumer Group 为粒度管理，不同 Consumer Group 之间消费进度彼此不受影响，即消息 A 被 Consumer Group1 消费过，也会再给 Consumer Group2 消费。

#### 标签（Tag）

为消息设置的标志，用于同一主题下区分不同类型的消息。来自同一业务单元的消息，可以根据不同业务目的在同一主题下设置不同标签。标签能够有效地保持代码的清晰度和连贯性，并优化RocketMQ提供的查询系统。消费者可以根据Tag实现对不同子主题的不同消费逻辑，实现更好的扩展性。

**偏移量(Offset)**

RocketMQ 中，有很多 offset 的概念。一般我们只关心暴露到客户端的 offset。不指定的话，就是指 Message Queue 下面的 offset。 

Message queue 是无限长的数组。一条消息进来下标就会涨 1,而这个数组的下标就是 offset，Message queue 中的 max offset 表示消息的最大 offset 。

Consumer offset 可以理解为标记 Consumer Group 在一条逻辑 Message Queue 上，消息消费到哪里即消费进度。但从源码上看，这个数值是消费过的最新消费的消息 offset+1，即实际上表示的是**下次拉取的** **offset** **位置**。

### RocketMQ中的消息模型

`RocketMQ` 中的消息模型就是按照 **主题模型** 所实现的。

其实对于主题模型的实现来说每个消息中间件的底层设计都是不一样的，就比如 `Kafka` 中的 **分区** ，`RocketMQ` 中的 **队列** ，`RabbitMQ` 中的 `Exchange` 。我们可以理解为 **主题模型/发布订阅模型** 就是一个标准，那些中间件只不过照着这个标准去实现而已。

所以，`RocketMQ` 中的 **主题模型** 到底是如何实现的呢？

![img](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef383d3e8c9788.jpg)

我们可以看到在整个图中有 `Producer Group` 、`Topic` 、`Consumer Group` 三个角色，我来分别介绍一下他们。

- `Producer Group` 生产者组： 代表某一类的生产者，比如我们有多个秒杀系统作为生产者，这多个合在一起就是一个 `Producer Group` 生产者组，它们一般生产相同的消息。
- `Consumer Group` 消费者组： 代表某一类的消费者，比如我们有多个短信系统作为消费者，这多个合在一起就是一个 `Consumer Group` 消费者组，它们一般消费相同的消息。
- `Topic` 主题： 代表一类消息，比如订单消息，物流消息等等。

你可以看到图中生产者组中的生产者会向主题发送消息，而 **主题中存在多个队列**，生产者每次生产消息之后是指定主题中的某个队列发送消息的。

每个主题中都有多个队列(分布在不同的 `Broker`中，如果是集群的话，`Broker`又分布在不同的服务器中)，集群消费模式下，一个消费者集群多台机器共同消费一个 `topic` 的多个队列，**一个队列只会被一个消费者消费**。如果某个消费者挂掉，分组内其它消费者会接替挂掉的消费者继续消费。就像上图中 `Consumer1` 和 `Consumer2` 分别对应着两个队列，而 `Consumer3` 是没有队列对应的，所以一般来讲要控制 **消费者组中的消费者个数和主题中队列个数相同** 。

当然也可以消费者个数小于队列个数，只不过不太建议。如下图。

![img](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef3850c808d707.jpg)

**每个消费组在每个队列上维护一个消费位置** ，为什么呢？

因为我们刚刚画的仅仅是一个消费者组，我们知道在发布订阅模式中一般会涉及到多个消费者组，而每个消费者组在每个队列中的消费位置都是不同的。如果此时有多个消费者组，那么消息被一个消费者组消费完之后是不会删除的(因为其它消费者组也需要呀)，它仅仅是为每个消费者组维护一个 **消费位移(offset)** ，每次消费者组消费完会返回一个成功的响应，然后队列再把维护的消费位移加一，这样就不会出现刚刚消费过的消息再一次被消费了。

![img](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef3857fefaa079.jpg)

可能你还有一个问题，**为什么一个主题中需要维护多个队列** ？

答案是 **提高并发能力** 。的确，每个主题中只存在一个队列也是可行的。你想一下，如果每个主题中只存在一个队列，这个队列中也维护着每个消费者组的消费位置，这样也可以做到 **发布订阅模式** 。如下图。

![img](https://my-blog-to-use.oss-cn-beijing.aliyuncs.com/2019-11/16ef38600cdb6d4b.jpg)

但是，这样我生产者是不是只能向一个队列发送消息？又因为需要维护消费位置所以一个队列只能对应一个消费者组中的消费者，这样是不是其他的 `Consumer` 就没有用武之地了？从这两个角度来讲，并发度一下子就小了很多。

所以总结来说，`RocketMQ` 通过**使用在一个 `Topic` 中配置多个队列并且每个队列维护每个消费者组的消费位置** 实现了 **主题模式/发布订阅模式** 。

一个 message queue只能被一个消费者消费！
