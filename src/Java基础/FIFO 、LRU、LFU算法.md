---
title: FIFO 、LRU、LFU算法
author: 程序员子龙
index: true
icon: discover
category:
- Java 基础

---
### 简介

三种常见的缓存策略：

**FIFO**：First In First Out，先进先出

**LRU**：Least Recently Used，最近最少使用

**LFU**：Least Frequently Used，最不经常使用

### **FIFO**

**FIFO** 按照“先进先出（First In，First Out）” 的原理淘汰数据，最先加载到内存的最先被置换出去，符合队列的特性，数据结构上使用队列Queue来实现。

![](https://gitee.com/zysspace/mq-demo/raw/master/image/202212091801717.png)

FIFO 算法的描述：设计一种缓存结构，该结构在构造时确定大小，假设大小为 K，并有两个功能：

1. set(key,value)：将记录(key,value)插入该结构。当缓存满时，将最先进入缓存的数据置换掉。
2. get(key)：返回key对应的value值。

新数据插入 FIFO队列尾部，数据在FIFO队列中顺序移动；

淘汰FIFO队列头部的数据；

### LRU

最近最久未使用（Least Recently Used    LRU）算法是⼀种缓存淘汰策略，它是大部分操作系统为最大化页面命中率而广泛采用的一种页面置换算法。该算法的思路是，发生缺页中断时，将最近一段时间内最久未使用的页面置换出去。 从程序运行的原理来看，最近最久未使用算法是比较接近理想的一种页面置换算法，这种算法既充分利用了内存中页面调用的历史信息，又正确反映了程序的局部问题。

LRU算法的思想是：**如果一个数据在最近一段时间没有被访问到，那么可以认为在将来它被访问的可能性也很小。因此，当空间满时，最久没有访问的数据最先被置换（淘汰）**。

LRU算法的描述： 设计一种缓存结构，该结构在构造时确定大小，假设大小为 K，并有两个功能：

1. set(key,value)：将记录(key,value)插入该结构。当缓存满时，将最久未使用的数据置换掉。
2. get(key)：返回key对应的value值。

#### java 实现 LRU 算法

用LinkedHashMap来实现的LRU算法的缓存。

```JAVA
public class LRUCache<K, V> extends LinkedHashMap<K, V> {

    private int cacheSize;
    public LRUCache(int cacheSize) {
        super(16, (float) 0.75, true);
        this.cacheSize = cacheSize;
    }


    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > cacheSize;
    }
}


```

```java
public class Test {


    private static LRUCache<String, Integer> cache = new LRUCache<>(10);

    public static void main(String[] args) {

        for (int i = 0; i < 10; i++) {
            cache.put("key" + i, i);
        }
        System.out.println("all cache :" + cache);
        cache.get("key3");
        System.out.println("get key3 :"+ cache);
        cache.get("key4");
        System.out.println("get key4: "+ cache);
        cache.get("key4");
        System.out.println("get key4 :"+ cache);
        cache.put("key" + 10, 10);
        System.out.println("cache :"+ cache);
        cache.put("key" + 11, 11);
        System.out.println("cache :"+ cache);
        cache.put("key" + 12, 12);
        System.out.println("cache :"+ cache);

    }


}

```

输出结果：

> all cache :{key0=0, key1=1, key2=2, key3=3, key4=4, key5=5, key6=6, key7=7, key8=8, key9=9}
> get key3 :{key0=0, key1=1, key2=2, key4=4, key5=5, key6=6, key7=7, key8=8, key9=9, key3=3}
> get key4: {key0=0, key1=1, key2=2, key5=5, key6=6, key7=7, key8=8, key9=9, key3=3, key4=4}
> get key4 :{key0=0, key1=1, key2=2, key5=5, key6=6, key7=7, key8=8, key9=9, key3=3, key4=4}
> cache :{key1=1, key2=2, key5=5, key6=6, key7=7, key8=8, key9=9, key3=3, key4=4, key10=10}
> cache :{key2=2, key5=5, key6=6, key7=7, key8=8, key9=9, key3=3, key4=4, key10=10, key11=11}
> cache :{key5=5, key6=6, key7=7, key8=8, key9=9, key3=3, key4=4, key10=10, key11=11, key12=12}

### **LFU**

LFU（Least Frequently Used），最近最少使用策略，也就是说在一段时间内，数据被使用频次最少的，优先被淘汰。

LFU将数据和数据的访问频次保存在一个容量有限的容器中，当访问一个数据时：

1. 该数据在容器中，则将该数据的访问频次加1。
2. 该数据不在容器中，则将该数据加入到容器中，且访问频次为1。

当数据量达到容器的限制后，会剔除掉访问频次最低的数据。下图是一个简易的LFU算法示意图。

![](https://gitee.com/zysspace/mq-demo/raw/master/image/202212251625730.png)

### LFU实现

可以使用双哈希表进行实现，一个哈希表用于存储对应的数据，另一个哈希表用于存储数据被使用次数和对应的数据。 

```
package com.demo.web.java;

import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class LFUCache<K, V> {

    /**
     * 容量限制
     */
    private int capacity;

    /**
     * 当前最小使用次数
     */
    private int minUsedCount;

    /**
     * key和数据的映射
     */
    private Map<K, Node> map;
    /**
     * 数据频率和对应数据组成的链表
     */
    private Map<Integer, List<Node>> usedCountMap;

    public LFUCache(int capacity) {
        this.capacity = capacity;
        this.minUsedCount = 1;
        this.map = new HashMap<>();
        this.usedCountMap = new HashMap<>();
    }

    public V get(K key) {

        Node node = map.get(key);
        if (node == null) {
            return null;
        }
        // 增加数据的访问频率
        addUsedCount(node);
        return node.value;
    }

    public V put(K key, V value) {
        Node node = map.get(key);
        if (node != null) {
            // 如果存在则增加该数据的访问频次
            V oldValue = node.value;
            node.value = value;
            addUsedCount(node);
            return oldValue;
        } else {
            // 数据不存在，判断链表是否满
            if (map.size() == capacity) {
                // 如果满，则删除队首节点，更新哈希表
                List<Node> list = usedCountMap.get(minUsedCount);
                Node delNode = list.get(0);
                list.remove(delNode);
                map.remove(delNode.key);
            }
            // 新增数据并放到数据频率为1的数据链表中
            Node newNode = new Node(key, value);
            map.put(key, newNode);
            List<Node> list = usedCountMap.get(1);
            if (list == null) {
                list = new LinkedList<>();
                usedCountMap.put(1, list);
            }

            list.add(newNode);
            minUsedCount = 1;
            return null;
        }
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("LfuCache{");
        List<Integer> usedCountList = this.usedCountMap.keySet().stream().collect(Collectors.toList());
        usedCountList.sort(Comparator.comparingInt(i -> i));
        int count = 0;
        for (int usedCount : usedCountList) {
            List<Node> list = this.usedCountMap.get(usedCount);
            if (list == null) {
                continue;
            }
            for (Node node : list) {
                if (count > 0) {
                    sb.append(',').append(' ');
                }
                sb.append(node.key);
                sb.append('=');
                sb.append(node.value);
                sb.append("(UsedCount:");
                sb.append(node.usedCount);
                sb.append(')');
                count++;
            }
        }
        return sb.append('}').toString();
    }

    private void addUsedCount(Node node) {
        List<Node> oldList = usedCountMap.get(node.usedCount);
        oldList.remove(node);

        // 更新最小数据频率
        if (minUsedCount == node.usedCount && oldList.isEmpty()) {
            minUsedCount++;
        }

        node.usedCount++;
        List<Node> set = usedCountMap.get(node.usedCount);
        if (set == null) {
            set = new LinkedList<>();
            usedCountMap.put(node.usedCount, set);
        }
        set.add(node);
    }

    class Node {

        K key;
        V value;
        int usedCount = 1;

        Node(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }


    public static void main(String[] args) {
        LFUCache<String, String> cache = new LFUCache(3);
        cache.put("keyA", "valueA");
        System.out.println("put keyA");
        System.out.println(cache);
        System.out.println("=========================");

        cache.put("keyB", "valueB");
        System.out.println("put keyB");
        System.out.println(cache);
        System.out.println("=========================");

        cache.put("keyC", "valueC");
        System.out.println("put keyC");
        System.out.println(cache);
        System.out.println("=========================");

        cache.get("keyA");
        System.out.println("get keyA");
        System.out.println(cache);
        System.out.println("=========================");

        cache.put("keyD", "valueD");
        System.out.println("put keyD");
        System.out.println(cache);
    }
}
```

运行结果：

> put keyA
>
> LfuCache{keyA=valueA(UsedCount:1)}
>
> put keyB
>
> LfuCache{keyA=valueA(UsedCount:1), keyB=valueB(UsedCount:1)}
>
> put keyC
>
> LfuCache{keyA=valueA(UsedCount:1), keyB=valueB(UsedCount:1), keyC=valueC(UsedCount:1)}
>
> get keyA
>
> LfuCache{keyB=valueB(UsedCount:1), keyC=valueC(UsedCount:1), keyA=valueA(UsedCount:2)}
>
> put keyD
> LfuCache{keyC=valueC(UsedCount:1), keyD=valueD(UsedCount:1), keyA=valueA(UsedCount:2)}

### LFU相比于LRU的优劣

区别：

LFU是基于访问频次的模式，而LRU是基于访问时间的模式。

优势：

在数据访问符合正态分布时，相比于LRU算法，LFU算法的缓存命中率会高一些。

劣势：

1. LFU的复杂度要比LRU更高一些。
2. 需要维护数据的访问频次，每次访问都需要更新。
3. 早期的数据相比于后期的数据更容易被缓存下来，导致后期的数据很难被缓存。
4. 新加入缓存的数据很容易被剔除，像是缓存的末端发生“抖动”。
