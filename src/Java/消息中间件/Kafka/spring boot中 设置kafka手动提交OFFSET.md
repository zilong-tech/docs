---
title: spring boot中 设置kafka手动提交OFFSET
author: 程序员子龙
index: true
icon: discover
category:
- Kafka
---
### spring boot中 设置kafka手动提交OFFSET

1、enable.auto.commit参数设置成了false

2、org.springframework.kafka.listener.AbstractMessageListenerContainer.AckMode

```java
 /**

   * The offset commit behavior enumeration.
     /
  public enum AckMode { 
    /**
     * 每处理一条commit一次
     */
    RECORD,
 
    /**
     * 每次poll的时候批量提交一次，频率取决于每次poll的调用频率
     */
    BATCH,
 
    /**
     * 每次间隔ackTime的时间去commit
     */
    TIME,
 
    /**
     * 累积达到ackCount次的ack去commit
     */
    COUNT,
 
    /**
     *ackTime或ackCount哪个条件先满足，就commit
     */
    COUNT_TIME,
 
    /**
     *  listener负责ack，但是实际上也是批量上去
     */
    MANUAL,
 
    /**
     
     * listner负责ack，每调用一次，就立即commit
     /
    MANUAL_IMMEDIATE;
```

### MANUAL COMMIT

```java
@KafkaListener(topics = "k010")
public void listen(ConsumerRecord<?, ?> cr,Acknowledgment ack) throws Exception {

        LOGGER.info(cr.toString());

        ack.acknowledge();

}
```

方法参数里头传递Acknowledgment，然后手工ack

如果只添加上面语句会报错：

```
the listener container must have a MANUAL Ackmode to populate the Acknowledgment
```

我们要配置AckMode为MANUAL Ackmode

```java
factory.getContainerProperties().setAckMode(AbstractMessageListenerContainer.AckMode.MANUAL);
```

在spring boot 可以直接配置

```
spring:

  kafka:
  
    # kafka服务地址与端口
    bootstrap-servers: 127.0.0.1:9092
    key.serializer: org.apache.kafka.common.serialization.StringSerializer
    value.serializer: org.apache.kafka.common.serialization.StringSerializer

    consumer:
      group-id: bbb
      topic: test
      auto-offset-reset: earliest
  
      max-poll-records: 100
      enable-auto-commit: false
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
  listener:
    ack-mode: manual
```

### 设置了手动提交，消息重复消费原因

　　kafka 有个offset的概念，当每个消息被写进去后，都有一个offset，代表他的序号，然后consumer消费该数据之后，隔一段时间，会把自己消费过的消息的offset提交一下，代表我已经消费过了。

max.poll.interval.ms

两次poll操作允许的最大时间间隔。单位毫秒。默认值300000（5分钟）。

两次poll超过此时间间隔，Kafka服务端会进行rebalance操作，导致客户端连接失效，无法提交offset信息，从而引发重复消费。可以适当调大这个参数避免重复消费。

session.timeout.ms

 比如一条消息处理需要5分钟，session.timeout.ms = 3000ms,等消费者处理完消息，消费组早就将消费者移除消费者了，那么就会re-balance重平衡，此时有一定几率offset没提交，会导致重平衡后重复消费。

