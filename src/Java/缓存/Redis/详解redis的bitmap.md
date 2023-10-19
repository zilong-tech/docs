---
title: 详解redis的bitmap
author: 程序员子龙
index: true
icon: discover
category:
- Redis
---
### **BitMap是什么**

现代计算机用二进制（位）作为信息的基础单位，1个字节等于8位，例 如“big”字符串是由3个字节组成，但实际在计算机存储时将其用二进制表 示，“big”分别对应的ASCII码分别是98、105、103，对应的二进制分别是01100010、01101001和01100111.

![](https://pica.zhimg.com/80/v2-882b0bc19ddf327438bd93713165260e_1440w.png)

BitMap就是通过一个bit位来表示某个元素对应的值或者状态,其中的key就是对应元素本身。我们知道8个bit可以组成一个Byte，所以bitmap本身会极大的节省储存空间。

Bitmaps本身不是一种数据结构，实际上它就是字符串，但是它可以对字符串的位进行操作。 

![](https://pic1.zhimg.com/80/v2-b83fef7ad38f4a2ed875fd6e59afdf75_1440w.png)

可以把Bitmaps想象成一个以位为单位的数组，数组的每个单元只能存储0和1，数组的下标在Bitmap中叫做偏移量。

### 常用命令

1、设置值

设置或者清空key的value(字符串)在offset处的bit值(只能只0或者1)。

```shell
setbit key offset value 
```

设置键的第offset个位的值（从0算起），假设现在有20个用户， userid=0，5，11，15，19的用户对网站进行了访问，初始时候是这样

![](https://pica.zhimg.com/80/v2-d5d69ffb4595193d11cf3b71cc93e30f_1440w.png)

```shell
127.0.0.1:6379> setbit unique:users:2021-11-27 0 1
(integer) 0
127.0.0.1:6379> setbit unique:users:2021-11-27 5 1
(integer) 0
127.0.0.1:6379> setbit unique:users:2021-11-27 11 1
(integer) 0
127.0.0.1:6379> setbit unique:users:2021-11-27 15 1
(integer) 0
127.0.0.1:6379> setbit unique:users:2021-11-27 19 1
```

在实际应用中，可以对id进行一定运算，比如减去初始值（如果用户id是从某个数值开始的），否则偏移量太大，初始化过程会比较慢，可能会造成redis阻塞。

2、获取值 

```shell
getbit key offset 
```

获取键的第offset位的值（从0开始算）

```
127.0.0.1:6379> getbit unique:users:2021-11-27 1
(integer) 0
127.0.0.1:6379> getbit unique:users:2021-11-27 5
(integer) 1
```

3、获取Bitmap指定范围值为1的个数

```shell
bitcount [start][end]
```

[start]和[end]代表起始和结束字节数。

统计2021-11-27这一天的访问用户数

```shell
127.0.0.1:6379> bitcount unique:users:2021-11-27
(integer) 5
```

4、Bitmap间的运算

```shell
bitop op destkey key[key....] 
```

bitop是一个复合操作，它可以做多个Bitmaps的and（交集）、or（并 集）、not（非）、xor（异或）操作并将结果保存在destkey中。

统计2021-11-26 、2021-11-27这两天都访问过的用户，先初始化2021-11-26 数据

```shell
setbit unique:users:2021-11-26 2 1
setbit unique:users:2021-11-26 5 1
setbit unique:users:2021-11-26 10 1
setbit unique:users:2021-11-26 19 1
```

```shell
127.0.0.1:6379> bitop and unique:users:and:2021-11-26_27 unique:users:2021-11-26 unique:users:2021-11-27
(integer) 3
127.0.0.1:6379> bitcount unique:users:and:2021-11-26_27
(integer) 2
```

用or可以统计月活跃人数

### bitmap的优势、限制

优势
1.基于最小的单位bit进行存储，所以非常省空间。
2.设置时候时间复杂度O(1)、读取时候时间复杂度O(n)，操作是非常快的。
3.二进制数据的存储，进行相关计算的时候非常快。
4.方便扩容

限制
redis中bit映射被限制在512MB之内，所以最大是2^32位。建议每个key的位数都控制下，因为读取时候时间复杂度O(n)，越大的串读的时间花销越多。

### bitmap空间、时间粗略计算方式

在一台2010MacBook Pro上，offset为232-1（分配512MB）需要～300ms，offset为230-1(分配128MB)需要～80ms，offset为228-1（分配32MB）需要～30ms，offset为226-1（分配8MB）需要8ms。<来自官方文档>

大概的空间占用计算公式是：($offset/8/1024/1024)MB

假设网站有1亿用户，每天独立访问的用户有5千万，如果每天用集合类 型和Bitmap对比

![](https://pic1.zhimg.com/80/v2-935a727e51cd20c74fff8a77a5c07424_1440w.png)

很明显，这种情况下使用Bitmap能节省很多的内存空间