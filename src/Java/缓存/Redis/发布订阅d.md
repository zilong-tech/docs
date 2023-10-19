---
title: 发布和订阅
author: 程序员子龙
index: true
icon: discover
category:
- Redis
---
### 概要

Redis中的发布和订阅功能允许服务器向指定的频道发送消息，以及客户端可以订阅感兴趣的频道来接收消息。

Redis发布订阅(pub/sub)是一种消息通信模式：发送者(pub)发送消息，订阅者(sub)接收消息。

 Redis 发布订阅(pub/sub)实现了消息系统，发送者(在redis术语中称为发布者)在接收者(订阅者)接收消息时发送消息。传送消息的链路称为信道。

在Redis中，客户端可以订阅任意数量的信道。

发布和订阅功能的实现主要由如下几个命令实现：

PUBLISH：用于服务器向指定的频道发送消息，格式为：PUBLISH CHANNEL MESSAGE
SUBSCRIBE：用于客户端订阅服务器指定具体名字的频道，格式为：SUBCRIBE CHANNEL_NAME
PSUBCRIBE：用于客户端订阅服务器指定匹配模式的频道，格式为：SUBCRIBE CHANNEL_PATTERN

![](https://www.runoob.com/wp-content/uploads/2014/11/pubsub1.png)

消息订阅：

![](https://www.runoob.com/wp-content/uploads/2014/11/pubsub1.png)

### 发布及订阅功能

1、 基于事件的系统中，Pub/Sub是目前广泛使用的通信模型，它采用事件作为基本的通信机制，提供大规模系统所要求的松散耦合的交互模式：订阅者(如客户端)以事件订阅的方式表达出它有兴趣接收的一个事件或一类事件；发布者(如服务器)可将订阅者感兴趣的事件随时通知相关订阅者。

2、 消息发布者，即publish客户端，无需独占链接，你可以在publish消息的同时，使用同一个redis-client链接进行其他操作（例如：INCR等）

3、 消息订阅者，即subscribe客户端，需要独占链接，即进行subscribe期间，redis-client无法穿插其他操作，此时client以阻塞的方式等待“publish端”的消息；这一点很好理解，因此subscribe端需要使用单独的链接，甚至需要在额外的线程中使用。

### Redis 发布/订阅应用场景

1、实时消息系统

2、即时通信，频道作为聊天室，将信息回显给订阅频道的所有人

3、订阅系统，关注系统都是 ok 的

对于复杂的场景，我们就不用考虑 redis 了，可以直接使用专业的 MQ 开源组件，例如 rabbitMQ 或者 kafka

### 使用 Redis 发布/订阅 需要注意的点

使用 Redis 发布/订阅是有缺陷的

1、对于消息处理可靠性要求不强

2、消费能力无需通过增加消费方进行增强

### 使用RedisTemplate实现发布订阅

生产者：

```java
  public static void publish(String channel,Object message){
        redisTemplate.convertAndSend(channel,message);
    }
```

消费者：

```java
@Configuration
public class RedisMessageListenerConfig {

    @Autowired
    public MessageListener redisMessageListener;

    @Bean
    RedisMessageListenerContainer redisMessageListenerContainer(RedisConnectionFactory connectionFactory){
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        //频道集合
        List<Topic> topicList = new ArrayList<>();
        topicList.add(new PatternTopic("test"));
        container.addMessageListener(redisMessageListener,topicList);
        return container;
    }
}
```

```java
@Component
@Slf4j
public class RedisMessageListener implements MessageListener {


    @Override
    public void onMessage(Message message, byte[] bytes) {
        log.info("收到订阅消息 {}", message.toString());

    }
}
```

订阅相同频道的消费者会收到同一个消息。