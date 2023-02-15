---
title: 网络编程IO模式
author: 程序员子龙
index: true
icon: discover
category:
- 网络编程
---
### BIO模型(**Blocking IO**)

同步阻塞模型，一个客户端连接对应一个处理线程。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a9e704af49b4380bb686f0c96d33b81~tplv-k3u1fbpfcp-watermark.image)

采用 BIO 通信模型的服务端，通常由一个独立的 Acceptor 线程负责监听客户端的连接，它接收到客户端连接请求之后为每个客户端创建一个新的线程进行链路处理，处理完成后，通过输出流返回应答给客户端，线程销毁。即典型的一请求一应答模型，同时数据的读取写入也必须阻塞在一个线程内等待其完成。

![](https://note.youdao.com/yws/public/resource/916f44987d1fe0e35ec935bf5391d762/xmlnote/DB0F9CCA5E414938B198B80FE6AE8B05/106378)

**缺点**

1、IO代码里read操作是阻塞操作，如果连接不做数据读写操作会导致线程阻塞，浪费资源。

2、缺乏弹性伸缩能力，当客户端并发访问量增加后，服务端的线程个数和客户端并发访问数呈 1:1 的正比关系，Java 中的线程也是比较宝贵的系统资源，线程 数量快速膨胀后，系统的性能将急剧下降，随着访问量的继续增大，系统最终就死掉了。

**应用场景**

BIO 方式适用于连接数目比较小且固定的架构。

代码示例：

```java
public class SocketServer {
    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(9000);
        while (true) {
            System.out.println("等待连接。。");
            //阻塞方法
            Socket clientSocket = serverSocket.accept();
            System.out.println("有客户端连接了。。");
            new Thread(() -> {
                try {
                    handler(clientSocket);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }

    private static void handler(Socket clientSocket) throws IOException {
        byte[] bytes = new byte[1024];
        System.out.println("准备read。。");
        //接收客户端的数据，阻塞方法，没有数据可读时就阻塞
        int read = clientSocket.getInputStream().read(bytes);
        System.out.println("read完毕。。");
        if (read != -1) {
            System.out.println("接收到客户端的数据：" + new String(bytes, 0, read));
        }
        clientSocket.getOutputStream().write("HelloClient".getBytes());
        clientSocket.getOutputStream().flush();
    }
}


public class SocketClient {

    public static void main(String[] args) throws IOException, InterruptedException {
        Socket socket = new Socket("127.0.0.1", 9000);
        //向服务端发送数据
        socket.getOutputStream().write("HelloServer".getBytes());
        socket.getOutputStream().flush();
        System.out.println("向服务端发送数据结束");
        byte[] bytes = new byte[1024];
        //接收服务端回传的数据
        socket.getInputStream().read(bytes);
        System.out.println("接收到服务端的数据：" + new String(bytes));
        socket.close();
    }
}
```

### **NIO(Non Blocking IO)**

同步非阻塞，服务器实现模式为**一个线程可以处理多个请求(连接)**，客户端发送的连接请求都会注册到**多路复用器selector**上，多路复用器轮询到连接有IO请求就进行处理，JDK1.4开始引入。

**NIO和** **BIO** **的主要区别** 

**面向流与面向缓冲** 

Java NIO 和 IO 之间第一个最大的区别是，IO 是面向流的，NIO 是面向缓冲区的。 Java IO 面向流意味着每次从流中读一个或多个字节，直至读取所有字节，它们没有被缓存在任何地方。此外，它不能前后移动流中的数据。如果需要前后移动从流中读取的数据，需要先将它缓存到一个缓冲区。 Java NIO 的缓冲导向方法略有不同。数据读取到一个它稍后处理的缓冲区，需要时可在缓冲区中前后移动。这就增加了处理过程中的灵活性。但是，还需要检查 是否该缓冲区中包含所有需要处理的数据。而且，需确保当更多的数据读入缓冲区时，不要覆盖缓冲区里尚未处理的数据。 

**阻塞与非阻塞 IO** 

Java IO 的各种流是阻塞的。这意味着，当一个线程调用 read() 或 write()时，该线程被阻塞，直到有一些数据被读取，或数据完全写入。该线程在此期间不能再干任何事情了。 

同步非阻塞 IO 模型中，应用程序会一直发起 read 调用，等待数据从内核空间拷贝到用户空间的这段时间里，线程依然是阻塞的，直到在内核把数据拷贝到用户空间。

Java NIO 的非阻塞模式，使一个线程从某通道发送请求读取数据，但是它仅能得到目前可用的数据，如果目前没有数据可用时，就什么都不会获取。而不是保持线程阻塞，所以直至数据变的可以读取之前，该线程可以继续做其他的事情。 非阻塞写也是如此。一个线程请求写入一些数据到某通道，但不需要等待它完全写入，这个线程同时可以去做别的事情。 

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb174e22dbe04bb79fe3fc126aed0c61~tplv-k3u1fbpfcp-watermark.image)

线程通常将非阻塞 IO 的空闲时间用于在其它通道上执行 IO 操作，所以一个单独的线程现在可以管理多个输入和输出通道（channel）。 

**I/O 多路复用模型**

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88ff862764024c3b8567367df11df6ab~tplv-k3u1fbpfcp-watermark.image)

![](https://img-blog.csdnimg.cn/img_convert/540a1a41210ef9c69ac69209d14d3832.png)

IO 多路复用模型中，线程首先发起 select 调用，询问内核数据是否准备就绪，等内核把数据准备好了，用户线程再发起 read 调用。read 调用的过程（数据从内核空间 -> 用户空间）还是阻塞的。

目前支持 IO 多路复用的系统调用，有 select，epoll 等等。select 系统调用，目前几乎在所有的操作系统上都有支持。

- **select 调用** ：内核提供的系统调用，它支持一次查询多个系统调用的可用状态。几乎所有的操作系统都支持。selector每次都会轮询所有的sockchannel看下哪个channel有读写事件，有的话就处理，没有就继续遍历。
- **epoll 调用** ：linux 2.6 内核，属于 select 调用的增强版本，优化了 IO 的执行效率。

**Epoll函数详解**

```
 int epoll_create(int size);              
```

创建一个epoll实例，并返回一个非负数作为文件描述符，用于对epoll接口的所有后续调用。参数size代表可能会容纳size个描述符，但size不是一个最大值，只是提示操作系统它的数量级，现在这个参数基本上已经弃用了。

```
 int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event);          
```

使用文件描述符epfd引用的epoll实例，对目标文件描述符fd执行op操作。

参数epfd表示epoll对应的文件描述符，参数fd表示socket对应的文件描述符。

参数op有以下几个值：

EPOLL_CTL_ADD：注册新的fd到epfd中，并关联事件event；

EPOLL_CTL_MOD：修改已经注册的fd的监听事件；

EPOLL_CTL_DEL：从epfd中移除fd，并且忽略掉绑定的event，这时event可以为null；

参数event是一个结构体

```
struct epoll_event {
	    __uint32_t   events;      /* Epoll events */
	    epoll_data_t data;        /* User data variable */
	};
	
	typedef union epoll_data {
	    void        *ptr;
	    int          fd;
	    __uint32_t   u32;
	    __uint64_t   u64;
	} epoll_data_t;
```

events有很多可选值，这里只举例最常见的几个：

EPOLLIN ：表示对应的文件描述符是可读的；

EPOLLOUT：表示对应的文件描述符是可写的；

EPOLLERR：表示对应的文件描述符发生了错误；

成功则返回0，失败返回-1

```
  int epoll_wait(int epfd, struct epoll_event *events, int maxevents, int timeout);
```

等待文件描述符epfd上的事件。

epfd是Epoll对应的文件描述符，events表示调用者所有可用事件的集合，maxevents表示最多等到多少个事件就返回，timeout是超时时间。

I/O多路复用底层主要用的Linux 内核·函数（select，poll，epoll）来实现，windows不支持epoll实现，windows底层是基于winsock2的select函数实现的(不开源)

|              | **select**                               | **poll**                                 | **epoll(jdk 1.5及以上)**                                     |
| ------------ | ---------------------------------------- | ---------------------------------------- | ------------------------------------------------------------ |
| **操作方式** | 遍历                                     | 遍历                                     | 回调                                                         |
| **底层实现** | 数组                                     | 链表                                     | 哈希表                                                       |
| **IO效率**   | 每次调用都进行线性遍历，时间复杂度为O(n) | 每次调用都进行线性遍历，时间复杂度为O(n) | 事件通知方式，每当有IO事件就绪，系统注册的回调函数就会被调用，时间复杂度O(1) |
| **最大连接** | 有上限                                   | 无上限                                   | 无上限                                                       |

**IO 多路复用模型，通过减少无效的系统调用，减少了对 CPU 资源的消耗。**

Java 中的 NIO ，有一个非常重要的**选择器 ( Selector )** 的概念，也可以被称为 **多路复用器**。通过它，只需要一个线程便可以管理多个客户端连接。当客户端数据到了之后，才会为其服务。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f483f2437ce4ecdb180134270a00144~tplv-k3u1fbpfcp-watermark.image)



#### **NIO** **三大核心组件**

NIO 有三大核心组件：Selector 选择器、Channel 管道、buffer 缓冲区。

**Selector** 

Selector 的英文含义是“选择器”，也可以称为为“轮询代理器”、“事件订阅器”、“channel 容器管理机”都行。 

Java NIO 的选择器允许一个单独的线程来监视多个输入通道，你可以注册多个通道使用 一个选择器(Selectors)，然后使用一个单独的线程来操作这个选择器，进而“选择”通道：这些通道里已经有可以处理的输入，或者选择已准备写入的通道。这种选择机制，使得一个单独的线程很容易来管理多个通道。 

应用程序将向 Selector 对象注册需要它关注的 Channel，以及具体的某一个 Channel 会对哪些 IO 事件感兴趣。Selector 中也会维护一个“已经注册的 Channel”的容器。 

**什么是** **SelectionKey**

SelectionKey是一个抽象类,表示selectableChannel在Selector中注册的标识.每个Channel 向 Selector 注册时,都将会创建一个 SelectionKey。SelectionKey 将 Channel 与 Selector 建立了关系,并维护了 channel 事件。

可以通过 cancel 方法取消键,取消的键不会立即从 selector 中移除,而是添加到 cancelledKeys 中,在下一次 select 操作时移除它.所以在调用某个 key 时,需要使用 isValid 进行校验. 

**SelectionKey** **类型和就绪条件** 

在向 Selector 对象注册感兴趣的事件时，JAVA NIO 共定义了四种：OP_READ、OP_WRITE、 OP_CONNECT、OP_ACCEPT（定义在 SelectionKey 中），分别对应读、写、请求连接、接受连接等网络 Socket 操作。 

**操作类型 就绪条件及说明** 

OP_READ 当操作系统读缓冲区有数据可读时就绪。并非时刻都有数据可读，所以一般需要注册该操作，仅当有就绪时才发起读操作，有的放矢，避免浪费 CPU。 

OP_WRITE 当操作系统写缓冲区有空闲空间时就绪。一般情况下写缓冲区都有空闲空间，小块数据直接写入即可，没必要注册该操作类型，否则该条件不断就绪浪费 CPU；但如果是写密集型的任务，比如文件下载等，缓冲区很可能满，注册该操作类型就很有必要，同时注意写完后取消注册。 

OP_CONNECT 当 SocketChannel.connect()请求连接成功后就绪。该操作只给客户端使用。 

OP_ACCEPT 当接收到一个客户端连接请求时就绪。该操作只给服务器使用。 

**服务端和客户端分别感兴趣的类型** 

ServerSocketChannel 和 SocketChannel 可以注册自己感兴趣的操作类型，当对应操作类型的就绪条件满足时 OS 会通知 channel，下表描述各种 Channel 允许注册的操作类型，Y 表示允许注册，N 表示不允许注册，其中服务器 SocketChannel 指由服务器 ServerSocketChannel.accept()返回的对象。 

![](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220629113819066.png)

服务器启动 ServerSocketChannel，关注 OP_ACCEPT 事件。

客户端启动 SocketChannel，连接服务器，关注 OP_CONNECT 事件服务器接受连接，启动一个服务器的 SocketChannel，这个 SocketChannel 可以关注 OP_READ、OP_WRITE 事件，一般连接建立后会直接关注 OP_READ 事件 

客户端这边的客户端 SocketChannel 发现连接建立后，可以关注 OP_READ、OP_WRITE 事件，一般是需要客户端需要发送数据了才关注 OP_READ 事件 

连接建立后客户端与服务器端开始相互发送消息（读写），根据实际情况来关注OP_READ、 OP_WRITE 事件。 

**Channels** 

通道，被建立的一个应用程序和操作系统交互事件、传递内容的渠道（注意是连接到操作系统）。那么既然是和操作系统进行内容的传递，那么说明应用程序可以通过通道读取数据，也可以通过通道向操作系统写数据，而且可以同时进行读写。 

- 所有被 Selector（选择器）注册的通道，只能是继承了 SelectableChannel 类的子类
- ServerSocketChannel：应用服务器程序的监听通道。只有通过这个通道，应用程序才能向操作系统注册支持“多路复用 IO”的端口监听。同时支持 UDP 协议和 TCP 协议。 
- ScoketChannel：TCP Socket 套接字的监听通道，一个 Socket 套接字对应了一个客户端 IP：端口 到 服务器 IP：端口的通信连接。 

通道中的数据总是要先读到一个 Buffer，或者总是要从一个 Buffer 中写入。 

**buffer** **缓冲区** 

![](https://img-blog.csdnimg.cn/0348dc9fb3c54335b7e12455893c1d53.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)



NIO 的 Buffer 和 channel 都是既可以读也可以写。

![](https://note.youdao.com/yws/public/resource/916f44987d1fe0e35ec935bf5391d762/xmlnote/F69C7F7706E64740A629E8E1056F5DCE/106569)

Buffer 用于和 NIO 通道进行交互。数据是从通道读入缓冲区，从缓冲区写入到通道中的。 

以写为例，应用程序都是将数据写入缓冲，再通过通道把缓冲的数据发送出去，读也是一样， 数据总是先从通道读到缓冲，应用程序再读缓冲的数据。 

缓冲区本质上是一块可以写入数据，然后可以从中读取数据的内存（ 其实就是数组）。 这块内存被包装成 NIO Buffer 对象，并提供了一组方法，用来方便的访问该块内存。

**Buffer** **的重要属性** 

capacity 

作为一个内存块，Buffer 有一个固定的大小值，也叫“capacity”.你只能往里写 capacity 个 byte、long，char 等类型。一旦 Buffer 满了，需要将其清空（通过读数据或者清除数据）才能继续写数据往里写数据。 

position 

当你写数据到 Buffer 中时，position 表示当前能写的位置。初始的 position 值为 0.当一个 byte、long 等数据写到 Buffer 后， position 会向前移动到下一个可插入数据的 Buffer 单元。position 最大可为 capacity – 1. 

当读取数据时，也是从某个特定位置读。当将 Buffer 从写模式切换到读模式，position 会被重置为 0. 当从 Buffer 的 position 处读取数据时，position 向前移动到下一个可读的位置。 

limit

在写模式下，Buffer 的 limit 表示你最多能往 Buffer 里写多少数据。 写模式下，limit 等于 Buffer 的 capacity。 

当切换 Buffer 到读模式时， limit 表示你最多能读到多少数据。因此，当切换 Buffer 到读模式时，limit 会被设置成写模式下的 position 值。换句话说，你能读到之前写入的所有数据（limit 被设置成已写数据的数量，这个值在写模式下就是 position） 

**Buffer** **的分配** 

要想获得一个 Buffer 对象首先要进行分配。 每一个 Buffer 类都有 **allocate** 方法(可以在堆上分配，也可以在直接内存上分配)。 

分配 48 字节 capacity 的 ByteBuffer 的例子:ByteBuffer buf = ByteBuffer.allocate(48); 

分配一个可存储 1024 个字符的 CharBuffer：CharBuffer buf = CharBuffer.allocate(1024); 

**wrap** **方法**：把一个 byte 数组或 byte 数组的一部分包装成 ByteBuffer：

```
ByteBuffer wrap(byte [] array) 

ByteBuffer wrap(byte [] array, int offset, int length) 
```

**直接内存**

HeapByteBuffer 与 DirectByteBuffer，在原理上，前者可以看出分配的 buffer 是在 heap 区域的，其实真正 flush 到远程的时候会先拷贝到直接内存，再做下一步操作；在 NIO 的框架下，很多框架会采用 DirectByteBuffer 来操作，这样分配的内存不再是在 java heap 上，经过性能测试，可以得到非常快速的网络交互，在大量的网络交互下，一般速度会比 HeapByteBuffer 要快速好几倍。 

直接内存（Direct Memory）并不是虚拟机运行时数据区的一部分，也不是 Java 虚拟机规范中定义的内存区域，但是这部分内存也被频繁地使用，而且也可能导致 OutOfMemoryError 异常出现。 

NIO 可以使用 Native 函数库直接分配堆外内存，然后通过一个存储在 Java 堆里面的 DirectByteBuffer 对象作为这块内存的引用进行操作。这样能在一些场景中显著提高性能，因为避免了在 Java 堆和 Native 堆中来回复制数据。 

**直接内存（堆外内存）与堆内存比较** 

直接内存申请空间耗费更高的性能，当频繁申请到一定量时尤为明显 ,直接内存 IO 读写的性能要优于普通的堆内存，在多次读写操作的情况下差异明显。

**Buffer** **的读写** 

**写数据到** **Buffer** **有两种方式：** 

**读取** **Channel** **写到** **Buffer**。

**通过** **Buffer** **的** **put()**方法写到 **Buffer** **里。** 

从 Channel 写到 Buffer 的例子 

```
int** bytesRead = inChannel.read(buf); //read into buffer. 
```

通过 put 方法写 Buffer 的例子： 

```
buf.put(127); 
```

put 方法有很多版本，允许你以不同的方式把数据写入到 Buffer 中。例如， 写到一个 指定的位置，或者把一个字节数组写入到 Buffer。比如： 

put(byte b) 相对写，向 position 的位置写入一个 byte，并将 postion+1，为下次读写作准备。 

flip()方法 

flip 方法将 Buffer 从写模式切换到读模式。调用 flip()方法会将 position 设回 0，并将 limit 设置成之前 position 的值。 

换句话说，position 现在用于标记读的位置，limit 表示之前写进了多少个 byte、char 等 ， 现在能读取多少个 byte、char 等。从 Buffer 中读取数据 

**从** **Buffer** **中读取数据有两种方式：** 

**1.** **从** **Buffer** **读取数据写入到** **Channel**。

**2. 使用 get()方法从 Buffer 中读取数据。** 

从 Buffer 读取数据到 Channel 的例子： 

```
int bytesWritten = inChannel.write(buf); 

```

使用 get()方法从 Buffer 中读取数据的例子 

```
byte aByte = buf.get(); 
```

get 方法有很多版本，允许你以不同的方式从 Buffer 中读取数据。例如，从指定 position 读取，或者从 Buffer 中读取数据到字节数组，再比如 get()属于相对读，从 position 位置读取一个 byte，并将 position+1，为下次读写作准备; 

使用 Buffer 读写数据常见步骤 

1. 写入数据到 Buffer 

2. 调用 flip()方法 

3. 从 Buffer 中读取数据 

4. 调用 clear()方法或者 compact()方法，准备下一次的写入 

当向 buffer 写入数据时，buffer 会记录下写了多少数据。一旦要读取数据，需要通过 flip() 方法将 Buffer 从写模式切换到读模式。在读模式下，可以读取之前写入到 buffer 的所有数据。 

一旦读完了所有的数据，就需要清空缓冲区，让它可以再次被写入。有两种方式能清空 缓冲区：调用 clear()或 compact()方法。clear()方法会清空整个缓冲区。compact()方法只会清 除已经读过的数据。 

**绝对读写** 

put(int index, byte b) 绝对写，向 byteBuffer 底层的 bytes 中下标为 index 的位置插入 byte b，不改变 position 的值。 

get(int index)属于绝对读，读取 byteBuffer 底层的 bytes 中下标为 index 的 byte，不改变 position。 

**rewind()方法** 

Buffer.rewind()将 position 设回 0，所以你可以重读 Buffer 中的所有数据。limit 保持不变， 仍然表示能从 Buffer 中读取多少个元素（byte、char 等）。 

**clear()与 compact()方法**

一旦读完Buffer中的数据，需要让Buffer准备好再次被写入。可以通过clear()或compact() 方法来完成。 

如果调用的是 clear()方法，position 将被设回 0，limit 被设置成 capacity 的值。换句话说，Buffer 被清空了。Buffer 中的数据并未清除，只是这些标记告诉我们可以从哪里开始往 Buffer 里写数据。 

如果 Buffer 中有一些未读的数据，调用 clear()方法，数据将“被遗忘”，意味着不再有任何标记会告诉你哪些数据被读过，哪些还没有。如果 Buffer 中仍有未读的数据，且后续还需要这些数据，但是此时想要先先写些数据， 那么使用 compact()方法。 

compact()方法将所有未读的数据拷贝到 Buffer 起始处。然后将 position 设到最后一个未读元素正后面。limit 属性依然像 clear()方法一样，设置成 capacity。现在 Buffer 准备好写数据了，但是不会覆盖未读的数据。 

**mark()与 reset()方法**

通过调用 Buffer.mark()方法，可以标记 Buffer 中的一个特定 position。之后可以通过调用 Buffer.reset()方法恢复到这个 position。例如： 

```
buffer.mark();//call buffer.get() a couple of times, e.g. during parsing. 

buffer.reset(); //set position back to mark
```

**equals()与compareTo()方法** 

可以使用 equals()和 compareTo()方法两个 Buffer。 

**equals()** 

当满足下列条件时，表示两个 Buffer 相等： 

1. 有相同的类型（byte、char、int 等）。 

2. Buffer 中剩余的 byte、char 等的个数相等。 

3. Buffer 中所有剩余的 byte、char 等都相同。 

如你所见，equals 只是比较 Buffer 的一部分，不是每一个在它里面的元素都比较。实际上，它只比较 Buffer 中的剩余元素。 

**compareTo()方法** 

compareTo()方法比较两个 Buffer 的剩余元素(byte、char 等)， 如果满足下列条件，则认为一个 Buffer“小于”另一个 Buffer： 

1. 第一个不相等的元素小于另一个 Buffer 中对应的元素 。 

2. 所有元素都相等，但第一个 Buffer 比另一个先耗尽(第一个 Buffer 的元素个数比另一个少)。

#### NIO非阻塞代码示例

服务端：

```java
public class NioServer {

    // 保存客户端连接
    static List<SocketChannel> channelList = new ArrayList<>();

    public static void main(String[] args) throws IOException, InterruptedException {

        // 创建NIO ServerSocketChannel,与BIO的serverSocket类似
        ServerSocketChannel serverSocket = ServerSocketChannel.open();
        serverSocket.socket().bind(new InetSocketAddress(9000));
        // 设置ServerSocketChannel为非阻塞
        serverSocket.configureBlocking(false);
        System.out.println("服务启动成功");

        while (true) {
            // 非阻塞模式accept方法不会阻塞，否则会阻塞
            // NIO的非阻塞是由操作系统内部实现的，底层调用了linux内核的accept函数
            SocketChannel socketChannel = serverSocket.accept();
            if (socketChannel != null) { // 如果有客户端进行连接
                System.out.println("连接成功");
                // 设置SocketChannel为非阻塞
                socketChannel.configureBlocking(false);
                // 保存客户端连接在List中
                channelList.add(socketChannel);
            }
            // 遍历连接进行数据读取
            Iterator<SocketChannel> iterator = channelList.iterator();
            while (iterator.hasNext()) {
                SocketChannel sc = iterator.next();
                ByteBuffer byteBuffer = ByteBuffer.allocate(128);
                // 非阻塞模式read方法不会阻塞，否则会阻塞
                int len = sc.read(byteBuffer);
                // 如果有数据，把数据打印出来
                if (len > 0) {
                    System.out.println("接收到消息：" + new String(byteBuffer.array()));
                } else if (len == -1) { // 如果客户端断开，把socket从集合中去掉
                    iterator.remove();
                    System.out.println("客户端断开连接");
                }
            }
        }
    }
}
```

客户端：

```java
public class NioClient {
    //通道管理器
    private Selector selector;

    /**
     * 启动客户端测试
     *
     * @throws IOException
     */
    public static void main(String[] args) throws IOException {
        NioClient client = new NioClient();
        client.initClient("127.0.0.1", 9000);
        client.connect();
    }

    /**
     * 获得一个Socket通道，并对该通道做一些初始化的工作
     *
     * @param ip   连接的服务器的ip
     * @param port 连接的服务器的端口号
     * @throws IOException
     */
    public void initClient(String ip, int port) throws IOException {
        // 获得一个Socket通道
        SocketChannel channel = SocketChannel.open();
        // 设置通道为非阻塞
        channel.configureBlocking(false);
        // 获得一个通道管理器
        this.selector = Selector.open();

        // 客户端连接服务器,需要在listen（）方法中调用channel.finishConnect() 才能完成连接
        channel.connect(new InetSocketAddress(ip, port));
        //将通道管理器和该通道绑定，并为该通道注册SelectionKey.OP_CONNECT事件。
        channel.register(selector, SelectionKey.OP_CONNECT);
    }

    /**
     * 采用轮询的方式监听selector上是否有需要处理的事件，如果有，则进行处理
     *
     * @throws IOException
     */
    public void connect() throws IOException {
        // 轮询访问selector
        while (true) {
            selector.select();
            // 获得selector中选中的项的迭代器
            Iterator<SelectionKey> it = this.selector.selectedKeys().iterator();
            while (it.hasNext()) {
                SelectionKey key = (SelectionKey) it.next();
                // 删除已选的key,以防重复处理
                it.remove();
                // 连接事件发生
                if (key.isConnectable()) {
                    SocketChannel channel = (SocketChannel) key.channel();
                    // 如果正在连接，则完成连接
                    if (channel.isConnectionPending()) {
                        channel.finishConnect();
                    }
                    // 设置成非阻塞
                    channel.configureBlocking(false);
                    //在这里可以给服务端发送信息哦
                    ByteBuffer buffer = ByteBuffer.wrap("HelloServer".getBytes());
                    channel.write(buffer);
                    //在和服务端连接成功之后，为了可以接收到服务端的信息，需要给通道设置读的权限。
                    channel.register(this.selector, SelectionKey.OP_READ);                                            // 获得了可读的事件
                } else if (key.isReadable()) {
                    read(key);
                }
            }
        }
    }

    /**
     * 处理读取服务端发来的信息 的事件
     *
     * @param key
     * @throws IOException
     */
    public void read(SelectionKey key) throws IOException {
        //和服务端的read方法一样
        // 服务器可读取消息:得到事件发生的Socket通道
        SocketChannel channel = (SocketChannel) key.channel();
        // 创建读取的缓冲区
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        int len = channel.read(buffer);
        if (len != -1) {
            System.out.println("客户端收到信息：" + new String(buffer.array(), 0, len));
        }
    }
}
```

#### **NIO引入多路复用器代码**

```java
public class NioSelectorServer {

    public static void main(String[] args) throws IOException, InterruptedException {

        // 创建NIO ServerSocketChannel
        ServerSocketChannel serverSocket = ServerSocketChannel.open();
        serverSocket.socket().bind(new InetSocketAddress(9000));
        // 设置ServerSocketChannel为非阻塞
        serverSocket.configureBlocking(false);
        // 打开Selector处理Channel，即创建epoll
        Selector selector = Selector.open();
        // 把ServerSocketChannel注册到selector上，并且selector对客户端accept连接操作感兴趣
        serverSocket.register(selector, SelectionKey.OP_ACCEPT);
        System.out.println("服务启动成功");

        while (true) {
            // 阻塞等待需要处理的事件发生
            selector.select();

            // 获取selector中注册的全部事件的 SelectionKey 实例
            Set<SelectionKey> selectionKeys = selector.selectedKeys();
            Iterator<SelectionKey> iterator = selectionKeys.iterator();

            // 遍历SelectionKey对事件进行处理
            while (iterator.hasNext()) {
                SelectionKey key = iterator.next();
                // 如果是OP_ACCEPT事件，则进行连接获取和事件注册
                if (key.isAcceptable()) {
                    ServerSocketChannel server = (ServerSocketChannel) key.channel();
                    SocketChannel socketChannel = server.accept();
                    socketChannel.configureBlocking(false);
                    // 这里只注册了读事件，如果需要给客户端发送数据可以注册写事件
                    socketChannel.register(selector, SelectionKey.OP_READ);
                    System.out.println("客户端连接成功");
                } else if (key.isReadable()) {  // 如果是OP_READ事件，则进行读取和打印
                    SocketChannel socketChannel = (SocketChannel) key.channel();
                    ByteBuffer byteBuffer = ByteBuffer.allocate(128);
                    int len = socketChannel.read(byteBuffer);
                    // 如果有数据，把数据打印出来
                    if (len > 0) {
                        System.out.println("接收到消息：" + new String(byteBuffer.array()));
                    } else if (len == -1) { // 如果客户端断开连接，关闭Socket
                        System.out.println("客户端断开连接");
                        socketChannel.close();
                    }
                }
                //从事件集合里删除本次处理的key，防止下次select重复处理
                iterator.remove();
            }
        }
    }
}
```

### AIO (Asynchronous I/O)

AIO 也就是 NIO 2。Java 7 中引入了 NIO 的改进版 NIO 2,它是异步 IO 模型。

异步 IO 是基于事件和回调机制实现的，也就是应用操作之后会直接返回，不会堵塞在那里，当后台处理完成，操作系统会通知相应的线程进行后续的操作。

**异步非阻塞， 由操作系统完成后回调通知服务端程序启动线程去处理， 一般适用于连接数较多且连接时间较长的应用.**

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3077e72a1af049559e81d18205b56fd7~tplv-k3u1fbpfcp-watermark.image)

AIO代码示例：

服务端：

```java
public class AIOServer {

    public static void main(String[] args) throws Exception {
        final AsynchronousServerSocketChannel serverChannel =
                AsynchronousServerSocketChannel.open().bind(new InetSocketAddress(9000));

        serverChannel.accept(null, new CompletionHandler<AsynchronousSocketChannel, Object>() {
            @Override
            public void completed(AsynchronousSocketChannel socketChannel, Object attachment) {
                try {
                    System.out.println("2--"+Thread.currentThread().getName());
                    // 再此接收客户端连接，如果不写这行代码后面的客户端连接连不上服务端
                    serverChannel.accept(attachment, this);
                    System.out.println(socketChannel.getRemoteAddress());
                    ByteBuffer buffer = ByteBuffer.allocate(1024);
                    socketChannel.read(buffer, buffer, new CompletionHandler<Integer, ByteBuffer>() {
                        @Override
                        public void completed(Integer result, ByteBuffer buffer) {
                            System.out.println("3--"+Thread.currentThread().getName());
                            buffer.flip();
                            System.out.println(new String(buffer.array(), 0, result));
                            socketChannel.write(ByteBuffer.wrap("HelloClient".getBytes()));
                        }

                        @Override
                        public void failed(Throwable exc, ByteBuffer buffer) {
                            exc.printStackTrace();
                        }
                    });
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void failed(Throwable exc, Object attachment) {
                exc.printStackTrace();
            }
        });

        System.out.println("1--"+Thread.currentThread().getName());
        Thread.sleep(Integer.MAX_VALUE);
    }
}
```

客户端：

```java
public class AIOClient {

    public static void main(String... args) throws Exception {
        AsynchronousSocketChannel socketChannel = AsynchronousSocketChannel.open();
        socketChannel.connect(new InetSocketAddress("127.0.0.1", 9000)).get();
        socketChannel.write(ByteBuffer.wrap("HelloServer".getBytes()));
        ByteBuffer buffer = ByteBuffer.allocate(512);
        Integer len = socketChannel.read(buffer).get();
        if (len != -1) {
            System.out.println("客户端收到信息：" + new String(buffer.array(), 0, len));
        }
    }
}
```

**BIO、 NIO、 AIO 对比：**

![](https://note.youdao.com/yws/public/resource/916f44987d1fe0e35ec935bf5391d762/xmlnote/17DCC73717114E569D317F28E1D27261/84315)

![](https://images.xiaozhuanlan.com/photo/2020/33b193457c928ae02217480f994814b6.png)