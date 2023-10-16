---
title: Java 8 日期和时间 - 如何获取当前时间和时间戳？

index: true
icon: discover
category:
- Java 基础

---

在过去，我们使用Date和CalendarAPI 来表示和操作日期。

java.util.Date– 日期和时间，使用默认时区打印。
java.util.Calendar- 日期和时间，更多操作日期的方法。
java.text.SimpleDateFormat– 格式化（日期 -> 字符串），解析（字符串 -> 日期）日期和日历。
Java 8 在包中创建了一系列新的日期和时间 API java.time。

java.time.LocalDate– 没有时间的日期，没有时区。
java.time.LocalTime– 没有日期的时间，没有时区。
java.time.LocalDateTime– 日期和时间，没有时区。
java.time.ZonedDateTime– 日期和时间，带时区。
java.time.DateTimeFormatter– java.time 的格式化（日期 -> 字符串），解析（字符串 -> 日期）。
java.time.Instant– 机器的日期和时间，自 Unix 纪元时间以来经过的秒数（UTC 时间 1970 年 1 月 1 日午夜）

一、获取当前时间

1、java.time.LocalDate
对于java.time.LocalDate, 用于LocalDate.now()获取没有时区的当前日期，并使用DateTimeFormatter.进行格式化。

```java
DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
LocalDate localDate = LocalDate.now();
String format = dateTimeFormatter.format(localDate);

System.out.println(format); // 2023/05/08
```



2、java.time.LocalTime
对于java.time.LocalTime, 用于LocalDate.now()获取没有时区的当前时间，并使用DateTimeFormatter进行格式化。

```java
 DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
 LocalTime localTime = LocalTime.now();

 System.out.println(dateTimeFormatter.format(localTime)); // 15:13:36
```



3、java.time.LocalDateTime
对于java.time.LocalDateTime, 用于LocalDateTime.now()获取没有时区的当前日期时间，并使用DateTimeFormatter格式化。

```java
DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
LocalDateTime now = LocalDateTime.now();
System.out.println(dateTimeFormatter.format(now));// 2023-05-08 15:15:08
```



4、java.time.ZonedDateTime
对于java.time.ZonedDateTime, 用于ZonedDateTime.now()获取系统默认时区或指定时区的当前日期时间。

```java
 DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");

// 当前时区
System.out.println(ZoneOffset.systemDefault());//Asia/Shanghai
System.out.println(OffsetDateTime.now().getOffset());//+08:00

// 当前时间
ZonedDateTime now = ZonedDateTime.now();
System.out.println(dateTimeFormatter.format(now));//2023/05/08 15:18:15
```



5、java.time.Instant
对于java.time.Instant, 用于Instant.now()获取自Unix 纪元时间（UTC 时间 1970 年 1 月 1 日午夜）以来经过的秒数，然后转换为其他java.time.*日期时间类。

```java
DateTimeFormatter dtfDateTime = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");

Instant now = Instant.now();

LocalDateTime localDateTime = LocalDateTime.ofInstant(now, ZoneId.systemDefault());
System.out.println(dtfDateTime.format(localDateTime)); //2023/05/08 15:21:00
```

二.获取时间戳

```java
  Timestamp timestamp = new Timestamp(System.currentTimeMillis());
    System.out.println(timestamp);                  // 2023-05-08 15:27:55.835
    System.out.println(timestamp.getTime());        // 1683530875835

    Instant instant = timestamp.toInstant();
    System.out.println(instant);                    // 2023-05-08T07:27:55.835Z
    System.out.println(instant.toEpochMilli());     // 1654234536842

    Timestamp tsFromInstant = Timestamp.from(instant); 
    System.out.println(tsFromInstant.getTime());   //1683530875835
```

