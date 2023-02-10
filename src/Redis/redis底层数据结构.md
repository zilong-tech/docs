---
title: redis底层数据结构
author: 程序员子龙
index: true
icon: discover
category:
- Redis
---
Redis面试中经常被问到，Redis效率为什么这么快，很多同学往往回答：① Redis基于内存操作；② Redis是单线程的，采用了IO多路复用技术；

除了它是内存数据库，使得所有的操作都在内存上进行之外，还有一个重要因素，它实现的数据结构，使得我们对数据进行增删查改操作时，Redis 能高效的处理。

今天来聊下redis的底层数据结构

![](https://gitee.com/zysspace/pic/raw/master/images/202111292231630.webp)

### 简单动态字符串(Simple dynamic string,SDS)

C语言字符串使用长度为n+1的字符数组来表示长度为n的字符串，并且字符数组的最后一个元素总是空字符'\0'，因为这种字符串表示方式不能满足Redis对字符串在安全性、效率以及功能方面的要求，所以Redis自己构建了SDS，用于满足其需求。在Redis中，包含字符串值的键值对都是使用SDS实现的，除此之外，SDS还被用于AOF缓冲区、客户端状态的输入缓冲区。

字符串是Redis中最为常见的数据存储类型，其底层实现是简单动态字符串**sds**(simple dynamic string)，是可以修改的字符串。sds ，`Simple`的意思是简单，`Dynamic`即动态，意味着其具有动态增加空间的能力，扩容不需要使用者关心。`String`是字符串的意思。

#### 使用SDS的好处

1、二进制安全的数据结构

​     所有SDS API都会以处理二进制的方式来处理SDS存放在buf数组里的数据

​	sds在Redis中是实现字符串对象的工具，并且完全取代char*..sds是二进制安全的，它可以存储任意二进制数据，不像C语言字符串那 样以‘\0’来标识字符串结束，因为传统C字符串符合ASCII编码，这种编码的操作的特点就是：遇零则止 。即当读一个字符串时，只要遇到’\0’结尾，就认为到达末尾，就忽略’\0’结尾以后的所有字符。因此，如果传统字符串保存图片，视频等二进制文件，操作文件时就被截断了。

​	SDS表头的buf被定义为字节数组，因为判断是否到达字符串结尾的依据则是表头的len成员，这意味着它可以存放任何二进制的数据和文本数据，包括’\0’

2、提供了内存预分配机制，避免了频繁的内存分配

用于字符串增长操作，当字符串增长时，程序会先检查需不需要对SDS空间进行扩展，如果需要扩展，程序不仅会为SDS分配修改所必要的空间，还会为SDS分配额外的未使用空间，额外分配的未使用空间公式如下：

​        1）第一次创建len属性等于数据实际大小，free等于0，不做预分配。 

​		2）修改后如果已有free空间不够且数据小于1M，每次预分配一倍容 量。如原有len=60byte，free=0，再追加60byte，预分配		  120byte，总占用空 间：60byte+60byte+120byte+1byte。 

​		3）修改后如果已有free空间不够且数据大于1MB，每次预分配1MB数据。如原有len=30MB，free=0，当再追加100byte，预分配1MB，总占用空 间：1MB+100byte+1MB+1byte。

3、兼容C语言的函数库,\0结尾

4、相比C语言字符串，使获取字符串长度时间复杂度降为O(1)

 C语言字符串不记录自身长度，如果想获取自身长度必须遍历整个字符串，对每个字符进行计数，这个操作时间复杂度是O(n)。相比较而言，Redis程序只要访问SDS的len属性就可以直接获取到字符串长度，时间复杂度为O(1)，确保获取字符串长度不会成为Redis性能瓶颈，比如对字符串键反复执行strlen命令。如：获取“Redis”字符串长度时程序会直接访问len属性即可，该字符串长度为5。

![](https://gitee.com/zysspace/pic/raw/master/images/202111281058631.png)

5、惰性删除机制，字符串缩减后的空间不释放，作为预分配空间保留。 

6、节省内存空间

SDS 结构中有个 flags 成员变量，表示的是 SDS 类型。

Redos 一共设计了 5 种类型，分别是 sdshdr5、sdshdr8、sdshdr16、sdshdr32 和 sdshdr64。

这 5 种类型的主要**区别就在于，它们数据结构中的 len 和 alloc 成员变量的数据类型不同**

#### 数据结构

Redis中简单动态字符串sds数据结构与API相关文件是：**sds.h**, **sds.c**。

redis 3.2 以前

```c
struct sdshdr {
    unsigned int len;   //buf中已经使用的长度
    unsigned int free;  //buf中未使用的长度
    char buf[];         //柔性数组buf
};
```

len会占用4个字节，也就是32b，最小值是-2147483648，最大值是2147483647，实际上可能会存储很小的字符串，会造成内存浪费，所以`Redis 3.2 版本`中，对数据结构做出了修改，针对不同的长度范围定义了不同的结构

```c
typedef char *sds;      

struct __attribute__ ((__packed__)) sdshdr5 {     // 对应的字符串长度小于 1<<5
    unsigned char flags; /* 3 lsb of type, and 5 msb of string length */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr8 {     // 对应的字符串长度小于 1<<8
    uint8_t len; /* used */                       //目前字符创的长度
    uint8_t alloc;                                //已经分配的总长度 
    unsigned char flags;                          //flag用3bit来标明类型，类型后续解释，其余5bit目前没有使用
    char buf[];                                   //柔性数组，以'\0'结尾
};
struct __attribute__ ((__packed__)) sdshdr16 {    // 对应的字符串长度小于 1<<16
    uint16_t len; /* used */
    uint16_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr32 {    // 对应的字符串长度小于 1<<32
    uint32_t len; /* used */
    uint32_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr64 {    // 对应的字符串长度小于 1<<64
    uint64_t len; /* used */
    uint64_t alloc; /* excluding the header and null terminator */
    unsigned char flags; /* 3 lsb of type, 5 unused bits */
    char buf[];
};

static inline char sdsReqType(size_t string_size) {
    if (string_size < 1<<5)
        return SDS_TYPE_5;
    if (string_size < 1<<8)
        return SDS_TYPE_8;
    if (string_size < 1<<16)
        return SDS_TYPE_16;
#if (LONG_MAX == LLONG_MAX)
    if (string_size < 1ll<<32)
        return SDS_TYPE_32;
    return SDS_TYPE_64;
#else
    return SDS_TYPE_32;
#endif
}
```

alloc - len = free

用图表示是这样的

![](https://gitee.com/zysspace/pic/raw/master/images/202111292238563.webp)

结构中的每个成员变量分别介绍下：

- **len，SDS 所保存的字符串长度**。这样获取字符串长度的时候，只需要返回这个变量值就行，时间复杂度只需要 O（1）。
- **alloc，分配给字符数组的空间长度**。这样在修改字符串的时候，可以通过 `alloc - len` 计算 出剩余的空间大小，然后用来判断空间是否满足修改需求，如果不满足的话，就会自动将 SDS  的空间扩展至执行修改所需的大小，然后才执行实际的修改操作，所以使用 SDS 既不需要手动修改 SDS 的空间大小，也不会出现前面所说的缓冲区益处的问题。
- **flags，SDS 类型，用来表示不同类型的 SDS**。一共设计了 5 种类型，分别是 sdshdr5、sdshdr8、sdshdr16、sdshdr32 和 sdshdr64，后面在说明区别之处。
- **buf[]，字节数组，用来保存实际数据**。不需要用 “\0” 字符来标识字符串结尾了，而是直接将其作为二进制数据处理，可以用来保存图片等二进制数据。它即可以保存文本数据，也可以保存二进制数据，所以叫字节数组会更好点。

新版带来的好处就是针对长度不同的字符串做了优化，选取不同的数据类型uint8_t或者uint16_t或者uint32_t等来表示长度、一共申请字节的大小等。上面结构体中的__attribute__ ((__packed__)) 设置是告诉编译器取消字节对齐，则结构体的大小就是按照结构体成员实际大小相加得到的。

![](https://gitee.com/zysspace/pic/raw/master/images/202111281212462.png)

为什么设计成5种数据结构？

**是为了能灵活保存不同大小的字符串，从而有效节省内存空间**。比如，在保存小字符串时，结构头占用空间也比较少。

除了设计不同类型的结构体，Redis 在编程上还**使用了专门的编译优化来节省内存空间**，即在 struct 声明了 `__attribute__ ((packed))` ，它的作用是：**告诉编译器取消结构在编译过程中的优化对齐，按照实际占用字节数进行对齐**。

比如，sdshdr16 类型的 SDS，默认情况下，编译器会按照 16 字节对其的方式给变量分配内存，这意味着，即使一个变量的大小不到 16 个字节，编译器也会给它分配 16 个字节。

### redis数据是怎么存储的？

采用的数组+链表，对key进行hash计算，得到hash槽，当有hash冲突时候，采用头插法，产生链表

![](https://pic1.zhimg.com/80/v2-00b168d28f81982894aafba8211d3cb3_1440w.png)

下面看下具体的数据结构

```c
typedef struct redisDb {
    dict *dict;                 /* The keyspace for this DB    */
    dict *expires;              /* Timeout of keys with a timeout set    过期时间字典 */
    dict *blocking_keys;        /* Keys with clients waiting for data (BLPOP)*/
    dict *ready_keys;           /* Blocked keys that received a PUSH */
    dict *watched_keys;         /* WATCHED keys for MULTI/EXEC CAS */
    int id;                     /* Database ID */
    long long avg_ttl;          /* Average TTL, just for stats */
    unsigned long expires_cursor; /* Cursor of the active expire cycle. */
    list *defrag_later;         /* List of key names to attempt to defrag one by one, gradually. */
} redisDb;
```



```c
typedef struct dict {
    dictType *type;
    void *privdata;
    dictht ht[2];// ht[0] , ht[1] =null
    long rehashidx; /* rehashing not in progress if rehashidx == -1 */
    unsigned long iterators; /* number of iterators currently running */
} dict;


typedef struct dictType{

    //计算哈希值的函数
    unsigned int (*hashFunction)(const void * key);

    //复制键的函数
    void *(*keyDup)(void *private, const void *key);

    //复制值得函数
    void *(*valDup)(void *private, const void *obj);  

    //对比键的函数
    int (*keyCompare)(void *privdata , const void *key1, const void *key2)

    //销毁键的函数
    void (*keyDestructor)(void *private, void *key);

    //销毁值的函数
    void (*valDestructor)(void *private, void *obj);  

}dictType
```

我们可以发现，**Redis中有两个哈希表**：

- ht[0]：用于存放**真实**的`key-vlaue`数据
- ht[1]：用于**扩容(rehash)**

在Redis里边，哈希表使用dictht结构来定义：

```c
/* This is our hash table structure. Every dictionary has two of this as we

implement incremental rehashing, for the old to the new table. */
typedef struct dictht {
 dictEntry **table; //哈希表数组
 unsigned long size; //  hashtable 容量
 unsigned long sizemask;  // size -1，用于计算索引值
 unsigned long used;  // 哈希表已有节点数量，hashtable 元素个数   used / size =1
} dictht;
```

哈希表的节点是怎么实现的

```c
typedef struct dictEntry {
     //键
    void *key; //SDS
     //值
    union {
        void *val;
        uint64_t u64;
        int64_t s64;
        double d;
    } v;
      //指向下个哈希节点，组成链表
    struct dictEntry *next;
} dictEntry;
```

value会进一步封装：

```c
//  redisObject对象 :  string , list ,set ,hash ,zset ...
typedef struct redisObject {
    unsigned type:4;        // value的类型 4 bit, sting , hash
    unsigned encoding:4;    // 编码格式  4 bit 
    unsigned lru:LRU_BITS; /* LRU time (relative to global lru_clock) or
                            * LFU data (least significant 8 bits frequency
                            * and most significant 16 bits access time). 
                            *    24 bit 
                            * */
    int refcount;           // 4 byte  
    void *ptr;              // 8 byte  总空间:  4 bit + 4 bit + 24 bit + 4 byte + 8 byte = 16 byte  
} robj;
```

#### **哈希表hashtable**

哈希表是一种保存键值对（key-value）的数据结构。

哈希表中的每一个 key 都是独一无二的，程序可以根据 key 查找到与之关联的 value，或者通过 key 来更新 value，又或者根据 key 来删除整个 key-value等等。

当一个哈希键包含的 key-value 比较多，或者 key-value 中元素都是比较长多字符串时，Redis 就会使用哈希表作为哈希键的底层实现。

Hash 表优点在于，它**能以 O(1) 的复杂度快速查询数据**。主要是通过 Hash 函数的计算，就能定位数据在表中的位置，紧接着可以对数据进行操作，这就使得数据操作非常快。

但是存在的风险也是有，在哈希表大小固定的情况下，随着数据不断增多，那么**哈希冲突**的可能性也会越高。

解决哈希冲突的方式，有很多种。**Redis 采用了链式哈希**，在不扩容哈希表的前提下，将具有相同哈希值的数据链接起来，以便这些数据在表中仍然可以被查询到。

#### 哈希冲突

哈希表实际上是一个数组，数组里多每一个元素就是一个哈希桶。

当一个键值对的键经过 Hash 函数计算后得到哈希值，再将(哈希值 % 哈希表大小)取模计算，得到的结果值就是该 key-value 对应的数组元素位置，也就是第几个哈希桶。

举个例子，有一个可以存放 8 个哈希桶的哈希表。key1 经过哈希函数计算后，再将「哈希值 % 8 」进行取模计算，结果值为 1，那么就对应哈希桶 1，类似的，key9 和 key10 分别对应哈希桶 1 和桶 6。

![](https://gitee.com/zysspace/pic/raw/master/images/202111292307150.webp)

此时，key1 和 key9 对应到了相同的哈希桶中，这就发生了哈希冲突。

因此，**当有两个以上数量的 kay 被分配到了哈希表数组的同一个哈希桶上时，此时称这些 key 发生了冲突。**

#### 链式哈希

Redis 采用了「**链式哈希**」的方法来解决哈希冲突。

实现的方式就是每个哈希表节点都有一个 next 指针，多个哈希表节点可以用 next 指针构成一个单项链表，**被分配到同一个哈希桶上的多个节点可以用这个单项链表连接起来**，这样就解决了哈希冲突。

还是用前面的哈希冲突例子，key1 和 key9 经过哈希计算后，都落在同一个哈希桶，链式哈希的话，key1 就会通过 next 指针指向 key9，形成一个单向链表。

![](https://gitee.com/zysspace/pic/raw/master/images/202111292308420.webp)

不过，链式哈希局限性也很明显，随着链表长度的增加，在查询这一位置上的数据的耗时就会增加，毕竟链表的查询的时间复杂度是 O（n）。

要想解决这一问题，就需要进行 rehash，就是对哈希表的大小进行扩展。

接下来，看看 Redis 是如何实现的 rehash 的。

## rehash

rehash就是扩容，在对哈希表进行扩展或者收缩操作时，reash过程并不是一次性地完成的，而是**渐进式**地完成的。**Redis是专门使用一个哈希表来做rehash的**。

Redis 会使用了两个全局哈希表进行 rehash。

在正常服务请求阶段，插入的数据，都会写入到「哈希表 1」，此时的「哈希表 2 」 并没有被分配空间。

Redis在rehash时采取渐进式的原因：**数据量如果过大的话，一次性rehash会有庞大的计算量，这很可能导致服务器一段时间内停止服务**。

1、在字典中维持一个索引计数器变量rehashidx，并将设置为0，表示rehash开始。给「哈希表 2」 分配空间，一般会比「哈希表 1」 大 2 倍。

2、在rehash期间每次对字典进行增加、查询、删除和更新操作时，**除了执行指定命令外**；还会将ht[0]中rehashidx索引上的值**rehash到ht[1]**，操作完成后rehashidx+1。

3、字典操作不断执行，最终在某个时间点，所有的键值对完成rehash，这时**将rehashidx设置为-1，表示rehash完成**

4、在渐进式rehash过程中，字典会同时使用两个哈希表ht[0]和ht[1]，所有的更新、删除、查找操作也会在两个哈希表进行。例如要查找一个键的话，**服务器会优先查找ht[0]，如果不存在，再查找ht[1]**，诸如此类。此外当执行**新增操作**时，新的键值对**一律保存到ht[1]**，不再对ht[0]进行任何操作，以保证ht[0]的键值对数量只减不增，直至变为空表。

![](https://gitee.com/zysspace/pic/raw/master/images/202111292312687.webp)



#### rehash 触发条件

介绍了 rehash 那么多，还没说什么时情况下会触发 rehash 操作呢？

rehash 的触发条件跟**负载因子（load factor）**有关系。

负载因子可以通过下面这个公式计算：

负载因子 = 哈希表已保存节点数量  / 哈希表大小

触发 rehash 操作的条件，主要有两个：

- **当负载因子大于等于 1 ，并且 Redis 没有在执行 bgsave 命令或者 bgrewiteaof 命令，也就是没有执行 RDB 快照或没有进行 AOF 重写的时候，就会进行 rehash 操作。**

- **当负载因子大于等于 5 时，此时说明哈希冲突非常严重了，不管有没有有在执行 RDB 快照或 AOF 重写，都会强制进行 rehash 操作。**

  

我们看下整体的结构

![](https://gitee.com/zysspace/pic/raw/master/images/202111281850445.png)



Redis 底层的数据结构一共有 6 种，它和数据类型对应关系也如下图：

<img src="https://pic3.zhimg.com/80/v2-0911c4ab11abb6ee12122643ee59479d_720w.png" style="zoom:50%;" />

可以看到，有些数据类型可以由两种 数据结构实现：

- List 数据类型底层数据结构由「双向链表」或「压缩表列表」实现；
- Hash 数据类型底层数据结构由「压缩列表」或「哈希表」实现；
- Set 数据类型底层数据结构由「哈希表」或「整数集合」实现；
- Zset 数据类型底层数据结构由「压缩列表」或「跳表」实现；

### list底层数据结构

List是一个有序(按加入的时序排序)的数据结构，Redis采用quicklist（双端链表） 和 ziplist 作为List的底层实现。

压缩列表(ziplist)是Redis为了节约内存而开发的，是由一系列的**特殊编码的连续内存块**组成的**顺序性**数据结构。

#### ziplist

ziplist是由一系列特殊编码的连续内存块组成的顺序存储结构，类似于数组，ziplist在内存中是连续存储的，但是不同于数组，为了节省内存 ziplist的每个元素所占的内存大小可以不同（数组中叫元素，ziplist叫节点entry，下文都用“节点”），每个节点可以用来存储一个整数或者一个字符串。
![](https://gitee.com/zysspace/pic/raw/master/images/202111282149414.png)

zlbytes: ziplist的长度（单位: 字节)，是一个32位无符号整数，记录整个压缩列表占用对内存字节数；
zltail: 记录压缩列表「尾部」节点距离起始地址由多少字节，也就是列表尾的偏移量；，反向遍历ziplist或者pop尾部节点的时候有用。
zllen: ziplist的节点（entry）个数
entry: 节点
zlend: 值为0xFF，用于标记ziplist的结尾

**ziplist将一些必要的偏移量信息记录在了每一个节点里，使之能跳到上一个节点或下一个节点。**

节点的布局(entry)

每个节点由三部分组成：prerawlen、len、data

- prerawlen: 记录上一个节点的长度，为了方便反向遍历ziplist
- len: entry中数据的长度
- data: 当前节点的值，可以是数字或字符串 

压缩列表从表尾节点**倒序遍历**，首先指针通过zltail偏移量指向表尾节点，然后通过指向**节点记录的前一个节点的长度依次向前遍历访问整个压缩列表**。

在压缩列表中，如果我们要查找定位第一个元素和最后一个元素，可以通过表头三个字段的长度直接定位，复杂度是 O(1)。而查找其他元素时，就没有这么高效了，只能逐个查找，此时的复杂度就是 O(N) 了。

#### 连锁更新

压缩列表除了查找复杂度高的问题，压缩列表在插入元素时，如果内存空间不够了，压缩列表还需要重新分配一块连续的内存空间，而这可能会引发**连锁更新**的问题。

压缩列表里的每个节点中的  prevlen 属性都记录了「前一个节点的长度」，而且 prevlen 属性的空间大小跟前一个节点长度值有关，比如：

- 如果前一个**节点的长度小于 254 字节**，那么 prevlen 属性需要用 **1 字节的空间**来保存这个长度值；
- 如果前一个**节点的长度大于等于 254 字节**，那么 prevlen 属性需要用 **5 字节的空间**来保存这个长度值；

现在假设一个压缩列表中有多个连续的、长度在 250～253 之间的节点，如下图：

![](https://gitee.com/zysspace/pic/raw/master/images/202111292258386.webp)

因为这些节点长度值小于 254 字节，所以 prevlen 属性需要用 1 字节的空间来保存这个长度值。

这时，如果将一个长度大于等于 254 字节的新节点加入到压缩列表的表头节点，即新节点将成为 e1 的前置节点，如下图：

![](https://gitee.com/zysspace/pic/raw/master/images/202111292259345.webp)



因为 e1 节点的 prevlen 属性只有 1 个字节大小，无法保存新节点的长度，此时就需要对压缩列表的空间重分配操作，并将 e1 节点的 prevlen 属性从原来的 1 字节大小扩展为 5 字节大小。

多米诺牌的效应就此开始。

![](https://gitee.com/zysspace/pic/raw/master/images/202111292300101.webp)

e1 原本的长度在 250～253 之间，因为刚才的扩展空间，此时 e1 的长度就大于等于 254 了，因此原本 e2 保存 e1 的 prevlen 属性也必须从 1 字节扩展至 5 字节大小。

正如扩展 e1 引发了对 e2 扩展一样，扩展 e2 也会引发对 e3 的扩展，而扩展 e3 又会引发对 e4 的扩展…. 一直持续到结尾。

**这种在特殊情况下产生的连续多次空间扩展操作就叫做「连锁更新」**，就像多米诺牌的效应一样，第一张牌倒下了，推动了第二张牌倒下；第二张牌倒下，又推动了第三张牌倒下….

连锁更新一旦发生，就会导致压缩列表 占用的内存空间要多次重新分配，这就会直接影响到压缩列表的访问性能。

所以说，虽然压缩列表紧凑型的内存布局能节省内存开销，但是如果保存的元素数量增加了，或是元素变大了，压缩列表就会面临「连锁更新」的风险。

因此，**压缩列表只会用于保存的节点数量不多的场景**，只要节点数量足够小，即使发生连锁更新，也是能接受的。

**ziplist 的优点是内存紧凑，访问效率高，缺点是更新效率低，并且数据量较大时，可能导致大量的内存复制**

#### quicklist 

quicklist 是一个双向链表，并且是一个 ziplist 的双向链表，也就是说 quicklist 的每个节点都是一个 ziplist。quicklist是由ziplist组成的双向链表，链表中的每一个节点都以压缩列表ziplist的结构保存着数据，而ziplist有多个entry节点，保存着数据。相当与一个quicklist节点保存的是**一片数据，而不再是一个数据**。

- quicklist 是一个双向链表，head、tail分别指向头尾节点

- quicklistNode 是双向链表的节点，prev、next分别指向前驱、后继结点

- quicklistNode.zl 指向一个ziplist（或者quicklistLZF结构）
- quicklistEntry 包裹着list的每一个值，作为ziplist的一个节点
- quicklist宏观上是一个双向链表，因此，它具有一个双向链表的有点，进行插入或删除操作时非常方便，虽然复杂度为O(n)，但是不需要内存的复制，提高了效率，而且访问两端元素复杂度为O(1)。
- quicklist微观上是一片片entry节点，每一片entry节点内存连续且顺序存储，可以通过二分查找以 log2(n)log2(n) 的复杂度进行定位。

![](https://gitee.com/zysspace/pic/raw/master/images/202111282203258.png)

可以通过设置每个ziplist的最大容量，quicklist的数据压缩范围，提升数据存取效率

```
list-max-ziplist-size  -2        //  单个ziplist节点最大能存储  8kb  ,超过则进行分裂,将数据存储在新的ziplist节点中
list-compress-depth  1        //  0 代表所有节点，都不进行压缩，1， 代表从头节点往后走一个，尾节点往前走一个不用压缩，其他的全部压缩，2，3，4 ... 以此类推
```

### Hash底层数据结构

Hash 数据结构底层实现为一个字典( dict ),也是RedisBb用来存储K-V的数据结构,当数据量比较小，或者单个元素比较小时，底层用ziplist存储，数据大小和元素数量阈值可以通过如下参数设置。

![](https://gitee.com/zysspace/pic/raw/master/images/202111282226814.png)

```shell
hash-max-ziplist-entries  512    //  ziplist 元素个数超过 512 ，将改为hashtable编码 
hash-max-ziplist-value    64      //  单个元素大小超过 64 byte时，将改为hashtable编码
```



hashtable上文讲过了，这里不再赘述了。

![](https://pica.zhimg.com/80/v2-100b1a12f6ae0b1e35bc4670fa468c37_1440w.png)

### set底层数据结构

Set 为无序的，自动去重的集合数据类型，Set 数据结构底层实现为一个value 为 null 的 字典( dict ),当数据可以用整形表示时，Set集合将被编码为intset数据结构。两个条件任意满足时Set将用hashtable存储数据。1， 元素个数大于 set-max-intset-entries , 2 ， 元素无法用整形表示 

```shell
set-max-intset-entries 512       // intset 能存储的最大元素个数，超过则用hashtable编码
```

![](https://pica.zhimg.com/80/v2-f1e0f092b0e310810863390afb5de174_1440w.png)



### zset底层数据结构

ZSet  为有序的，自动去重的集合数据类型，ZSet 数据结构底层实现为 字典(dict) + 跳表(skiplist) ,当数据比较少时，用ziplist编码结构存储。

![](https://pica.zhimg.com/80/v2-bf6176ad3443a8198bc563ed0312507a_720w.png)

```
zset-max-ziplist-entries  128    // 元素个数超过128 ，将用skiplist编码
zset-max-ziplist-value     64     //  单个元素大小超过 64 byte, 将用 skiplist编码
```

#### 跳跃表(shiplist)

跳跃表是一种有序的数据结构，它通过在每个节点中维持多个指向其他的节点指针，从而达到快速访问节点的目的。

Redis使用跳跃表作为有序集合键的底层实现之一，如果一个有序集合包含的元素数量比较多，又或者有序集合中元素的成员(member)是比较长的字符串时，Redis就会使用跳跃表来作为有序集合键的底层实现。

Redis只在两个地方用到了跳跃表，一个是实现有序集合键，另一个是在集群节点中用作内部数据结构

Redis的跳跃表由redis.h/zskiplistNode和redis.h/zskiplist两个结构定义，其中zskiplistNode结构用于表示跳跃表节点，而zskiplist结构则用于保存跳跃表节点的相关信息，比如节点的数量，以及指向表头节点和表尾节点的指针等等。

我们先来看一下一张完整的跳跃表的图

![](https://gitee.com/zysspace/pic/raw/master/images/202111302131764.png)

图片最左边的是zskiplist结构，该结构包含以下属性：

header：指向跳跃表的表头节点

tail：指向跳跃表的表尾节点

level：记录目前跳跃表内，层数最大的那个节点的层数（表头节点的层数不计算在内）

length：记录跳跃表的长度，目前跳跃表包含的节点数量(表头节点不计算在内)

位于zskiplist结构右方的是四个zskiplistNode结构，该结构包含以下属性：

层（level）：节点中用LI、L2、L3等字样标记节点的各个层，L1代表第一层，L2 代表第二层，以此类推。

每个层都带有两个属性：前进指针和跨度。前进指针用于 访问位于表尾方向的其他节点，而跨度则记录了前进指针所指向节点和当前节点的距离。在上面的图片中，连线上带有数字的箭头就代表前进指针，而那个数字就是 跨度。当程序从表头向表尾进行遍历时，访问会沿着层的前进指针进行。

后退指针 （backward）：节点中用BW字样标记节点的后退指针，它指向位于当前节 点的前一个节点。后退指针在程序从表尾向表头遍历时使用。

分值(score)：各个节点中的1.0、2.0和3.0是节点所保存的分值。在跳跃表中， 节点按各自所保存的分值从小到大排列。

成员对象(obj )：各个节点中的。o1、o2和o3是节点所保存的成员对象。

> 注意:表头节点和其他节点的构造是一样的：表头节点也有后退指针、分值和成员对象，不 过表头节点的这些属性都不会被用到，所以图中省略了这些部分，只显示了表头节点的各个层。

#### 跳跃表节点

```c
/* ZSETs use a specialized version of Skiplists */
typedef struct zskiplistNode {
    robj *obj;  /*成员对象*/
    double score;   /*分值*/
    struct zskiplistNode *backward; /*后退指针*/
    struct zskiplistLevel { /*层*/
        struct zskiplistNode *forward;  /*前进指针*/
        unsigned int span;  /*跨度*/
    } level[];
} zskiplistNode;
```

1、层 level
跳跃表节点的level数组可以包含多个元素，每个元素都包含一个指向其他节点的指针，程序可以通过这些层来加快访问其他节点的速度，一般来说，层的数量越多，访问其他节点的速度就越快。

每次创建一个新跳跃表节点的时候，程序根据幂次定律(power law，越大的数出现的概率越小)随机生成一个介于1和32之间的值作为level数组的大小，这个大小就是层的“高度”。

下图分别展示了三个高度为1层、3层和5层的节点，因为C语言的数组索引总是从0开始的，所以节点的第一层是level[0]，而第二层是level[1]，依次类推。
![](https://gitee.com/zysspace/pic/raw/master/images/202111302207836.png)

2、前进指针 forward

每个层都有一个指向表尾方向的前进指针(level[i].forward属性)，用于从表头向表尾方向访问节点。下图用虚线表示出了程序从表头向表尾方向，遍历跳跃表中所有节点的路径：

![](https://gitee.com/zysspace/pic/raw/master/images/202111302212383.png)

- 迭代程序首先访问跳跃表的第一个节点(表头)，然后从第四层的前进指针移动到表中的第二个节点。 
- 在第二个节点时，程序沿着第二层的前进指针移动到表中的第三个节点。 
- 在第三个节点时，程序同样沿着第二层的前进指针移动到表中的第四个节点。 
- 当程序再次沿着第四个节点的前进指针移动时，它碰到一个NULL，程序知道这时已经到达了跳跃表的表尾，于是结束这次遍历。

3、跨度  level

层的跨度(level[i].span属性)用于记录两个节点之间的距离：

- 两个节点之间的跨度越大，它们相距得就越远。
- 指向NULL的所有前进指针的跨度都为0，因为它们没有连向任何节点。

遍历操作只使用前进指针就可以完成了，跨度实际上是用来计算排位(rank)的：在查找某个节点的过程中，将沿途访问过的所有层的跨度累计起来，得到的结果就是目标节点在跳跃表中的排位。

举个例子，下图用虚线标记了在跳跃表中查找分值为3.0、成员对象为o3的节点时，沿途经历的层：查找的过程只经过了一个层，并且层的跨度为3，所以目标节点在跳跃表中的排位为3。

![](https://gitee.com/zysspace/pic/raw/master/images/202111302218869.png)

4、后退指针 backward

节点的后退指针(backward属性)用于从表尾向表头方向访问节点：跟可以一次跳过多个节点的前进指针不同，因为每个节点只有一个后退指针，所以每次只能后退至前一个节点。

下图用虚线展示了如何从表尾向表头遍历跳跃表中的所有节点：程序首先通过跳跃表的tail指针访问表尾节点，然后通过后退指针访问倒数第二个节点，之后再沿着后退指针访问倒数第三个节点，再之后遇到指向NULL的后退指针，于是访问结束。
![](https://gitee.com/zysspace/pic/raw/master/images/202111302223884.png)

5、分值和成员

节点的分值(score属性)是一个double类型的浮点数，跳跃表中的所有节点都按分值从小到大来排序。

节点的成员对象(obj属性)是一个指针，它指向一个字符串对象，而字符串对象则保存着一个SDS值。

在同一个跳跃表中，各个节点保存的成员对象必须是唯一的，但是多个节点保存的分值却可以是相同的：分至相同的节点将按照成员对象在字典中的大小来进行排序，成员对象较小的节点会排在前面(靠近表头的方向)，而成员对象较大的节点则会排在后面(靠近表尾的方向)。

举个例子，在下图中所示的跳跃表中，三个跳跃表节点都保存了相同的分值10086.0，但保存成员对象o1的节点却排在保存成员对象o2和o3的节点的前面，而保存成员对象o2的节点又排在保存成员对象o3的节点之前，由此可见，o1、o2、o3三个成员对象在字典中的排序为o1<=o2<=o3。
![](https://gitee.com/zysspace/pic/raw/master/images/202111302227501.png)

#### 跳跃表

zskiplist结构的定义：

```c
typedef struct zskiplist {
    struct zskiplistNode *header, *tail;    //header指向跳跃表的表头节点，tail指向跳跃表的表尾节点
    unsigned long length;   //记录跳跃表的长度，也即是，跳跃表目前包含节点的数量(表头节点不计算在内)
    int level;  //记录目前跳跃表内，层数最大的那个节点的层数(表头节点的层数不计算在内)
} zskiplist;
```

仅靠多个跳跃表节点就可以组成一个跳跃表，如下图所示：

![](https://gitee.com/zysspace/pic/raw/master/images/202111302230413.png)

但通过使用一个zskiplist结构来持有这些节点，程序可以更方便地对整个跳跃表进行处理，比如快速访问跳跃表的表头节点和表尾节点，或者快速地获取跳跃表节点的数量(也即是跳跃表的长度)等信息，如下图所示：

![](https://gitee.com/zysspace/pic/raw/master/images/202111302232046.png)

header和tail指针分别指向跳跃表的表头和表尾节点，通过这两个指针，程序定位表头节点和表尾节点的复杂度为0(1)。

通过使用length属性来记录节点的数量，程序可以在0(1)复杂度内返回跳跃表的长度。

level属性则用于在0 (1)复杂度内获取跳跃表中层高最大的那个节点的层数量

> 注意 表头节点的层高并不计算在内。



**时间复杂度**

学过数据结构的都知道，在中查询一个元素的时间复杂度为O(n)，即使该单链表是有序的，我们也不能通过2分的方式缩减时间复杂度。 

![img](https://pica.zhimg.com/80/v2-4dc30e44108a9247e6a02c34f4b04d26_1440w.png)

 如上图，我们要查询元素为55的结点，必须从头结点，循环遍历到最后一个节点，不算-INF(负无穷)一共查询8次。那么用什么办法能够用更少的次数访问55呢？最直观的，当然是新开辟一条捷径去访问55。 

![img](https://pic1.zhimg.com/80/v2-54510a4d4fee4831a76a2cf49008a236_1440w.png)

  如上图，我们要查询元素为55的结点，只需要在L2层查找4次即可。在这个结构中，查询结点为46的元素将耗费最多的查询次数5次。即先在L2查询46，查询4次后找到元素55，因为链表是有序的，46一定在55的左边，所以L2层没有元素46。然后我们退回到元素37，到它的下一层即L1层继续搜索46。非常幸运，我们只需要再查询1次就能找到46。这样一共耗费5次查询。

那么，如何才能更快的搜寻55呢？有了上面的经验，我们就很容易想到，再开辟一条捷径。 

![img](https://pica.zhimg.com/80/v2-36a69a7f97e1033bbdd398d275854f63_1440w.png)

如上图，我们搜索55只需要2次查找即可。这个结构中，查询元素46仍然是最耗时的，需要查询5次。即首先在L3层查找2次，然后在L2层查找2次，最后在L1层查找1次，共5次。很显然，这种思想和2分非常相似，那么我们最后的结构图就应该如下图。

![img](https://pic2.zhimg.com/80/v2-baa43d44a1c639634c26b39b737c581a_1440w.png)

  我们可以看到，最耗时的访问46需要6次查询。即L4访问55，L3访问21、55，L2访问37、55，L1访问46。我们直觉上认为，这样的结构会让查询有序链表的某个元素更快。那么究竟算法复杂度是多少呢？

​       如果有n个元素，因为是2分，所以层数就应该是log n层 (本文所有log都是以2为底)，再加上自身的1层。以上图为例，如果是4个元素，那么分层为L3和L4，再加上本身的L2，一共3层；如果是8个元素，那么就是3+1层。最耗时间的查询自然是访问所有层数，耗时logn+logn，即2logn。为什么是2倍的logn呢？我们以上图中的46为例，查询到46要访问所有的分层，每个分层都要访问2个元素，中间元素和最后一个元素。所以时间复杂度为O(logn)。

### 总结

跳跃表是有序集合的底层实现之一。

Redis的跳跃表实现由zskiplist和zskiplistNode两个结构组成，其中zskiplist 用于保存跳跃表信息（比如表头节点、表尾节点、长度），而zskiplistNode则用于表 示用跃表节点。

每个跳跃表节点的层高都是1至32之间的随机数。

在同一个跳跃表中，多个节点可以包含相同的分值，但每个节点的成员对象必须是 唯一的。

跳跃表中的节点按照分值大小进行排序，当分值相同时，节点按照成员对象的大小 进行排序。