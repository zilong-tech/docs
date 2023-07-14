---
title: Netty ByteBuf介绍
author: 程序员子龙
index: true
icon: discover
category:
- Netty
---
### **ByteBuf介绍**

网络数据的基本单位是字节。Java NIO 提供了 ByteBuffer 作为它 的字节容器，但是这个类使用起来过于复杂，而且也有些繁琐。

Netty 的 ByteBuffer 替代品是 ByteBuf，一个强大的实现，既解决了 JDK API 的局限性， 又为网络应用程序的开发者提供了更好的 API。

### 优点

- 通过内置的复合缓冲区类型实现了透明的零拷贝。
- 容量可以按需增长。
- 在读和写这两种模式之间切换不需要调用 ByteBuffer 的 flip()方法。
- 读和写使用了不同的索引。
- 支持引用计数。
- 支持池化。
-  所有的网络通信都会涉及到字节序列的移动。

### 结构

从结构上来说，ByteBuf 由一串字节数组构成。数组中每个字节用来存放信息。

ByteBuf 提供了两个索引，一个用于读取数据，一个用于写入数据。这两个索引通过在字节数组中移动，来定位需要读或者写信息的位置。

当从 ByteBuf 读取时，它的 readerIndex（读索引）将会根据读取的字节数递增。

同样，当写 ByteBuf 时，它的 writerIndex 也会根据写入的字节数进行递增。

![](https://note.youdao.com/yws/public/resource/bbc5cfef81b2951d769807ed748343b9/xmlnote/200440C3D0954D23A44191AD0A73FDA0/84872)



ByteBuf有几个重要属性：

- capacity：容量；
- 0：缓冲区开始位置；
- readIndex：下一个读位置；
- writeIndex：下一个写位置；

已经读取的区域：[0,readerindex)        

可读取的区域：[readerindex,writerIndex)        

可写的区域: [writerIndex,capacity)         

ByteBuf 维护了两个不同的索引，名称以 read 或者 write 开头的 ByteBuf 方法，将会推进其对应的索引，而名称以 set 或者 get 开头的操作则不会。

可以指定 ByteBuf 的最大容量。试图移动写索引（即 writerIndex）超过这个值将会触发一个异常。（默认的限制是 Integer.MAX_VALUE。） 

如果 readerIndex 超过了 writerIndex 的时候，Netty 会抛出 IndexOutOf-BoundsException 异常。

ByteBuf都是基于字节序列的，类似于一个字节数组。在AbstractByteBuf里面定义了下面5个变量：

```java
//源码
int readerIndex; //读索引
int writerIndex; //写索引
private int markedReaderIndex;//标记读索引
private int markedWriterIndex;//标记写索引
private int maxCapacity;//缓冲区的最大容量
```

### **使用模式** 

#### 堆缓冲区

最常用的 ByteBuf 模式是将数据存储在 JVM 的堆空间中。这种模式被称为支撑数组（backing array），它能在没有使用池化的情况下提供快速的分配和释放。可以由 hasArray() 来判断检查 ByteBuf 是否由数组支撑。如果不是，则这是一个直接缓冲区。 

#### 直接缓冲区 

直接缓冲区是另外一种 ByteBuf 模式。 

直接缓冲区的主要缺点是，相对于基于堆的缓冲区，它们的分配和释放都较为昂贵。 

#### 复合缓冲区 

复合缓冲区 CompositeByteBuf，它为多个 ByteBuf 提供一个聚合视图。比如 HTTP 协议， 分为消息头和消息体，这两部分可能由应用程序的不同模块产生，各有各的 ByteBuf，将会在消息被发送的时候组装为一个 ByteBuf，此时可以将这两个 ByteBuf 聚合为一个 CompositeByteBuf，然后使用统一和通用的 ByteBuf API 来操作。 

### **分配**

如何在的程序中获得 ByteBuf 的实例，并使用它呢？Netty 提供了两种方式

#### ByteBufAllocator 接口 

ByteBufAllocator 分配我们所描述过的任意类型的 ByteBuf 实例。

| 名称              | 描述                                                         |
| ----------------- | ------------------------------------------------------------ |
| buffer()          | 返回一个基于堆或者直接内存存储的 ByteBuf                     |
| heapBuffer()      | 返回一个基于堆内存存储的 ByteBuf                             |
| directBuffer()    | 返回一个基于直接内存存储的 ByteBuf                           |
| compositeBuffer() | 返回一个可以通过添加最大到指定数目的基于堆的或者直接         |
| ioBuffer()        | 返回一个用于套接字的 I/O 操作的 ByteBuf，当所运行的环境具有 sun.misc.Unsafe 支持时，返回基于直接内存存储的 ByteBuf， |

可以通过 Channel（每个都可以有一个不同的 ByteBufAllocator 实例）或者绑定到 ChannelHandler 的 ChannelHandlerContext 获取一个到 ByteBufAllocator 的引用。

```java
//从channel 获取ByteBufAllocator的引用
Channel channel = ctx.channel();
ByteBufAllocator alloc = channel.alloc();

//从ChannelHandlerContext获取一个ByteBufAllocator的引用
ByteBufAllocator alloc1 = ctx.alloc();
```

Netty 提供了两种 ByteBufAllocator 的实现：PooledByteBufAllocator 和 Unpooled-ByteBufAllocator。前者池化了 ByteBuf 的实例以提高性能并最大限度地减少内存碎片。后者的实现不池化 ByteBuf 实例，并且在每次它被调用时都会返回一个新的实例。 

Netty4.1 默认使用了 PooledByteBufAllocator。

#### Unpooled 缓冲区 

Netty 提供了一个简单的称为 Unpooled 的工具类，它提供了静态的辅助方法来创建未池化的 ByteBuf 实例。 

buffer() 返回一个未池化的基于堆内存存储的 ByteBuf 

directBuffer()返回一个未池化的基于直接内存存储的 ByteBuf 

wrappedBuffer() 返回一个包装了给定数据的 ByteBuf 

copiedBuffer() 返回一个复制了给定数据的 ByteBuf 

Unpooled 类还可用于 ByteBuf 同样可用于那些并不需要 Netty 的其他组件的非网络项目。

```java
Unpooled.copiedBuffer("Hello,Netty",CharsetUtil.UTF_8)
```

### 使用

**访问/读写操作** 

如同在普通的 Java 字节数组中一样，ByteBuf 的索引是从零开始的：第一个字节的索引是 0，最后一个字节的索引总是 capacity() - 1。使用那些需要一个索引值参数(**随机访问**, 即是数组下标)的方法来访问数据，既不会改变 readerIndex， 也不会改writerIndex。如果有需要，也可以通过调用 readerIndex(index)或者 writerIndex(index)来手动移动这两者。

**顺序访问**通过索引访问。有两种类别的读/写操作： 

get()和 set()操作，从给定的索引开始，并且保持索引不变；get+数据字长（bool.byte,int,short,long,bytes） 

read()和 write()操作，从给定的索引开始，并且会根据已经访问过的字节数对索引进行调整。 

**更多的操作** 

isReadable() 如果至少有一个字节可供读取，则返回 true

isWritable() 如果至少有一个字节可被写入，则返回 true 

readableBytes() 返回可被读取的字节数 

writableBytes() 返回可被写入的字节数 

capacity() 返回 ByteBuf 可容纳的字节数。在此之后，它会尝试再次扩展直到达到 

maxCapacity() 

maxCapacity() 返回 ByteBuf 可以容纳的最大字节数 

hasArray() 如果 ByteBuf 由一个字节数组支撑，则返回 true 

array() 如果 ByteBuf 由一个字节数组支撑则返回该数组；否则，它将抛出一个 

UnsupportedOperationException 异常

**可丢弃字节** 

可丢弃字节的分段包含了已经被读过的字节。通过调用 discardReadBytes()方法，可以丢弃它们并回收空间。这个分段的初始大小为 0，存储在 readerIndex 中，会随着 read 操作的执行而增加（get*操作不会移动 readerIndex）。 

缓冲区上调用 discardReadBytes()方法后，可丢弃字节分段中的空间已经变为可写的了。 频繁地调用 discardReadBytes()方法以确保可写分段的最大化，但是请注意，这将极有可能会导致内存复制，因为可读字节必须被移动到缓冲区的开始位置。建议只在有真正需要的时候 才这样做，例如，当内存非常宝贵的时候。

![](http://img.xxfxpt.top/202205212147253.png)

**可读字节**

ByteBuf 的可读字节分段存储了实际数据。新分配的、包装的或者复制的缓冲区的默认的 readerIndex 值为 0。 

**可写字节**

可写字节分段是指一个拥有未定义内容的、写入就绪的内存区域。新分配的缓冲区的 writerIndex 的默认值为 0。任何名称以 write 开头的操作都将从当前的 writerIndex 处开始写数据，并将它增加已经写入的字节数。

![](http://img.xxfxpt.top/202205212150750.png)

**查找操作**

在 ByteBuf 中有多种可以用来确定指定值的索引的方法。最简单的是使用 indexOf()方法。 较复杂的查找可以通过调用 forEachByte()。 

**派生缓冲区** 

派生缓冲区为 ByteBuf 提供了以专门的方式来呈现其内容的视图。这类视图是通过以下方法被创建的： 

duplicate()； 

slice()； 

slice(int, int)； 

Unpooled.unmodifiableBuffer(…)； 

order(ByteOrder)； 

readSlice(int)。 

每个这些方法都将返回一个新的 ByteBuf 实例，它具有自己的读索引、写索引和标记索引。其内部存储和 JDK 的 ByteBuffer 一样也是共享的。 

**ByteBuf** 复制 如果需要一个现有缓冲区的真实副本，请使用 copy()或者 copy(int, int)方法。不同于派生缓冲区，由这个调用所返回的 ByteBuf 拥有独立的数据副本。

**引用计数**

引用计数是一种通过在某个对象所持有的资源不再被其他对象引用时释放该对象所持有的资源来优化内存使用和性能的技术。Netty 在第 4 版中为 ByteBuf 引入了引用计数技术， interface ReferenceCounted。 

**工具类**

**ByteBufUtil** 提供了用于操作 ByteBuf 的静态的辅助方法。因为这个 API 是通用的，并且和池化无关，所以这些方法已然在分配类的外部实现。 

这些静态方法中最有价值的可能就是 hexdump()方法，它以十六进制的表示形式打印 ByteBuf 的内容。这在各种情况下都很有用，例如，出于调试的目的记录 ByteBuf 的内容。 

十六进制的表示通常会提供一个比字节值的直接表示形式更加有用的日志条目，此外，十六进制的版本还可以很容易地转换回实际的字节表示。 

另一个有用的方法是 boolean equals(ByteBuf, ByteBuf)，它被用来判断两个 ByteBuf 实例的相等性。 

**资源释放**

当某个 ChannelInboundHandler 的实现重写 channelRead()方法时，它要负责显式地释放与池化的 ByteBuf 实例相关的内存。Netty 为此提供了一个实用方法 

ReferenceCountUtil.release() 

Netty 将使用 WARN 级别的日志消息记录未释放的资源，使得可以非常简单地在代码中发现违规的实例。但是以这种方式管理资源可能很繁琐。一个更加简单的方式是使用 

SimpleChannelInboundHandler，SimpleChannelInboundHandler 会自动释放资源。 

1、对于入站请求，Netty 的 EventLoop 在处理 Channel 的读操作时进行分配 ByteBuf，对于这类 ByteBuf，需要我们自行进行释放，有三种方式，或者使用 

SimpleChannelInboundHandler，或者在重写 channelRead()方法使用 

```java
//SimpleChannelInboundHandler
public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
    boolean release = true;

    try {
        if (this.acceptInboundMessage(msg)) {
            this.channelRead0(ctx, msg);
        } else {
            release = false;
            ctx.fireChannelRead(msg);
        }
    } finally {
       // 释放资源
        if (this.autoRelease && release) {
            ReferenceCountUtil.release(msg);
        }

    }

}
```

ReferenceCountUtil.release()或者使用 ctx.fireChannelRead 继续向后传递； 

2、对于出站请求，不管 ByteBuf 是否由我们的业务创建的，当调用了 write 或者 writeAndFlush 方法后，Netty 会自动替我们释放，不需要我们业务代码自行释放。

```java
  public static void main(String[] args) {
        // 创建byteBuf对象，该对象内部包含一个字节数组byte[10]
        ByteBuf byteBuf = Unpooled.buffer(1);
        System.out.println("byteBuf=" + byteBuf);

        for (int i = 0; i < 8; i++) {
            byteBuf.writeByte(i);
        }
        System.out.println("byteBuf=" + byteBuf);

        for (int i = 0; i < 5; i++) {
            System.out.println(byteBuf.getByte(i));
        }
        System.out.println("byteBuf=" + byteBuf);

        for (int i = 0; i < 5; i++) {
            System.out.println(byteBuf.readByte());
        }
        System.out.println("byteBuf=" + byteBuf);


        //用Unpooled工具类创建ByteBuf
        ByteBuf byteBuf2 = Unpooled.copiedBuffer("hello,world!", CharsetUtil.UTF_8);
        //使用相关的方法
        if (byteBuf2.hasArray()) {
            byte[] content = byteBuf2.array();
            //将 content 转成字符串
            System.out.println(new String(content, CharsetUtil.UTF_8));
            System.out.println("byteBuf2=" + byteBuf2);

            System.out.println(byteBuf2.getByte(0)); // 获取数组0这个位置的字符h的ascii码，h=104

            int len = byteBuf2.readableBytes(); //可读的字节数  12
            System.out.println("len=" + len);

            //使用for取出各个字节
            for (int i = 0; i < len; i++) {
                System.out.println((char) byteBuf2.getByte(i));
            }

            //范围读取
            System.out.println(byteBuf2.getCharSequence(0, 6, CharsetUtil.UTF_8));
            System.out.println(byteBuf2.getCharSequence(6, 6, CharsetUtil.UTF_8));
        }
    }
```

> byteBuf=UnpooledByteBufAllocator$InstrumentedUnpooledUnsafeHeapByteBuf(ridx: 0, widx: 0, cap: 1)
> byteBuf=UnpooledByteBufAllocator$InstrumentedUnpooledUnsafeHeapByteBuf(ridx: 0, widx: 8, cap: 64)
> 0
> 1
> 2
> 3
> 4
> byteBuf=UnpooledByteBufAllocator$InstrumentedUnpooledUnsafeHeapByteBuf(ridx: 0, widx: 8, cap: 64)
> 0
> 1
> 2
> 3
> 4
> byteBuf=UnpooledByteBufAllocator$InstrumentedUnpooledUnsafeHeapByteBuf(ridx: 5, widx: 8, cap: 64)
> hello,world!                        
> byteBuf2=UnpooledByteBufAllocator$InstrumentedUnpooledUnsafeHeapByteBuf(ridx: 0, widx: 12, cap: 36)
> 104
> len=12
> h
> e
> l
> l
> o
> ,
> w
> o
> r
> l
> d
> !
> hello,
> world!

从结果可以看出get时候readerindex不会移动，read时候readerindex会移动