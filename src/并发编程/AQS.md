---
title: 什么是AQS
author: 程序员子龙
index: true
icon: discover
category:
- 并发编程
---
## AQS 简单介绍

AQS 的全称为 `AbstractQueuedSynchronizer` ，翻译过来的意思就是抽象队列同步器。这个类在 `java.util.concurrent.locks` 包下面。

![](http://img.xxfxpt.top/202202251046436.png)

AQS 就是一个抽象类，主要用来构建锁和同步器。

```java
public abstract class AbstractQueuedSynchronizer
    extends AbstractOwnableSynchronizer
    implements java.io.Serializable {
}
```

AQS 为构建锁和同步器提供了一些通用功能的是实现，因此，使用 AQS 能简单且高效地构造出应用广泛的大量的同步器，比如我们提到的 `ReentrantLock`，`Semaphore`，其他的诸如 `ReentrantReadWriteLock`，`SynchronousQueue`等等都是基于 AQS 的。

## AQS 原理

AQS 核心思想是，如果被请求的共享资源空闲，则将当前请求资源的线程设置为有效的工作线程，并且将共享资源设置为锁定状态。如果被请求的共享资源被占用，那么就需要一套线程阻塞等待以及被唤醒时锁分配的机制，这个机制 AQS 是用 **CLH 队列锁**实现的，即将暂时获取不到锁的线程加入到队列中。 

### **CLH** 

> CLH(Craig,Landin,and Hagersten)队列是一个虚拟的双向队列（虚拟的双向队列即不存在队列实例，仅存在结点之间的关联关系）。AQS 是将每条请求共享资源的线程封装成一个 CLH 锁队列的一个结点（Node）来实现锁的分配。

CLH 队列锁也是一种基于链表的可扩展、 高性能、 公平的自旋锁， 申请线程仅仅在本地变量上自旋， 它不断轮询前驱的状态， 假设发现前驱释放了锁就结束自旋。

![](https://pic2.zhimg.com/80/v2-487af6a3450399d13559d5ae84a41e79_720w.jpeg)

每个节点有myPred和locked两个域

当一个线程需要获取锁时：

1. 创建一个的QNode， 将其中的locked设置为true表示需要获取锁， myPred表示对其前驱结点的引用，每个节点都是加在队列的尾部
2. 线程就在前驱结点的 locked 字段上旋转， 直到前驱结点释放锁(前驱节点的锁值 locked == false),例如QNode_B一直自旋,当A释放锁了locked=false，B获得锁
3. 当一个线程需要释放锁时， 将当前结点的 locked 域设置为 false

总结如下：

- 基于线程当前节点的前置节点的锁值（locked）进行自旋，locked == true 自旋，locked == false 加锁成功。
- locked == true 表示节点处于加锁状态或者等待加锁状态。
- locked == false 表示节点处于解锁状态。
- 每个节点在解锁时更新自己的锁值（locked），在这一时刻，该节点的后置节点会结束自旋，并进行加锁。

**加锁逻辑**

获取当前线程的锁节点，如果为空则进行初始化。
通过同步方法获取尾节点，并将当前节点置为尾节点，此时获取到的尾节点为当前节点的前驱节点。
如果尾节点为空，则表示当前节点为第一个节点，加锁成功。
如果尾节点不为空，则基于前驱节点的锁值（locked==true）进行自旋，直到前驱节点的锁值 locked == false。

**解锁逻辑**

获取当前线程的锁节点，如果节点为空或者锁值（locked== false）则无需解锁，直接返回。
使用同步方法为尾节点赋空值，赋值不成功则表示当前节点不是尾节点，需要将当前节点的 locked == false 已保证解锁该节点。如果当前节点为尾节点，则无需设置该节点的锁值。因为该节点没有后置节点，即使设置了，也没有实际意义。

CLH 队列锁的优点是空间复杂度低（如果有 n 个线程， L 个锁， 每个线程每次只获取一个锁， 那么需要的存储空间是 O（L+n） ， n 个线程有 n 个 myNode，L 个锁有 L 个 tail）。

Java 中的 AQS 是 CLH 队列锁的一种变体实现。

### **AQS中的数据结构**

AQS源码：

```java
public abstract class AbstractQueuedSynchronizer
  extends AbstractOwnableSynchronizer
    implements java.io.Serializable {
    // 以下为双向链表的首尾结点，代表入口等待队列
    private transient volatile Node head;
    private transient volatile Node tail;
    // 共享变量 state
    private volatile int state;
    // cas 获取 / 释放 state，保证线程安全地获取锁
    protected final boolean compareAndSetState(int expect, int update) {
        // See below for intrinsics setup to support this
        return unsafe.compareAndSwapInt(this, stateOffset, expect, update);
    }
    // ...
 }
```

**AQS 定义两种资源共享方式**

1、EXCLUSIVE（独占）

表示线程以互斥的模式等待锁（如 ReetrantLock） ， 互斥就是一把锁只能由一个线程持有， 不能同时存在多个线程使用同一个锁。

2、SHARED（共享）

表示线程以共享的模式等待锁（如 ReadLock）。

`ReentrantReadWriteLock` 可以看成是组合式，因为 `ReentrantReadWriteLock` 也就是读写锁允许多个线程同时对某一资源进行读。

线程在队列中的状态枚举：

CANCELLED： 值为 1， 表示线程的获锁请求已经“取消”

SIGNAL： 值为-1， 表示该线程一切都准备好了,就等待锁空闲出来给我

CONDITION： 值为-2， 表示线程等待某一个条件（Condition） 被满足

PROPAGATE： 值为-3， 当线程处在“SHARED” 模式时， 该字段才会被使用上

初始化 Node 对象时， 默认为 0

成员变量：

waitStatus： 该 int 变量表示线程在队列中的状态， 其值就是上述提到的CANCELLED、 SIGNAL、 CONDITION、 PROPAGATE

prev： 该变量类型为 Node 对象， 表示该节点的前一个 Node 节点（前驱）

next： 该变量类型为 Node 对象， 表示该节点的后一个 Node 节点（后继）

thread： 该变量类型为 Thread 对象， 表示该节点的代表的线程

nextWaiter： 该变量类型为 Node 对象， 表示等待 condition 条件的 Node 节点

当前线程更新同步状态state失败时， 同步器会将当前线程以及等待状态等信息构造成为一个节点（Node） 并将其加入同步队列， 同时会阻塞当前线程， 当同步状态释放时， 会把首节点中的线程唤醒， 使其再次尝试获取同步状态。 同步队列中的节点（Node） 用来保存获取同步状态失败的线程引用、 等待状态以及前驱和后继节点。

**节点加入到同步队列**

当一个线程成功地获取了同步状态（或者锁），其他线程获取同步状态失败， AQS 会将这个线程以及等待状态等信息构造成为一个节点（Node） 并将其加入同步队列的尾部。 而这个加入队列的过程必须要保证线程安全， 因此同步器提供了一个基于 CAS 的设置尾节点的方法：compareAndSetTail(Node expect,Nodeupdate)， 它需要传递当前线程“认为” 的尾节点和当前节点， 只有设置成功后， 当前节点才正式与之前的尾节点建立关联。

```java
//构造节点
private Node addWaiter(Node mode) {
    Node node = new Node(Thread.currentThread(), mode);
    // Try the fast path of enq; backup to full enq on failure
    Node pred = tail;
    if (pred != null) {
        node.prev = pred;
        if (compareAndSetTail(pred, node)) {
            pred.next = node;
            return node;
        }
    }
    enq(node);
    return node;
}

    final boolean acquireQueued(final Node node, int arg) {
        boolean failed = true;
        try {
            boolean interrupted = false;
            //自旋获取锁的状态
            for (;;) {
                //获取前一个节点
                final Node p = node.predecessor();
                //前驱节点是头节点尝试获取同步状态
                if (p == head && tryAcquire(arg)) {
                    setHead(node);
                    p.next = null; // help GC
                    failed = false;
                    return interrupted;
                }
                if (shouldParkAfterFailedAcquire(p, node) &&
                    parkAndCheckInterrupt())
                    interrupted = true;
            }
        } finally {
            if (failed)
                cancelAcquire(node);
        }
    }
```

**锁的释放**

当前线程获取同步状态并执行了相应逻辑之后， 就需要释放同步状态， 使得后续节点能够继续获取同步状态。 通过调用同步器的 release(int arg)方法可以释放同步状态， 该方法在释放了同步状态之后， 会唤醒其后继节点（进而使后继节点重新尝试获取同步状态）。

```java
public final boolean release(int arg) {
    //释放锁后进入这个条件
    if (tryRelease(arg)) {
        //唤醒首节点（head） 所指向节点的后继节点线程
        Node h = head;
        if (h != null && h.waitStatus != 0)
            //使用 LockSupport 来唤醒处于等待状态的线程
            unparkSuccessor(h);
        return true;
    }
    return false;
}
     //设置state
     protected final boolean tryRelease(int releases) {
            int c = getState() - releases;
            if (Thread.currentThread() != getExclusiveOwnerThread())
                throw new IllegalMonitorStateException();
            boolean free = false;
            if (c == 0) {
                free = true;
                setExclusiveOwnerThread(null);
            }
            setState(c);
            return free;
        }
```

**AQS 实现锁的主要原理如下：**

![](http://img.xxfxpt.top/202202251521952.png)

以实现独占锁为例（即当前资源只能被一个线程占有），其实现原理如下：state 初始化 0，在多线程条件下，线程要执行临界区的代码，必须首先获取 state，某个线程获取成功之后， state 加 1，其他线程再获取的话由于共享资源已被占用，所以会到 FIFO 等待队列去等待，等占有 state 的线程执行完临界区的代码释放资源( state 减 1)后，会唤醒 FIFO 中的下一个等待线程（head 中的下一个结点）去获取 state。

state 由于是多线程共享变量，所以必须定义成 volatile，以保证 state 的可见性, 同时虽然 volatile 能保证可见性，但不能保证原子性，所以 AQS 提供了对 state 的原子操作方法，保证了线程安全。

```java
private volatile int state; //共享变量，使用volatile修饰保证线程可见性

//返回同步状态的当前值
protected final int getState() {
        return state;
}
 // 设置同步状态的值
protected final void setState(int newState) {
        state = newState;
}
//原子（CAS操作）将同步状态值设置为给定值update如果当前同步状态的值等于expect（期望值）
protected final boolean compareAndSetState(int expect, int update) {
        return unsafe.compareAndSwapInt(this, stateOffset, expect, update);
}
```

另外 AQS 中实现的 FIFO 队列（CLH 队列）其实是双向链表实现的，由 head, tail 节点表示，head 结点代表当前占用的线程，其他节点由于暂时获取不到锁所以依次排队等待锁释放。

## ReentrantLock 源码分析

ReentrantLock 是我们比较常用的一种锁，也是基于 AQS 实现的，所以接下来我们就来分析一下 ReentrantLock 锁的实现来一探 AQS 究竟。本文将会采用图文并茂的方式让大家理解 AQS 的实现原理。

![](http://img.xxfxpt.top/202202261718535.png)

首先我们要知道 ReentrantLock 是独占锁，也有公平和非公平两种锁模式，什么是公平锁与非公平锁?

- **公平锁** ：按照线程在队列中的排队顺序，先到者先拿到锁
- **非公平锁** ：当线程要获取锁时，先通过CAS 操作去抢锁，如果没抢到，当前线程再加入到队列中等待唤醒。

`ReentrantLock` 默认采用非公平锁，因为考虑获得更好的性能，通过 `boolean` 来决定是否用公平锁（传入 true 用公平锁）。

```java
/** Synchronizer providing all implementation mechanics */
private final Sync sync;
public ReentrantLock() {
    // 默认非公平锁
    sync = new NonfairSync();
}
public ReentrantLock(boolean fair) {
    sync = fair ? new FairSync() : new NonfairSync();
}

```

非公平锁的 `lock` 方法：

```java
static final class NonfairSync extends Sync {
    final void lock() {
        // 2. 和公平锁相比，这里会直接先进行一次CAS，成功就返回了
        if (compareAndSetState(0, 1))
            setExclusiveOwnerThread(Thread.currentThread());
        else
            acquire(1);
    }
    // AbstractQueuedSynchronizer.acquire(int arg)
    // 尝试着获取 state，如果成功，则跳过后面的步骤。如果失败，则执行 acquireQueued 将线程加入 CLH 等待队列中。
    public final void acquire(int arg) {
        // tryAcquire 这个方法是 AQS 提供的一个模板方法，最终由其 AQS 具体的实现类（Sync）实现
        if (!tryAcquire(arg) &&
            acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
            selfInterrupt();
    }
    
    protected final boolean tryAcquire(int acquires) {
        return nonfairTryAcquire(acquires);
    }
}
/**
 * Performs non-fair tryLock.  tryAcquire is implemented in
 * subclasses, but both need nonfair try for trylock method.
 */
final boolean nonfairTryAcquire(int acquires) {
    final Thread current = Thread.currentThread();
    int c = getState();
    if (c == 0) {
        // 这里没有对阻塞队列进行判断,如果 c 等于0，表示此时资源是空闲的（即锁是释放的），再用 CAS 获取锁
        if (compareAndSetState(0, acquires)) {
            setExclusiveOwnerThread(current);
            return true;
        }
    }
    // 此条件表示之前已有线程获得锁，且此线程再一次获得了锁，获取资源次数再加 1，这也映证了 ReentrantLock 为可重入锁
    else if (current == getExclusiveOwnerThread()) {
        int nextc = c + acquires;
        if (nextc < 0) // overflow
            throw new Error("Maximum lock count exceeded");
        setState(nextc);
        return true;
    }
    return false;
}

```

可以看到 lock 方法主要有两步

1. 使用 CAS 来获取 state 资源，如果成功设置 1，代表 state 资源获取锁成功，此时记录下当前占用 state 的线程 **setExclusiveOwnerThread(Thread.currentThread());**
2. 如果 CAS 设置 state 为 1 失败（代表获取锁失败），则执行 acquire(1) 方法。

nonfairTryAcquire方法分为两种情况：

1. state 为 0 时，代表锁已经被释放，可以去获取，于是使用 CAS 去重新获取锁资源，如果获取成功，则代表竞争锁成功，使用 setExclusiveOwnerThread(current) 记录下此时占有锁的线程，看到这里的 CAS，大家应该不难理解为啥当前实现是非公平锁了，因为队列中的线程与新线程都可以 CAS 获取锁啊，新来的线程不需要排队
2. 如果 state 不为 0，代表之前已有线程占有了锁，如果此时的线程依然是之前占有锁的线程（current == getExclusiveOwnerThread() 为 true），代表此线程再一次占有了锁（可重入锁），此时更新 state，记录下锁被占有的次数（锁的重入次数）,这里的 setState 方法不需要使用 CAS 更新，因为此时的锁就是当前线程占有的，其他线程没有机会进入这段代码执行。所以此时更新 state 是线程安全的。

假设当前 state = 0，即锁不被占用，现在有 T1, T2, T3 这三个线程要去竞争锁

![](http://img.xxfxpt.top/202202261900599.png)

假设现在 T1 获取锁成功，则两种情况分别为 1、 T1 首次获取锁成功

![](http://img.xxfxpt.top/202202261901363.png)

 T1 再次获取锁成功，state 再加 1，表示锁被重入了两次，当前如果 T1一直申请占用锁成功，state 会一直累加

![](http://img.xxfxpt.top/202202261902095.png)

如果 tryAcquire(arg) 执行失败，代表获取锁失败，则执行 acquireQueued 方法，将线程加入 FIFO 等待队列

```java
public final void acquire(int arg) {
    if (!tryAcquire(arg) &&
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
        selfInterrupt();
}


```

接下来我们来看看 acquireQueued 的执行逻辑，首先会调用 **addWaiter(Node.EXCLUSIVE)** 将包含有当前线程的 Node 节点入队, Node.EXCLUSIVE 代表此结点为独占模式

再来看下 addWaiter 是如何实现的

```java
private Node addWaiter(Node mode) {
    Node node = new Node(Thread.currentThread(), mode);
    Node pred = tail;
    // 如果尾结点不为空，则用 CAS 将获取锁失败的线程入队
    if (pred != null) {
        node.prev = pred;
        if (compareAndSetTail(pred, node)) {
            pred.next = node;
            return node;
        }
    }
    // 如果结点为空，执行 enq 方法
    enq(node);
    return node;
}
```

首先是获取 FIFO 队列的尾结点，如果尾结点存在，则采用 CAS 的方式将等待线程入队，如果尾结点为空则执行 enq 方法

```java
private Node enq(final Node node) {
    for (;;) {
        Node t = tail;
        if (t == null) {
            // 尾结点为空，说明 FIFO 队列未初始化，所以先初始化其头结点
            if (compareAndSetHead(new Node()))
                tail = head;
        } else {
            // 尾结点不为空，则将等待线程入队
            node.prev = t;
            if (compareAndSetTail(t, node)) {
                t.next = node;
                return t;
            }
        }
    }
}
```

首先判断 tail 是否为空，如果为空说明 FIFO 队列的 head，tail 还未构建，此时先构建头结点，构建之后再用 CAS 的方式将此线程结点入队

使用 CAS 创建 head 节点的时候只是简单调用了 new Node() 方法，并不像其他节点那样记录 thread,因为 head 结点为**虚结点**，它只代表当前有线程占用了 state，至于占用 state 的是哪个线程，其实是调用了上文的 setExclusiveOwnerThread(current) ，即记录在 exclusiveOwnerThread 属性里。

执行完 addWaiter 后，线程入队成功，现在就要看最后一个最关键的方法 acquireQueued 了，这个方法有点难以理解，先不急，我们先用三个线程来模拟一下之前的代码对应的步骤

1、假设 T1 获取锁成功，由于此时 FIFO 未初始化，所以先创建 head 结点

![](http://img.xxfxpt.top/202202261914915.png)

2、此时 T2 或 T3 再去竞争 state 失败，入队，如下图:

![](http://img.xxfxpt.top/202202262211594.png)

好了，现在问题来了， T2，T3 入队后怎么处理，是马上阻塞吗，马上阻塞意味着线程从运行态转为阻塞态 ，涉及到用户态向内核态的切换，而且唤醒后也要从内核态转为用户态，开销相对比较大，所以 AQS 对这种入队的线程采用的方式是让它们自旋来竞争锁，如下图示

![](http://img.xxfxpt.top/202202262213416.png)



如果当前锁是独占锁，如果锁一直被被 T1 占有， T2，T3 一直自旋没太大意义，反而会占用 CPU，影响性能，所以更合适的方式是它们自旋一两次竞争不到锁后识趣地阻塞以等待前置节点释放锁后再来唤醒它。

另外如果锁在自旋过程中被中断了，或者自旋超时了，应该处于「取消」状态。

基于每个 Node 可能所处的状态，AQS 为其定义了一个变量 waitStatus，根据这个变量值对相应节点进行相关的操作，我们一起来看这看这个变量都有哪些值，看一个 Node 结点的属性定义。

```java
static final class Node {
    static final Node SHARED = new Node();//标识等待节点处于共享模式
    static final Node EXCLUSIVE = null;//标识等待节点处于独占模式

    static final int CANCELLED = 1; //由于超时或中断，节点已被取消
    static final int SIGNAL = -1;  // 节点阻塞（park）必须在其前驱结点为 SIGNAL 的状态下才能进行，如果结点为 SIGNAL,则其释放锁或取消后，可以通过 unpark 唤醒下一个节点，
    static final int CONDITION = -2;//表示线程在等待条件变量（先获取锁，加入到条件等待队列，然后释放锁，等待条件变量满足条件；只有重新获取锁之后才能返回）
    static final int PROPAGATE = -3;//表示后续结点会传播唤醒的操作，共享模式下起作用

    //等待状态：对于condition节点，初始化为CONDITION；其它情况，默认为0，通过CAS操作原子更新
    volatile int waitStatu
    }
```

```java
final boolean acquireQueued(final Node node, int arg) {
    boolean failed = true;
    try {
        boolean interrupted = false;
        for (;;) {
            final Node p = node.predecessor();
            // 如果前一个节点是 head，则尝试自旋获取锁
            if (p == head && tryAcquire(arg)) {
                //  将 head 结点指向当前节点，原 head 结点出队
                setHead(node);
                p.next = null; // help GC
                failed = false;
                return interrupted;
            }
            // 如果前一个节点不是 head 或者竞争锁失败，则进入阻塞状态
            if (shouldParkAfterFailedAcquire(p, node) &&
                parkAndCheckInterrupt())
                interrupted = true;
        }
    } finally {
        if (failed)
            // 如果线程自旋中因为异常等原因获取锁最终失败，则调用此方法
            cancelAcquire(node);
    }
}
```

先来看第一种情况，如果当前结点的前一个节点是 head 结点，且获取锁（tryAcquire）成功的处理

![](http://img.xxfxpt.top/202202262223984.jpg)

可以看到主要的处理就是把 head 指向当前节点，并且让原 head 结点出队，这样由于原 head 不可达， 会被垃圾回收。

注意其中 setHead 的处理

```java
private void setHead(Node node) {
    head = node;
    node.thread = null;
    node.prev = null;
}
```

将 head 设置成当前结点后，要把节点的 thread, pre 设置成 null，因为之前分析过了，head 是虚节点，不保存除 waitStatus（结点状态）的其他信息，所以这里把 thread ,pre 置为空，因为占有锁的线程由 exclusiveThread 记录了，如果 head 再记录 thread 不仅多此一举，反而在释放锁的时候要多操作一遍 head 的 thread 释放。

如果前一个节点不是 head 或者竞争锁失败，则首先调用  shouldParkAfterFailedAcquire 方法判断锁是否应该停止自旋进入阻塞状态:

```java
private static boolean shouldParkAfterFailedAcquire(Node pred, Node node) {
    int ws = pred.waitStatus;
        
    if (ws == Node.SIGNAL)
       // 1. 如果前置顶点的状态为 SIGNAL，表示当前节点可以阻塞了
        return true;
    if (ws > 0) {
        // 2. 移除取消状态的结点
        do {
            node.prev = pred = pred.prev;
        } while (pred.waitStatus > 0);
        pred.next = node;
    } else {
        // 3. 如果前置节点的 ws 不为 0，则其设置为 SIGNAL，
        compareAndSetWaitStatus(pred, ws, Node.SIGNAL);
    }
    return false;
}
```

1、 首先我们要明白，根据之前 Node 类的注释，如果前驱节点为 SIGNAL，则当前节点可以进入阻塞状态。

![](http://img.xxfxpt.top/202202262228094.jpg)



**如图示：T2，T3 的前驱节点的 waitStatus 都为 SIGNAL，所以 T2，T3 此时都可以阻塞。**

2、如果前驱节点为取消状态，则前驱节点需要移除，这些采用了一个更巧妙的方法，把所有当前节点之前所有 waitStatus 为取消状态的节点全部移除，假设有四个线程如下，T2，T3 为取消状态，则执行逻辑后如下图所示，T2, T3 节点会被 GC。

![](http://img.xxfxpt.top/202202262232027.png)

3、如果前驱节点小于等于 0，则需要首先将其前驱节点置为 SIGNAL,因为前文我们分析过，当前节点进入阻塞的一个条件是前驱节点必须为 SIGNAL，这样下一次自旋后发现前驱节点为 SIGNAL，就会返回 true（即步骤 1）

shouldParkAfterFailedAcquire 返回 true 代表线程可以进入阻塞中断，那么下一步 parkAndCheckInterrupt 就该让线程阻塞了

```java
private final boolean parkAndCheckInterrupt() {
    // 阻塞线程
    LockSupport.park(this);
    // 返回线程是否中断过，并且清除中断状态（在获得锁后会补一次中断）
    return Thread.interrupted();
}
```

为啥要判断线程是否中断过呢，因为如果线程在阻塞期间收到了中断，唤醒（转为运行态）获取锁后（acquireQueued 为 true）需要补一个中断，如下所示：

```java
public final void acquire(int arg) {
    if (!tryAcquire(arg) &&
        acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
        // 如果是因为中断唤醒的线程，获取锁后需要补一下中断
        selfInterrupt();
}
```

Node 什么时候会被设置为取消状态呢?

看 acquireQueued

```java
final boolean acquireQueued(final Node node, int arg) {
    boolean failed = true;
    try {
        // 省略自旋获取锁代码        
    } finally {
        if (failed)
            // 如果线程自旋中因为异常等原因获取锁最终失败，则调用此方法
            cancelAcquire(node);
    }
}
```

看最后一个 cancelAcquire 方法，如果线程自旋中因为异常等原因获取锁最终失败，则会调用此方法

```java
private void cancelAcquire(Node node) {
    // 如果节点为空，直接返回
    if (node == null)
        return;
    // 由于线程要被取消了，所以将 thread 线程清掉
    node.thread = null;

    // 下面这步表示将 node 的 pre 指向之前第一个非取消状态的结点（即跳过所有取消状态的结点）,waitStatus > 0 表示当前结点状态为取消状态
    Node pred = node.prev;
    while (pred.waitStatus > 0)
        node.prev = pred = pred.prev;

    // 获取经过过滤后的 pre 的 next 结点，这一步主要用在后面的 CAS 设置 pre 的 next 节点上
    Node predNext = pred.next;
    // 将当前结点设置为取消状态
    node.waitStatus = Node.CANCELLED;
z
    // 如果当前取消结点为尾结点，使用 CAS 则将尾结点设置为其前驱节点，如果设置成功，则尾结点的 next 指针设置为空
    if (node == tail && compareAndSetTail(node, pred)) {
        compareAndSetNext(pred, predNext, null);
    } else {
    // 这一步看得有点绕，我们想想，如果当前节点取消了，那是不是要把当前节点的前驱节点指向当前节点的后继节点，但是我们之前也说了，要唤醒或阻塞结点，须在其前驱节点的状态为 SIGNAL 的条件才能操作，所以在设置 pre 的 next 节点时要保证 pre 结点的状态为 SIGNAL，想通了这一点相信你不难理解以下代码。
        int ws;
        if (pred != head &&
            ((ws = pred.waitStatus) == Node.SIGNAL ||
             (ws <= 0 && compareAndSetWaitStatus(pred, ws, Node.SIGNAL))) &&
            pred.thread != null) {
            Node next = node.next;
            if (next != null && next.waitStatus <= 0)
                compareAndSetNext(pred, predNext, next);
        } else {
        // 如果 pre 为 head，或者  pre 的状态设置 SIGNAL 失败，则直接唤醒后继结点去竞争锁，之前我们说过， SIGNAL 的结点取消（或释放锁）后可以唤醒后继结点
            unparkSuccessor(node);
        }
        node.next = node; // help GC
    }
}
```

1、首先第一步当前节点之前有取消结点时，则逻辑如下

![](http://img.xxfxpt.top/202202262237045.png)

2、如果当前结点既非头结点的后继结点，也非尾结点，即步骤 1 所示，则最终结果如下

![](http://img.xxfxpt.top/202202262238826.jpg)



这里肯定有人问，这种情况下当前节点与它的前驱结点无法被 GC 啊，还记得我们上文分析锁自旋时的处理吗,再看下以下代码

```java
private static boolean shouldParkAfterFailedAcquire(Node pred, Node node) {
    int ws = pred.waitStatus;
    // 省略无关代码
    if (ws > 0) {
        // 移除取消状态的结点
        do {
            node.prev = pred = pred.prev;
        } while (pred.waitStatus > 0);
        pred.next = node;
    } 
    return false;
}
```

这段代码会将 node 的 pre 指向之前 waitStatus 为非 CANCEL 的节点

所以当 T4 执行这段代码时，会变成如下情况

![](http://img.xxfxpt.top/202202262239593.jpg)

可以看到此时中间的两个 CANCEL 节点不可达了，会被 GC

3、如果当前结点为 tail 结点，则结果如下，这种情况下当前结点不可达，会被 GC

![](http://img.xxfxpt.top/202202262240206.jpg)

4、如果当前结点为 head 的后继结点时，如下

![](http://img.xxfxpt.top/202202262242293.jpg)

结果中的 CANCEL 结点同样会在 tail 结点自旋调用 shouldParkAfterFailedAcquire 后不可达，如下

![](http://img.xxfxpt.top/202202262243364.jpg)



`ReentrantLock` 中公平锁的 `lock` 方法

```java
static final class FairSync extends Sync {
    final void lock() {
        acquire(1);
    }
    // AbstractQueuedSynchronizer.acquire(int arg)
    public final void acquire(int arg) {
        if (!tryAcquire(arg) &&
            acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
            selfInterrupt();
    }
    protected final boolean tryAcquire(int acquires) {
        final Thread current = Thread.currentThread();
        int c = getState();
        if (c == 0) {
            // 1. 和非公平锁相比，这里多了一个判断：是否有线程在等待
            if (!hasQueuedPredecessors() &&
                compareAndSetState(0, acquires)) {
                setExclusiveOwnerThread(current);
                return true;
            }
        }
        else if (current == getExclusiveOwnerThread()) {
            int nextc = c + acquires;
            if (nextc < 0)
                throw new Error("Maximum lock count exceeded");
            setState(nextc);
            return true;
        }
        return false;
    }
}

```

总结：公平锁和非公平锁两处不同：

1. 非公平锁在调用 lock 后，首先就会调用 CAS 进行一次抢锁，如果这个时候恰巧锁没有被占用，那么直接就获取到锁返回了。
2. 非公平锁在 CAS 失败后，和公平锁一样都会进入到 `tryAcquire` 方法，在 `tryAcquire` 方法中，如果发现锁这个时候被释放了（state == 0），非公平锁会直接 CAS 抢锁，但是公平锁会判断等待队列是否有线程处于等待状态，如果有则不去抢锁，乖乖排到后面。

相对来说，非公平锁会有更好的性能，因为它的吞吐量比较大。当然，非公平锁让获取锁的时间变得更加不确定，可能会导致在阻塞队列中的线程长期处于饥饿状态。

**锁释放**

不管是公平锁还是非公平锁，最终都是调的 AQS 的如下模板方法来释放锁

```java
public final boolean release(int arg) {
    // 锁释放是否成功
    if (tryRelease(arg)) {
        Node h = head;
        if (h != null && h.waitStatus != 0)
            unparkSuccessor(h);
        return true;
    }
    return false;
}
```

tryRelease 方法定义在了 AQS 的子类 Sync 方法里

```java
// java.util.concurrent.locks.ReentrantLock.Sync

protected final boolean tryRelease(int releases) {
    int c = getState() - releases;
    // 只有持有锁的线程才能释放锁，所以如果当前锁不是持有锁的线程，则抛异常
    if (Thread.currentThread() != getExclusiveOwnerThread())
        throw new IllegalMonitorStateException();
    boolean free = false;
    // 说明线程持有的锁全部释放了，需要释放 exclusiveOwnerThread 的持有线程
    if (c == 0) {
        free = true;
        setExclusiveOwnerThread(null);
    }
    setState(c);
    return free;
}
```

锁释放成功后该干嘛，显然是唤醒之后 head 之后节点，让它来竞争锁

```java
// java.util.concurrent.locks.AbstractQueuedSynchronizer

public final boolean release(int arg) {
    // 锁释放是否成功
    if (tryRelease(arg)) {
        Node h = head;
        if (h != null && h.waitStatus != 0)
            // 锁释放成功后，唤醒 head 之后的节点，让它来竞争锁
            unparkSuccessor(h);
        return true;
    }
    return false;
}
```

这里释放锁的条件为啥是 h != null && h.waitStatus != 0 呢。

1. 如果 h == null, 这有两种可能，一种是一个线程在竞争锁，现在它释放了，当然没有所谓的唤醒后继节点，一种是其他线程正在运行竞争锁，只是还未初始化头节点，既然其他线程正在运行，也就无需执行唤醒操作
2. 如果 h != null 且 h.waitStatus == 0，说明 head 的后继节点正在自旋竞争锁，也就是说线程是运行状态的，无需唤醒。
3. 如果 h != null 且 h.waitStatus < 0, 此时 waitStatus 值可能为 SIGNAL，或 PROPAGATE，这两种情况说明后继结点阻塞需要被唤醒

来看一下唤醒方法 unparkSuccessor：

```java
private void unparkSuccessor(Node node) {
    // 获取 head 的 waitStatus（假设其为 SIGNAL）,并用 CAS 将其置为 0，为啥要做这一步呢，之前我们分析过多次，其实 waitStatus = SIGNAL（< -1）或 PROPAGATE（-·3） 只是一个标志，代表在此状态下，后继节点可以唤醒，既然正在唤醒后继节点，自然可以将其重置为 0，当然如果失败了也不影响其唤醒后继结点
    int ws = node.waitStatus;
    if (ws < 0)
        compareAndSetWaitStatus(node, ws, 0);

    // 以下操作为获取队列第一个非取消状态的结点，并将其唤醒
    Node s = node.next;
    // s 状态为非空，或者其为取消状态，说明 s 是无效节点，此时需要执行 if 里的逻辑
    if (s == null || s.waitStatus > 0) {
        s = null;
        // 以下操作为从尾向前获取最后一个非取消状态的结点
        for (Node t = tail; t != null && t != node; t = t.prev)
            if (t.waitStatus <= 0)
                s = t;
    }
    if (s != null)
        LockSupport.unpark(s.thread);
}
```

这里的寻找队列的第一个非取消状态的节点为啥要从后往前找呢，因为节点入队并不是原子操作，如下

```java
    private Node addWaiter(Node mode) {
        Node node = new Node(Thread.currentThread(), mode);
        // Try the fast path of enq; backup to full enq on failure
        Node pred = tail;
        if (pred != null) {
            node.prev = pred;
            if (compareAndSetTail(pred, node)) {
                pred.next = node;
                return node;
            }
        }
        enq(node);
        return node;
    }
```

线程自旋时时是先执行 node.pre = pred, 然后再执行 pred.next = node，如果 unparkSuccessor 刚好在这两者之间执行，此时是找不到  head 的后继节点的，如下

![](C:\Users\zouyo\Pictures\640 (13).jpg)

## AQS 底层使用了模板方法模式

同步器的设计是基于模板方法模式的，如果需要自定义同步器一般的方式是这样（模板方法模式很经典的一个应用）：

1. 使用者继承 `AbstractQueuedSynchronizer` 并重写指定的方法。（这些重写方法很简单，无非是对于共享资源 state 的获取和释放）
2. 将 AQS 组合在自定义同步组件的实现中，并调用其模板方法，而这些模板方法会调用使用者重写的方法。

这和我们以往通过实现接口的方式有很大区别，这是模板方法模式很经典的一个运用。

**AQS 使用了模板方法模式，自定义同步器时需要重写下面几个 AQS 提供的钩子方法：**

```java
protected boolean tryAcquire(int)//独占方式。尝试获取资源，成功则返回true，失败则返回false。
protected boolean tryRelease(int)//独占方式。尝试释放资源，成功则返回true，失败则返回false。
protected boolean tryAcquireShared(int)//共享方式。尝试获取资源。负数表示失败；0表示成功，但没有剩余可用资源；正数表示成功，且有剩余资源。
protected boolean tryReleaseShared(int)//共享方式。尝试释放资源，成功则返回true，失败则返回false。
protected boolean isHeldExclusively()//该线程是否正在独占资源。只有用到condition才需要去实现它。

```

**什么是钩子方法呢？** 钩子方法是一种被声明在抽象类中的方法，一般使用 `protected` 关键字修饰，它可以是空方法（由子类实现），也可以是默认实现的方法。模板设计模式通过钩子方法控制固定步骤的实现。

除了上面提到的钩子方法之外，AQS 类中的其他方法都是 `final` ，所以无法被其他类重写。

以 `ReentrantLock` 为例，state 初始化为 0，表示未锁定状态。A 线程 `lock()` 时，会调用 `tryAcquire()` 独占该锁并将 `state+1` 。此后，其他线程再 `tryAcquire()` 时就会失败，直到 A 线程 `unlock()` 到 `state=`0（即释放锁）为止，其它线程才有机会获取该锁。当然，释放锁之前，A 线程自己是可以重复获取此锁的（state 会累加），这就是可重入的概念。但要注意，获取多少次就要释放多少次，这样才能保证 state 是能回到零态的。

再以 `CountDownLatch` 以例，任务分为 N 个子线程去执行，state 也初始化为 N（注意 N 要与线程个数一致）。这 N 个子线程是并行执行的，每个子线程执行完后`countDown()` 一次，state 会 CAS(Compare and Swap) 减 1。等到所有子线程都执行完后(即 `state=0` )，会 `unpark()` 主调用线程，然后主调用线程就会从 `await()` 函数返回，继续后余动作。

一般来说，自定义同步器要么是独占方法，要么是共享方式，他们也只需实现`tryAcquire-tryRelease`、`tryAcquireShared-tryReleaseShared`中的一种即可。但 AQS 也支持自定义同步器同时实现独占和共享两种方式，如`ReentrantReadWriteLock`。