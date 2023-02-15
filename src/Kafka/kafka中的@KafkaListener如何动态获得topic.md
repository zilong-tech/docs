---
title: kafka中的@KafkaListener如何动态获得topic
author: 程序员子龙
index: true
icon: discover
category:
- Kafka
---
spring boot 在集成kafka 消费端使用@KafkaListener时候要指定topic，在实际应用时候，可能需要通过配置来指定topic。

首先写一个KafkaTopicConfig类

```java
@Configuration
public class KafkaTopicConfig implements InitializingBean {

	@Value("${kafka.topic}")
    private String topic;
 
    @Override
    public void afterPropertiesSet() {

         //系统写入
         System.setProperty("topics", topics);
     }
}

```

@KafkaListener(topics = “#{’${topics}’.split(’,’)}”)
在要调用 @KafkaListener的类前加上@DependsOn(value = “kafkaTopicConfig”)，确保kafkaTopicConfig类在此之前加载。

注意：@KafkaLisener中的topics是string[]类型，一定要注意传入参数的属性，不然会报value '[Ljava.lang.String;@1fb8997’的错误，一定要注意一下！

