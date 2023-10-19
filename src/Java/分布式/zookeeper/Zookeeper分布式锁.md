---
title: Zookeeper分布式锁
author: 程序员子龙
index: true
icon: discover
category:
- Zookeeper
---
### **Zookeeper分布式锁**

#### **1**、非公平锁：

![](https://pic2.zhimg.com/80/v2-72fa1ef75781df722e55b916b2360352_720w.png)

如上实现方式在并发问题比较严重的情况下，性能会下降的比较厉害，主要原因是，所有的连接 都在对同一个节点进行监听，当服务器检测到删除事件时，要通知所有的连接，所有的连接同时 收到事件，再次并发竞争，这就是**羊群效应**。

<img src="https://pic2.zhimg.com/80/v2-043975f222aa215527835a6b0a998384_720w.png"  />

<img src="https://pic1.zhimg.com/80/v2-f0f4ff87d7f1e3701ef34d5c3a8685de_720w.png"  />

### 2、公平锁

![](https://pic3.zhimg.com/80/v2-145cfc5f6d4714c84721c4387bfec729_720w.png)

1、直接在/lock节点下创建一个临时有序节点

2、判断是不是/lock节点下最小的节点

-   是最小的，获得锁

- 不是最小的，对前面的节点进行监听watch

  

3、获得锁的请求，处理完释放锁，删除节点，然后后继第一个节点将收到通知，重复步骤2的判断

![](https://pic1.zhimg.com/80/v2-12be4591c3cc4f2489ffc742a873bf72_720w.png)

![](https://pic2.zhimg.com/80/v2-f1ea0008e6ebf5124a19d07a392e721f_720w.png)

