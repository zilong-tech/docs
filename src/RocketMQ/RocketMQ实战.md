---
title: RocketMQ实战
author: 程序员子龙
index: true
icon: discover
category:
- RocketMQ
---

## 使用原生API

### 引入依赖

```
<dependency>
    <groupId>org.apache.rocketmq</groupId>
    <artifactId>rocketmq-client</artifactId>
    <version>4.9.1</version>
</dependency>
```

### 使用步骤

- 消息发送者的固定步骤

  1.创建消息生产者producer，并制定生产者组名
  2.指定Nameserver地址
  3.启动producer
  4.创建消息对象，指定主题Topic、Tag和消息体
  5.发送消息
  6.关闭生产者producer

- 消息消费者的固定步骤

  1.创建消费者Consumer，制定消费者组名
  2.指定Nameserver地址
  3.订阅主题Topic和Tag
  4.设置回调函数，处理消息
  5.启动消费者consumer

### 消息示例

#### 普通消息

##### 消息发送

###### 发送同步消息

同步发送是指消息发送方发出数据后，同步等待，直到收到接收方发回响应之后才发下一个请求。

这种可靠性同步地发送方式使用的比较广泛，比如：重要的消息通知。

![](http://rpumme6gd.hb-bkt.clouddn.com/202302151704600.png)



```java
    public static void main(String[] args) throws MQClientException, InterruptedException {

        DefaultMQProducer producer = new DefaultMQProducer("ProducerGroupName");
        producer.setNamesrvAddr("127.0.0.1:9876");
        producer.start();

        for (int i = 0; i < 5; i++)
            try {

                    Message msg = new Message("TopicTest",
                        "TagA",
                        "OrderID101",
                        "Hello world".getBytes(RemotingHelper.DEFAULT_CHARSET));
                    //同步传递消息，消息会发给集群中的一个Broker节点。
                    SendResult sendResult = producer.send(msg);
                    System.out.printf("%s%n", sendResult);


            } catch (Exception e) {
                e.printStackTrace();
            }

        producer.shutdown();
    }
```

> SendResult [sendStatus=SEND_OK, msgId=7F000001468C18B4AAC23D1B3B830000, offsetMsgId=C0A8016600002A9F000000000005FA8C, messageQueue=MessageQueue [topic=TopicTest, brokerName=LAPTOP-1I6NM6CJ, queueId=3], queueOffset=510]
> SendResult [sendStatus=SEND_OK, msgId=7F000001468C18B4AAC23D1B3B900001, offsetMsgId=C0A8016600002A9F000000000005FB55, messageQueue=MessageQueue [topic=TopicTest, brokerName=LAPTOP-1I6NM6CJ, queueId=0], queueOffset=510]
> SendResult [sendStatus=SEND_OK, msgId=7F000001468C18B4AAC23D1B3B920002, offsetMsgId=C0A8016600002A9F000000000005FC1E, messageQueue=MessageQueue [topic=TopicTest, brokerName=LAPTOP-1I6NM6CJ, queueId=1], queueOffset=510]
> SendResult [sendStatus=SEND_OK, msgId=7F000001468C18B4AAC23D1B3B950003, offsetMsgId=C0A8016600002A9F000000000005FCE7, messageQueue=MessageQueue [topic=TopicTest, brokerName=LAPTOP-1I6NM6CJ, queueId=2], queueOffset=510]
> SendResult [sendStatus=SEND_OK, msgId=7F000001468C18B4AAC23D1B3B9B0004, offsetMsgId=C0A8016600002A9F000000000005FDB0, messageQueue=MessageQueue [topic=TopicTest, brokerName=LAPTOP-1I6NM6CJ, queueId=3], queueOffset=511]

**Message ID** 

消息的全局唯一标识（内部机制的 ID 生成是使用机器 IP 和消息偏移量的组成，所以有可能重复，如果是幂等性还是最好考虑 Key），由消息队列 MQ 

系统自动生成，唯一标识某条消息。 

 **SendStatus** 

发送的标识。成功，失败等

**Queue** 

相当于是 Topic 的分区；用于并行发送和接收消息 

###### **发送异步消息**

消息发送方在发送了一条消息后，不等接收方发回响应，接着进行第二条消息发送。发送方通过回调接口的方式接收服务器响应，并对响应结果进行处理。

异步消息通常用在对响应时间敏感的业务场景，即发送端不能容忍长时间地等待 Broker 的响应。

![](http://rpumme6gd.hb-bkt.clouddn.com/202302151655497.png)

```java
//简单样例：异步发送消息
public class AsyncProducer {
    public static void main(
        String[] args) throws MQClientException, InterruptedException, UnsupportedEncodingException {

        DefaultMQProducer producer = new DefaultMQProducer("Daily_test");
        producer.setNamesrvAddr("127.0.0.1:9876");
        producer.start();
        producer.setRetryTimesWhenSendAsyncFailed(3);

        int messageCount = 5;
        //由于是异步发送，这里引入一个countDownLatch，保证所有Producer发送消息的回调方法都执行完了再停止Producer服务。
        final CountDownLatch countDownLatch = new CountDownLatch(messageCount);
        for (int i = 0; i < messageCount; i++) {
            try {
                final int index = i;
                Message msg = new Message("TopicTest",
                    "TagA",
                    "OrderID102",
                    "Hello world".getBytes(RemotingHelper.DEFAULT_CHARSET));
                producer.send(msg, new SendCallback() {
                    @Override
                    public void onSuccess(SendResult sendResult) {
                        countDownLatch.countDown();
                        System.out.printf("%-10d OK %s %n", index, sendResult.getMsgId());
                    }

                    @Override
                    public void onException(Throwable e) {
                        countDownLatch.countDown();
                        System.out.printf("%-10d Exception %s %n", index, e);
                        e.printStackTrace();
                    }
                });
                System.out.println("消息发送完成");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        countDownLatch.await(10, TimeUnit.SECONDS);
        producer.shutdown();
    }
}

```

> 消息发送完成
> 消息发送完成
> 消息发送完成
> 消息发送完成
> 消息发送完成
> 3          OK 7F000001189018B4AAC23D1C8C530003 
> 0          OK 7F000001189018B4AAC23D1C8C530004 
> 2          OK 7F000001189018B4AAC23D1C8C530002 
> 1          OK 7F000001189018B4AAC23D1C8C530001 
> 4          OK 7F000001189018B4AAC23D1C8C520000 

###### 单向发送消息

单向（Oneway）发送特点为发送方只负责发送消息，不等待服务器回应且没有回调函数触发，即只发送请求不等待应答。此方式发送消息的过程耗时非常短，一般在微秒级别。

这种方式主要用在不特别关心发送结果的场景，例如日志发送.

![](C:/Users/zys/AppData/Roaming/Typora/typora-user-images/image-20220612205120598.png)

```java
public class OnewayProducer {
    public static void main(String[] args) throws Exception{
        //Instantiate with a producer group name.
        DefaultMQProducer producer = new DefaultMQProducer("please_rename_unique_group_name");
        // Specify name server addresses.
        producer.setNamesrvAddr("localhost:9876");
        //Launch the instance.
        producer.start();
        for (int i = 0; i < 5; i++) {
            //Create a message instance, specifying topic, tag and message body.
            Message msg = new Message("TopicTest" /* Topic */,
                "TagA" /* Tag */,
                ("Hello RocketMQ " +
                    i).getBytes(RemotingHelper.DEFAULT_CHARSET) /* Message body */
            );
            //Call send message to deliver message to one of brokers.
            producer.sendOneway(msg);
        }
        //Wait for sending to complete
        Thread.sleep(5000);        
        producer.shutdown();
    }
}
```

**消息发送的选择**

![](C:/Users/zys/AppData/Roaming/Typora/typora-user-images/image-20220612205600020.png)

##### 消费消息

消费者消费消息有两种模式，一种是消费者主动去Broker上拉取消息的拉模式，另一种是消费者等待Broker把消息推送过来的推模式。



###### **拉模式**

```java
/**
 * 拉模式
 */
public class PullConsumer {

    public static void main(String[] args) throws MQClientException {

        DefaultMQPullConsumer consumer = new DefaultMQPullConsumer("group_name_6");
        consumer.setNamesrvAddr("127.0.0.1:9876");
        Set<String> topics = new HashSet<>();
        //You would better to register topics,It will use in rebalance when starting
        topics.add("TopicTest");
        consumer.setRegisterTopics(topics);
        consumer.start();

        ExecutorService executors = Executors.newFixedThreadPool(topics.size(), new ThreadFactory() {
            @Override
            public Thread newThread(Runnable r) {
                return new Thread(r, "PullConsumerThread");
            }
        });
        for (String topic : consumer.getRegisterTopics()) {

            executors.execute(new Runnable() {

                public void doSomething(List<MessageExt> msgs) {


                }

                @Override
                public void run() {
                    while (true) {
                        try {
                            Set<MessageQueue> messageQueues = consumer.fetchMessageQueuesInBalance(topic);
                            if (messageQueues == null || messageQueues.isEmpty()) {
                                Thread.sleep(1000);
                                continue;
                            }
                            PullResult pullResult = null;
                            for (MessageQueue messageQueue : messageQueues) {
                                try {
                                    long offset = this.consumeFromOffset(messageQueue);
                                    pullResult = consumer.pull(messageQueue, "*", offset, 32);
                                    System.out.printf("%s%n", pullResult);
                                    switch (pullResult.getPullStatus()) {
                                        case FOUND:
                                            List<MessageExt> msgs = pullResult.getMsgFoundList();

                                            if (msgs != null && !msgs.isEmpty()) {
                                                this.doSomething(msgs);
                                                //update offset to broker
                                                consumer.updateConsumeOffset(messageQueue, pullResult.getNextBeginOffset());
                                                //print pull tps
                                                this.incPullTPS(topic, pullResult.getMsgFoundList().size());
                                            }
                                            break;
                                        case OFFSET_ILLEGAL:
                                            consumer.updateConsumeOffset(messageQueue, pullResult.getNextBeginOffset());
                                            break;
                                        case NO_NEW_MSG:
                                            Thread.sleep(1);
                                            consumer.updateConsumeOffset(messageQueue, pullResult.getNextBeginOffset());
                                            break;
                                        case NO_MATCHED_MSG:
                                            consumer.updateConsumeOffset(messageQueue, pullResult.getNextBeginOffset());
                                            break;
                                        default:
                                    }
                                } catch (RemotingException e) {
                                    e.printStackTrace();
                                } catch (MQBrokerException e) {
                                    e.printStackTrace();
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                            }
                        } catch (MQClientException e) {
                            //reblance error
                            e.printStackTrace();
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }

                public long consumeFromOffset(MessageQueue messageQueue) throws MQClientException {
                    //-1 when started
                    long offset = consumer.getOffsetStore().readOffset(messageQueue, ReadOffsetType.READ_FROM_MEMORY);
                    if (offset < 0) {
                        //query from broker
                        offset = consumer.getOffsetStore().readOffset(messageQueue, ReadOffsetType.READ_FROM_STORE);
                    }
                    if (offset < 0) {
                        //first time start from last offset
                        offset = consumer.maxOffset(messageQueue);
                    }
                    //make sure
                    if (offset < 0) {
                        offset = 0;
                    }
                    return offset;
                }

                public void incPullTPS(String topic, int pullSize) {
                    consumer.getDefaultMQPullConsumerImpl().getRebalanceImpl().getmQClientFactory()
                            .getConsumerStatsManager().incPullTPS(consumer.getConsumerGroup(), topic, pullSize);
                }
            });

        }

    }

}
```

######  **推模式**

```java
/**
 * 推模式消费消息
 */
public class PushConsumer {

    public static void main(String[] args) throws InterruptedException, MQClientException {
        DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("group_name_7");
        consumer.subscribe("TopicTest", "*");
        consumer.setConsumeFromWhere(ConsumeFromWhere.CONSUME_FROM_FIRST_OFFSET);
        //wrong time format 2017_0422_221800
        consumer.setConsumeTimestamp("20181109221800");
        consumer.registerMessageListener(new MessageListenerConcurrently() {

            @Override
            public ConsumeConcurrentlyStatus consumeMessage(List<MessageExt> msgs, ConsumeConcurrentlyContext context) {
                System.out.printf("%s Receive New Messages: %s %n", Thread.currentThread().getName(), msgs);
                return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
            }
        });
        consumer.start();
        System.out.printf("Consumer Started.%n");
    }
}
```

###### **集群消费**

![](http://rpumme6gd.hb-bkt.clouddn.com/202302151656699.png)

一个 Consumer Group 中的各个 Consumer 实例分摊去消费消息，即一条消息只会投递到一个 Consumer Group 下面的一个实例。

实际上，每个 Consumer 是平均分摊 Message Queue 的去做拉取消费。例如某个 Topic 有 3 条 Q，其中一个 Consumer Group 有 3 个实例），那么每个实例只消费其中的 1 条 Q。 

而由 Producer 发送消息的时候是轮询所有的 Q,所以消息会平均散落在不同的 Q 上，可以认为 Q 上的消息是平均的。那么实例也就平均地消费消息了。 

这种模式下，消费进度(Consumer Offset)的存储会持久化到 **Broker**。

这种方式是默认消费方式。

```java
public class BalanceComuser {
    public static void main(String[] args) throws Exception {
        // 实例化消息生产者,指定组名
        DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("group_name_8");
        // 指定Namesrv地址信息.
        consumer.setNamesrvAddr("127.0.0.1:9876");
        // 订阅Topic
        consumer.setMaxReconsumeTimes(1);
        consumer.subscribe("TopicTest", "*"); //tag  tagA|TagB|TagC
        //负载均衡模式消费
        consumer.setMessageModel(MessageModel.CLUSTERING);
        // 注册回调函数，处理消息
        consumer.registerMessageListener(new MessageListenerConcurrently() {
            @Override
            public ConsumeConcurrentlyStatus consumeMessage(List<MessageExt> msgs,
                                                            ConsumeConcurrentlyContext context) {
                try {
                    for(MessageExt msg : msgs) {
                        String topic = msg.getTopic();
                        String msgBody = new String(msg.getBody(), "utf-8");
                        String tags = msg.getTags();
                        System.out.println("收到消息：" + " topic :" + topic + " ,tags : " + tags + " ,msg : " + msgBody);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    return ConsumeConcurrentlyStatus.RECONSUME_LATER;

                }
                return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
            }
        });
        //启动消息者
        consumer.start();
        System.out.printf("Consumer Started.%n");
    }
}
```

###### **广播消费**

![](http://rpumme6gd.hb-bkt.clouddn.com/202302151656180.png)

消息将对一个 Consumer Group 下的各个 Consumer 实例都投递一遍。即即使这些 Consumer 属于同一个 Consumer Group， 消息也会被 Consumer Group 中的每个 Consumer 都消费一次。 

实际上，是一个消费组下的每个消费者实例都获取到了 topic 下面的每个 Message Queue 去拉取消费。所以消息会投递到每个消费者实例。 

这种模式下，消费进度(Consumer Offset)会存储持久化到实例本地。

```java
/**
 * 广播消费
 */
public class BroadcastComuser {
    public static void main(String[] args) throws Exception {
        // 实例化消息生产者,指定组名
        DefaultMQPushConsumer consumer = new DefaultMQPushConsumer("B-test");
        // 指定Namesrv地址信息.
        consumer.setNamesrvAddr("127.0.0.1:9876");
        // 订阅Topic
        consumer.subscribe("TopicTest", "*");
        //广播模式消费
        consumer.setMessageModel(MessageModel.BROADCASTING);
        // 如果非第一次启动，那么按照上次消费的位置继续消费
        consumer.setConsumeFromWhere(ConsumeFromWhere.CONSUME_FROM_FIRST_OFFSET);
        // 注册回调函数，处理消息
        consumer.registerMessageListener(new MessageListenerConcurrently() {
            @Override
            public ConsumeConcurrentlyStatus consumeMessage(List<MessageExt> msgs,
                                             ConsumeConcurrentlyContext context) {
                try {
                    for(MessageExt msg : msgs) {
                        String topic = msg.getTopic();
                        String msgBody = new String(msg.getBody(), "utf-8");
                        String tags = msg.getTags();
                        System.out.println("收到消息：" + " topic :" + topic + " ,tags : " + tags + " ,msg : " + msgBody);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    return ConsumeConcurrentlyStatus.RECONSUME_LATER;

                }
                return ConsumeConcurrentlyStatus.CONSUME_SUCCESS;
            }
        });
        //启动消息者
        consumer.start();
        System.out.printf("Consumer Started.%n");
    }
}
```

**消息消费时的权衡** 

集群模式：适用场景

消费端集群化部署，每条消息只需要被处理一次。 

由于消费进度在服务端维护，可靠性更高。 

集群消费模式下，每一条消息都只会被分发到一台机器上处理。如果需要被集群下的每一台机器都处理，请使用广播模式。 

集群消费模式下，不保证每一次失败重投的消息路由到同一台机器上，因此处理消息时不应该做任何确定性假设。 

广播模式：适用场景

广播消费模式下不支持顺序消息。 

广播消费模式下不支持重置消费位点。 

每条消息都需要被相同逻辑的多台机器处理。 

消费进度在客户端维护，出现重复的概率稍大于集群模式。 

广播模式下，消息队列 RocketMQ 保证每条消息至少被每台客户端消费一次，但是并不会对消费失败的消息进行失败重投，因此业务方需要关注消费失败的情况。 

广播模式下，**客户端每一次重启都会从最新消息消费。客户端在被停止期间发送至服务端的消息将会被自动跳过，请谨慎选择。** 

广播模式下，每条消息都会被大量的客户端重复处理，因此推荐尽可能使用集群模式。 

目前仅 Java 客户端支持广播模式。 

广播模式下服务端不维护消费进度，所以消息队列 RocketMQ 控制台不支持消息堆积查询、消息堆积报警和订阅关系查询功能。

#### 顺序消息

消息有序指的是可以按照消息的发送顺序来消费(FIFO)。RocketMQ 可以严格的保证消息有序，可以分为分区有序或者全局有序。

顺序消费的原理解析，在默认的情况下消息发送会采取 Round Robin 轮询方式把消息发送到不同的 queue(分区队列)；而消费消息的时候从多个 queue 上拉取消息，这种情况发送和消费是不能保证顺序。但是如果控制发送的顺序消息只依次发送到同一个 queue 中，Broker中一个队列内的消息是可以保证有序的。消费的时候只从这个 queue 上依次拉取，则就保证了顺序。当发送和消费参与的 queue 只有一个，则是全局有序；如果多个 queue 参与，则为分区有序，即相对每个 queue，消息都是有序的。

**全局顺序消息**

![](http://rpumme6gd.hb-bkt.clouddn.com/202302151656691.png)

局部顺序消息

![](http://rpumme6gd.hb-bkt.clouddn.com/202302151656172.png)

我们所说的顺序消息指的是局部消息顺序，比如说保证一个订单下的消息顺序是有序的。

```java
/**
 * 顺序消息生产者
 */
public class Producer {
    public static void main(String[] args) throws UnsupportedEncodingException {
        try {
            DefaultMQProducer producer = new DefaultMQProducer("please_rename_unique_group_name");
            producer.start();

            for (int i = 0; i < 10; i++) {
                int orderId = i;

                for(int j = 0 ; j <= 3 ; j ++){
                    Message msg =
                            new Message("OrderTopicTest", "order_"+orderId, "KEY" + orderId,
                                    ("order_"+orderId+" step " + j).getBytes(RemotingHelper.DEFAULT_CHARSET));
                    SendResult sendResult = producer.send(msg, new MessageQueueSelector() {

                        //保证同一个订单下的消息发送到同一个messagequeue中
                        @Override
                        public MessageQueue select(List<MessageQueue> mqs, Message msg, Object arg) {
                            Integer id = (Integer) arg;
                            int index = id % mqs.size();
                            return mqs.get(index);
                        }
                    }, orderId);

                    System.out.printf("%s%n", sendResult);
                }
            }

            producer.shutdown();
        } catch (MQClientException | RemotingException | MQBrokerException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

消费者和普通消息的消费者一样，这里就省略了。

#### 延迟消息

Producer 将消息发送到消息队列 RocketMQ 服务端，但并不期望这条消息立马投递，而是延迟一定时间后才投递到 Consumer 进行消费。

那会延迟多久呢？延迟时间的设置就是在Message消息对象上设置一个延迟级别message.setDelayTimeLevel(3);

开源版本的RocketMQ中，对延迟消息并不支持任意时间的延迟设定(商业版本中支持)，而是只支持18个固定的延迟级别，1到18分别对应messageDelayLevel=1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h。是这 18 个等级（秒（s）、分（m）、小时（h）），level 为 1，表示延迟 1 秒后消费，level 为 5 表示延迟 1 分钟后消费，level 为 18 表示延迟 2 个小时消费。生产消息跟普通的生产消息类似，只需要在消息上设置延迟队列的 level 即可。消费消息跟普通的消费消息一致。 

**适用场景** 

消息生产和消费有时间窗口要求：比如在电商交易中超时未支付关闭订单的场景，在订单创建时会发送一条延时消息。这条消息将会在 30 分钟以后投递给消费者，消费者收到此消息后需要判断对应的订单是否已完成支付。 如支付未完成，则关闭订单。如已完成支付则忽略。

```java
     public static void main(String[] args) throws Exception {

         DefaultMQProducer producer = new DefaultMQProducer("ExampleProducerGroup");
         // Launch producer
         producer.start();
         int totalMessagesToSend = 10;
         for (int i = 0; i < totalMessagesToSend; i++) {
             System.out.println(new Date());
             Message message = new Message("TestTopic", ("Hello scheduled message " + i).getBytes());
             // This message will be delivered to consumer 10 seconds later.
             // messageDelayLevel=1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h
             message.setDelayTimeLevel(3);
             // Send the message
             producer.send(message);
         }
    
         // Shutdown producer after use.
         producer.shutdown();
     }
```

#### 批量消息

批量发送消息能显著提高传递小消息的性能。限制是这些批量消息应该有相同的 topic，相同的 waitStoreMsgOK（集群时会细讲），而且不能是延时消息、事务消息。此外，这一批消息的总大小不应超过 4MB。

```java
public static void main(String[] args) throws Exception {
    DefaultMQProducer producer = new DefaultMQProducer("BatchProducerGroupName");
    producer.start();

    String topic = "TopicTest";
    List<Message> messages = new ArrayList<>();
    messages.add(new Message(topic, "Tag", "OrderID001", "Hello world 0".getBytes()));
    messages.add(new Message(topic, "Tag", "OrderID002", "Hello world 1".getBytes()));
    messages.add(new Message(topic, "Tag", "OrderID003", "Hello world 2".getBytes()));

    producer.send(messages);
    producer.shutdown();
}
```

**批量切分** 

如果消息的总长度可能大于 4MB 时，这时候最好把消息进行分割。示例代码在文末。

#### 过滤消息

**Tag** **过滤** 

在大多数情况下，TAG 是一个简单而有用的设计，其可以来选择您想要的消息。TAG是RocketMQ中特有的一个消息属性。RocketMQ的最佳实践中就建议，使用RocketMQ时，一个应用可以就用一个Topic，而应用中的不同业务就用TAG来区分。

在生产消息时加上tag，消费时候加上条件，类似sql中的where条件。consumer.subscribe("TagFilterTest", "TagA || TagC"); 这句只订阅TagA和TagC的消息。

```java
   // 生产者
   String[] tags = new String[] {"TagA", "TagB", "TagC"};

        for (int i = 0; i < 15; i++) {
            Message msg = new Message("TagFilterTest",
                tags[i % tags.length],
                "Hello world".getBytes(RemotingHelper.DEFAULT_CHARSET));

            SendResult sendResult = producer.send(msg);
            System.out.printf("%s%n", sendResult);
        }

//消费者
consumer.subscribe("TagFilterTest", "TagA || TagC");

```

但是 tag 限制是一个消息只能有一个标签，这对于复杂的场景可能不起作用。在这种情况下，可以使用 SQL 表达式筛选消息。SQL 特性可以通过发送消息时的属性来进行计算。

**Sql** **过滤** 

**SQL** **基本语法** 

RocketMQ 定义了一些基本语法来支持这个特性。你也可以很容易地扩展它。 

只有使用 push 模式的消费者才能用使用 SQL92 标准的 sql 语句，常用的语句如下： 

**数值比较：**比如：>，>=，<，<=，BETWEEN，=； 

**字符比较：**比如：=，<>，IN； 

IS NULL 或者 IS NOT NULL； 

**逻辑符号：**AND，OR，NOT； 

**常量支持类型为：** 

数值，比如：123，3.1415； 

字符，比如：'abc'，必须用单引号包裹起来； 

**NULL**，特殊的常量

布尔值，TRUE 或 FALSE

这个模式的关键是在消费者端使用MessageSelector.bySql(String sql)返回的一个MessageSelector。这里面的sql语句是按照SQL92标准来执行的。sql中可以使用的参数有默认的TAGS和一个在生产者中加入的a属性。

**使用注意：只有推模式的消费者可以使用SQL过滤。拉模式是用不了的。**

```java
    //生产者
    String[] tags = new String[] {"TagA", "TagB", "TagC"};

        for (int i = 0; i < 15; i++) {
            Message msg = new Message("SqlFilterTest",
                tags[i % tags.length],
                ("Hello RocketMQ " + i).getBytes(RemotingHelper.DEFAULT_CHARSET)
            );
            msg.putUserProperty("a", String.valueOf(i));

            SendResult sendResult = producer.send(msg);
            System.out.printf("%s%n", sendResult);
        }

// 消费者
  consumer.subscribe("SqlFilterTest",
            MessageSelector.bySql("(TAGS is not null and TAGS in ('TagA', 'TagB'))" +
                "and (a is not null and a between 0 and 3)"));
```

如果消费者报错：

![](https://img-blog.csdnimg.cn/5118c730d0344fbcafb37f31b71b5214.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3poYW5nemVuZ3hpdQ==,size_16,color_FFFFFF,t_70#pic_center)

这是因为默认的broker并没有开启对SQL语法的支持，需要修改配置:

打开broker服务器下的broker.conf文件

```
enablePropertyFilter=true 
```

重启服务

```
sh mqbroker -n localhost:9876 -c ../conf/broker.conf 
```

#### 事务消息

事务消息是在分布式系统中保证最终一致性的两阶段提交的消息实现。他可以保证本地事务执行与消息发送两个操作的原子性，也就是这两个操作一起成功或者一起失败。

事务消息只保证消息发送者的本地事务与发消息这两个操作的原子性，因此，事务消息的示例只涉及到消息发送者，对于消息消费者来说，并没有什么特别的。

事务消息的关键是在TransactionMQProducer中指定了一个TransactionListener事务监听器，这个事务监听器就是事务消息的关键控制器。

**使用场景** 

用户提交订单后，扣减库存成功、扣减优惠券成功、使用余额成功，但是在确认订单操作失败，需要对库存、库存、余额进行回退。如何保证数据 的完整性？ 

可以使用 RocketMQ 的分布式事务保证在下单失败后系统数据的完整性。

![](http://rpumme6gd.hb-bkt.clouddn.com/202302151657350.png)

其中分为两个流程：正常事务消息的发送及提交、事务消息的补偿流程。 

**正常事务流程**

(1) 发送消息（half 消息）：图中步骤 1。 

(2) 服务端响应消息写入结果：图中步骤 2。 

(3) 根据发送结果执行本地事务（如果写入失败，此时 half 消息对业务不可见，本地逻辑不执行）：图中步骤 3。 

(4) 根据本地事务状态执行 Commit 或者 Rollback（Commit 操作生成消息索引，消息对消费者可见）：图中步骤 4。

**事务补偿流程** 

(1) 对没有 Commit/Rollback 的事务消息（pending 状态的消息），从服务端发起一次“回查”：图中步骤 5。 

(2) Producer 收到回查消息，检查回查消息对应的本地事务的状态：图中步骤 6。 

(3) 根据本地事务状态，重新 Commit 或者 Rollback：：图中步骤 6。 

其中，补偿阶段用于解决消息 Commit 或者 Rollback 发生超时或者失败的情况。 

事务消息机制的关键是在发送消息时，会将消息转为一个half半消息，并存入RocketMQ内部的一个 RMQ_SYS_TRANS_HALF_TOPIC 这个Topic，这样对消费者是不可见的。再经过一系列事务检查通过后，再将消息转存到目标Topic，这样对消费者就可见了。

**事务消息状态** 

事务消息共有三种状态，提交状态、回滚状态、中间状态： 

TransactionStatus.CommitTransaction: 提交状态，它允许消费者消费此消息（完成图中了 1，2,3,4 步，第 4 步是 Commit）。 

TransactionStatus.RollbackTransaction: 回滚状态，它代表该消息将被删除，不允许被消费（完成图中了 1，2,3,4 步, 第 4 步是 Rollback）。 

TransactionStatus.Unknown: 中间状态，它代表需要检查消息队列来确定状态（完成图中了 1,2,3 步, 但是没有 4 或者没有 7，无法 Commit 或 Rollback）。

事务消息的使用限制：

 1、事务消息不支持延迟消息和批量消息。

 2、为了避免单个消息被检查太多次而导致半队列消息累积，我们默认将单个消息的检查次数限制为 15 次，但是用户可以通过 Broker 配置文件的 transactionCheckMax参数来修改此限制。如果已经检查某条消息超过 N 次的话（ N = transactionCheckMax ） 则 Broker 将丢弃此消息，并在默认情况下同时打印错误日志。用户可以通过重写 AbstractTransactionCheckListener 类来修改这个行为。

 3、事务消息将在 Broker 配置文件中的参数 transactionMsgTimeout 这样的特定时间长度之后被检查。当发送事务消息时，用户还可以通过设置用户属性 CHECK_IMMUNITY_TIME_IN_SECONDS 来改变这个限制，该参数优先于 transactionMsgTimeout 参数。

 4、事务性消息可能不止一次被检查或消费。

 5、提交给用户的目标主题消息可能会失败，目前这依日志的记录而定。它的高可用性通过 RocketMQ 本身的高可用性机制来保证，如果希望确保事务消息不丢失、并且事务完整性得到保证，建议使用同步的双重写入机制。

 6、事务消息的生产者 ID 不能与其他类型消息的生产者 ID 共享。与其他类型的消息不同，事务消息允许反向查询、MQ服务器能通过它们的生产者 ID 查询到消费者。

7、事务性消息中用到了生产者群组，这种就是一种高可用机制，用来确保事务消息的可靠性。

8、**事务回查的间隔时间：**BrokerConfig. transactionCheckInterval 通过 Broker 的配置文件设置好。

**创建事务性生产者** 

使用 TransactionMQProducer 类创建生产者，并指定唯一的 ProducerGroup，就可以设置自定义线程池来处理这些检查请求。执行本地事务后、需 要根据执行结果对消息队列进行回复。

```java
  public static void main(String[] args) throws MQClientException, InterruptedException {
        //事务监听器
        TransactionListener transactionListener = new TransactionListenerImpl();
        //事务消息生产者
        TransactionMQProducer producer = new TransactionMQProducer("please_rename_unique_group_name");
        producer.setNamesrvAddr("127.0.0.1:9876");
        ExecutorService executorService = new ThreadPoolExecutor(2, 5, 100, TimeUnit.SECONDS, new ArrayBlockingQueue<Runnable>(2000), new ThreadFactory() {
            @Override
            public Thread newThread(Runnable r) {
                Thread thread = new Thread(r);
                thread.setName("client-transaction-msg-check-thread");
                return thread;
            }
        });

        //设置生产者回查线程池
        producer.setExecutorService(executorService);
        // 生产者监听器
        producer.setTransactionListener(transactionListener);
        producer.start();

        String[] tags = new String[] {"TagA", "TagB", "TagC", "TagD", "TagE"};
        for (int i = 0; i < 10; i++) {
            try {
                Message msg =
                    new Message("TopicTest", tags[i % tags.length], "KEY" + i,
                        ("Hello RocketMQ " + i).getBytes(RemotingHelper.DEFAULT_CHARSET));
//                msg.putUserProperty("CHECK_IMMUNITY_TIME_IN_SECONDS","10000");
                SendResult sendResult = producer.sendMessageInTransaction(msg, null);
                System.out.printf("%s%n", sendResult);

                Thread.sleep(10);
            } catch (MQClientException | UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }

        for (int i = 0; i < 100000; i++) {
            Thread.sleep(1000);
        }
        producer.shutdown();
    }
```

**实现事务的监听接口**

当发送半消息成功时，我们使用 executeLocalTransaction 方法来执行本地事务（**步骤 3**）。它返回前一节中提到的三个事务状态之一。 

checkLocalTranscation 方法用于检查本地事务状态（**步骤 5**），并回应消息队列的检查请求。它也是返回前一节中提到的三个事务状态之一。

```java
public class TransactionListenerImpl implements TransactionListener {
    private AtomicInteger transactionIndex = new AtomicInteger(0);

    private ConcurrentHashMap<String, Integer> localTrans = new ConcurrentHashMap<>();

    /**
     * 执行本地事务
     * @param msg
     * @param arg
     * @return
     */
    @Override
    public LocalTransactionState executeLocalTransaction(Message msg, Object arg) {
        int value = transactionIndex.getAndIncrement();
        int status = value % 3;
        localTrans.put(msg.getTransactionId(), status);
        return LocalTransactionState.UNKNOW;

    }

    /**
     * 检查本地事务状态
     * @param msg
     * @return
     */
    @Override
    public LocalTransactionState checkLocalTransaction(MessageExt msg) {
        Integer status = localTrans.get(msg.getTransactionId());
        if (null != status) {
            switch (status) {
                case 0:
                    System.out.println("MQ检查消息【"+msg.getTransactionId()+"】事务状态【中间状态】");
                    return LocalTransactionState.UNKNOW;
                case 1:
                    System.out.println("MQ检查消息【"+msg.getTransactionId()+"】事务状态【提交状态】");
                    return LocalTransactionState.COMMIT_MESSAGE;
                case 2:
                    System.out.println("MQ检查消息【"+msg.getTransactionId()+"】事务状态【回滚状态】");
                    return LocalTransactionState.ROLLBACK_MESSAGE;
                default:
                    System.out.println("MQ检查消息【"+msg.getTransactionId()+"】事务状态【提交状态】");
                    return LocalTransactionState.COMMIT_MESSAGE;
            }
        }
        return LocalTransactionState.COMMIT_MESSAGE;

    }
}
```

## **SpringBoot整合RocketMQ** 

### 引入依赖

```
       <dependency>
            <groupId>org.apache.rocketmq</groupId>
            <artifactId>rocketmq-spring-boot-starter</artifactId>
            <version>2.2.1</version>
            <exclusions>
                <exclusion>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-starter</artifactId>
                </exclusion>
                <exclusion>
                    <groupId>org.springframework</groupId>
                    <artifactId>spring-core</artifactId>
                </exclusion>
                <exclusion>
                    <groupId>org.springframework</groupId>
                    <artifactId>spring-webmvc</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
```

配置文件

```
rocketmq.name-server=127.0.0.1:9876
#生产者组
rocketmq.producer.group=springBootGroup
```

### 消息生产者

```java
@Component
public class SpringProducer {

    @Resource
    private RocketMQTemplate rocketMQTemplate;

    //发送普通消息
    public void sendMessage(String topic,String msg){
        this.rocketMQTemplate.convertAndSend(topic,msg);
    }


}
```

### 消息消费者

SpringBoot集成RocketMQ，消费者部分的核心就在@RocketMQMessageListener注解上。所有消费者的核心功能也都会

集成到这个注解中。下面我们看下注解的属性：

consumerGroup 消费者分组

topic 主题

selectorType 消息选择器类型
 默认值 SelectorType.TAG 根据TAG选择
 仅支持表达式格式如：“tag1 || tag2 || tag3”，如果表达式为null或者“*”标识订阅所有消息
 SelectorType.SQL92 根据SQL92表达式选择

selectorExpression 过滤表达式

消息过滤可以由里面的selectorType属性和selectorExpression来定制

consumeMode 消费模式
 默认值 ConsumeMode.CONCURRENTLY 并行处理
 ConsumeMode.ORDERLY 按顺序处理

messageModel 消息模型
 默认值 MessageModel.CLUSTERING 集群
 MessageModel.BROADCASTING 广播

consumeThreadMax 最大线程数
 默认值 64

consumeTimeout 超时时间
 默认值 30000ms

accessKey
 默认值 ${rocketmq.consumer.access-key:}

secretKey
 默认值 ${rocketmq.consumer.secret-key:}

enableMsgTrace 启用消息轨迹
 默认值 true

customizedTraceTopic 自定义的消息轨迹主题
 默认值 ${rocketmq.consumer.customized-trace-topic:}
 没有配置此配置项则使用默认的主题

nameServer 命名服务器地址
 默认值 ${rocketmq.name-server:}

accessChannel
 默认值 ${rocketmq.access-channel:}

```java
@Component
@RocketMQMessageListener(consumerGroup = "MyConsumerGroup", topic = "TestTopic",consumeMode= ConsumeMode.CONCURRENTLY)
public class SpringConsumer implements RocketMQListener<String> {
    @Override
    public void onMessage(String message) {
        System.out.println("Received message : "+ message);
    }
}
```

注意：SpringBoot依赖中的Message对象和RocketMQ-client中的Message对象是两个不同的对象，这在使用的时候要非常容易弄错。例如RocketMQ-client中的Message里的TAG属性，在SpringBoot依赖中的Message中就没有。Tag属性被移到了发送目标中，与Topic一起，以Topic:Tag的方式指定。



项目地址：https://gitee.com/zysspace/mq-demo

码字不易，喜欢记得点赞、收藏！