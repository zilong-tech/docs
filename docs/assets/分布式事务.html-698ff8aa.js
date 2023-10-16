import{_ as p,W as t,X as r,a1 as o}from"./framework-2afc6763.js";const s={},e=o('<h3 id="背景" tabindex="-1"><a class="header-anchor" href="#背景" aria-hidden="true">#</a> 背景</h3><p>随着互联网高速发展， 事务的参与者、 支持事务的服务器、 资源服务器以及事务管理器分别位于不同的分布式系统的不同节点之上。 简单的说， 就是一次大的操作由不同的小操作组成， 这些小的操作分布在不同的服务器上， 且属于不同的应用。 在这种环境中， 我们之前说过数据库的 ACID 四大特性， 已经无法满足我们分布式事务。</p><p>本质上来说， 分布式事务就是为了保证不同数据库的数据一致性。</p><p><img src="https://pic4.zhimg.com/v2-568bb26e3126685dab28c29f5cf85d8b_b.png" alt=""></p><p>介绍分布式事务之前先来说下<strong>本地事务</strong>：</p><p>我们的应用都只需要操作单一的数据库，这种情况下的事务称之为本地事务(LocalTransaction)。本地事务的ACID特性是数据库直接提供支持。本地事务应用架构如下所示：</p><p><img src="http://img.xxfxpt.top/202112111653195.PNG" alt=""></p><p><strong>分布式事务</strong></p><p>分布式事务是指会涉及到操作多个数据库的事务。其实就是将对同一库事务的概念扩大到了对多个库的事务。目的是为了保证分布式系统中的数据一致性。<strong>分布式事务处理的关键是必须有一种方法可以知道事务在任何地方所做的所有动作，提交或回滚事务的决定必须产生统一的结果（全部提交或全部回滚）</strong></p><p>典型的分布式事务场景：</p><h4 id="跨库事务" tabindex="-1"><a class="header-anchor" href="#跨库事务" aria-hidden="true">#</a> <strong>跨库事务</strong></h4><p>跨库事务指的是，一个应用某个功能需要操作多个库，不同的库中存储不同的业务数据。笔者见过一个相对比较复杂的业务，一个业务中同时操作了9个库。下图演示了一个服务同时操作多个库的情况：</p><p><img src="http://img.xxfxpt.top/202112111610929.PNG" alt=""></p><h4 id="分库分表" tabindex="-1"><a class="header-anchor" href="#分库分表" aria-hidden="true">#</a> <strong>分库分表</strong></h4><p>通常一个库数据量比较大或者预期未来的数据量比较大，都会进行水平拆分，也就是分库分表。如下图，将数据库B拆分成了2个库：</p><p><img src="http://img.xxfxpt.top/202112111613747.PNG" alt=""></p><h4 id="服务化" tabindex="-1"><a class="header-anchor" href="#服务化" aria-hidden="true">#</a> <strong>服务化</strong></h4><p>微服务架构是目前一个比较一个比较火的概念。例如上面提到的一个案例，某个应用同时操作了9个库，这样的应用业务逻辑必然非常复杂，对于开发人员是极大的挑战，应该拆分成不同的独立服务，以简化业务逻辑。拆分后，独立服务之间通过RPC框架来进行远程调用，实现彼此的通信。下图演示了一个3个服务之间彼此调用的架构：</p><p><img src="http://img.xxfxpt.top/202112111615561.PNG" alt=""></p><p>Service A完成某个功能需要直接操作数据库，同时需要调用Service B和Service C，而Service B又同时操作了2个数据库，Service C也操作了一个库。需要保证这些跨服务的对多个数据库的操作要不都成功，要不都失败，实际上这可能是最典型的分布式事务场景。</p><p>上述讨论的分布式事务场景中，无一例外的都直接或者间接的操作了多个数据库。如何保证事务的ACID特性， 对于分布式事务实现方案而言，是非常大的挑战。同时，分布式事务实现方案还必须要考虑性能的问题，如果为了严格保证ACID特性，导致性能严重下降，那么对于一些要求快速响应的业务，是无法接受的。</p><h3 id="常见解决方案" tabindex="-1"><a class="header-anchor" href="#常见解决方案" aria-hidden="true">#</a> 常见解决方案</h3><p><strong>DTP模型</strong></p><p>构成DTP模型的5个基本元素：</p><p>**应用程序(Application Program ，简称AP)：**用于定义事务边界(即定义事务的开始和结束)，并且在事务边界内对资源进行操作。</p><p>**资源管理器(Resource Manager，简称RM)：**如数据库、文件系统等，并提供访问资源的方式。</p><p>**事务管理器(Transaction Manager ，简称TM)：**负责分配事务唯一标识，监控事务的执行进度，并负责事务的提交、回滚等。</p><p>**通信资源管理器(Communication Resource Manager，简称CRM)：**控制一个TM域(TM domain)内或者跨TM域的分布式应用之间的通信。</p><p>**通信协议(Communication Protocol，简称CP)：**提供CRM提供的分布式应用节点之间的底层通信服务。</p><p><strong>XA规范</strong></p><p>在DTP本地模型实例中，由AP、RMs和TM组成，不需要其他元素。AP、RM和TM之间，彼此都需要进行交互，如下图所示：</p><p><img src="http://img.xxfxpt.top/202112111733141.PNG" alt=""></p><p>这张图中(1)表示AP-RM的交互接口，(2)表示AP-TM的交互接口，(3)表示RM-TM的交互接口。</p><p>XA规范的最主要的作用是，就是定义了RM-TM的交互接口，XA规范除了定义的RM-TM交互的接口(XA Interface)之外，还对两阶段提交协议进行了优化。</p><h4 id="_1、基于xa协议的两阶段提交-2pc" tabindex="-1"><a class="header-anchor" href="#_1、基于xa协议的两阶段提交-2pc" aria-hidden="true">#</a> 1、<strong>基于XA协议的两阶段提交(2PC)</strong></h4><p>X/Open 组织提出了分布式事务的规范 ----- XA 协议</p><p>XA 协议包含两部分： 事务管理器 TM 和本地资源管理器 RM。</p><p>其中本地资源管理器往往由数据库实现， 目前主流的关系型数据库都实现了 XA 接口，而事务管理器作为全局的调度者， 负责各个本地资源的提交和回滚。</p><p>XA 的核心， 便是全局事务， 通过 XA 二阶段提交协议， 与各分布式数据交互， 分准备与提交两个阶段</p><p>逻辑流程如下图：</p><p><img src="http://img.xxfxpt.top/202112111750151.png" alt=""></p><p>在 XA 协议中事务分为两阶段：</p><p><strong>阶段1：</strong></p><p>TM 通知各个RM准备提交它们的事务分支。如果RM判断自己进行的工作可以被提交，那就对工作内容进行持久化， 再给TM肯定答复；要是发生了其他情况，那给TM的都是否定答复。在发送了否定答复并回滚了已经的工作后，RM就可以丢弃这个事务分支信息。</p><p>在mysql数据库中，在第一阶段，事务管理器向所有涉及到的数据库服务器发出prepare&quot;准备提交&quot;请求，数据库收到请求后执行数据修改和日志记录等处理，处理完成后只是把事务的状态改成&quot;可以提交&quot;,然后把结果返回给事务管理器。</p><p><img src="http://img.xxfxpt.top/202112111827868.png" alt=""></p><p>第一阶段主要分为3步</p><p>1）事务询问</p><p><strong>事务管理器</strong>向所有的<strong>资源管理器</strong>发送事务预处理请求**，称之为**Prepare，并开始等待各资源管理器的响应。</p><p>2）执行本地事务</p><p>各个 资源管理器 节点执行本地事务操作,但在执行完成后并<strong>不会真正提交数据库本地事务</strong>，而是先向 <strong>事务管理器</strong> 报告说：“我这边可以处理了/我这边不能处理”。.</p><p>3）各参与者向事务管理器反馈事务询问的响应</p><p>如果 <strong>资源管理器</strong> 成功执行了事务操作,那么就反馈给事务管理器 <strong>Yes</strong> 响应,表示事务可以执行,如果 <strong>资源管理器</strong> 没有成功执行事务,那么就反馈给事务管理器 <strong>No</strong> 响应,表示事务不可以执行。</p><p>第一阶段执行完后，会有两种可能。1、所有都返回Yes. 2、有一个或者多个返回No。</p><p><strong>阶段2</strong></p><p>TM根据阶段1各个RM prepare的结果，决定是提交还是回滚事务。如果所有的RM都prepare成功，那么TM通知所有的RM进行提交；如果有RM prepare失败的话，则TM通知所有RM回滚自己的事务分支。</p><p>在mysql数据库中，如果第一阶段中所有数据库都prepare成功，那么事务管理器向数据库服务器发出&quot;确认提交&quot;请求，数据库服务器把事务的&quot;可以提交&quot;状态改为&quot;提交完成&quot;状态，然后返回应答。如果在第一阶段内有任何一个数据库的操作发生了错误，或者事务管理器收不到某个数据库的回应，则认为事务失败，回撤所有数据库的事务。数据库服务器收不到第二阶段的确认提交请求，也会把&quot;可以提交&quot;的事务回撤。</p><p><img src="http://img.xxfxpt.top/202112111834722.png" alt=""></p><p>第二阶段主要分为两步</p><p>1)所有的资源管理器反馈给 <strong>事务管理器</strong>的信息都是Yes,那么就会执行事务提交</p><p><strong>事务管理器</strong>向所有<strong>资源管理器</strong>节点发出Commit请求.</p><p>2)事务提交</p><p><strong>资源管理器</strong> 收到Commit请求之后,就会正式执行本地事务Commit操作,并在完成提交之后释放整个事务执行期间占用的事务资源。</p><h5 id="第二阶段-提交-执行阶段-异常流程" tabindex="-1"><a class="header-anchor" href="#第二阶段-提交-执行阶段-异常流程" aria-hidden="true">#</a> 第二阶段：提交/执行阶段（异常流程）</h5><p>异常流程第二阶段也分为两步</p><p>1)发送回滚请求</p><p>事务管理器 向所有资源管理器节点发出 <strong>RoollBack</strong> 请求.</p><p>2)事务回滚</p><p>资源管理器接收到RoollBack请求后,会回滚本地事务。</p><p><img src="http://img.xxfxpt.top/202112111839363.png" alt=""></p><p>异常条件：任何一个 <strong>资源管理器</strong> 向 <strong>事务管理器</strong> 反馈了 <strong>No</strong> 响应,或者等待超时之后, <strong>事务管理器</strong>尚未收到所有资源管理器的反馈响应。</p><p>2PC 是一个<strong>同步阻塞协议</strong>，像第一阶段协调者会等待所有参与者响应才会进行下一步操作，当然第一阶段的<strong>协调者有超时机制</strong>，假设因为网络原因没有收到某参与者的响应或某参与者挂了，那么超时后就会判断事务失败，向所有参与者发送回滚命令。</p><p>两阶段提交还有另外一种实现方式 <strong>TCC</strong></p><h4 id="tcc" tabindex="-1"><a class="header-anchor" href="#tcc" aria-hidden="true">#</a> <strong>TCC</strong></h4><p><strong>TCC 是业务层面的分布式事务</strong>，TCC 其实就是采用的补偿机制， 其核心思想是： 针对每个操作， 都要注册一个与其业务逻辑对应的确认和补偿（撤销） 操作。</p><p>TCC 指的是Try - Confirm - Cancel。</p><ul><li>Try 指的是预留，即资源的预留和锁定，<strong>注意是预留</strong>。完成业务的准备操作</li><li>Confirm 指的是确认操作，这一步其实就是真正的执行了。</li><li>Cancel 指的是撤销操作，可以理解为把预留阶段的动作撤销了。</li></ul><p>其实从思想上看和 2PC 差不多，都是先试探性的执行，如果都可以那就真正的执行，如果不行就回滚。</p><p>比如说一个事务要执行A、B、C三个操作，那么先对三个操作执行预留动作。如果都预留成功了那么就执行确认操作，如果有一个预留失败那就都执行撤销动作。</p><p>我们来看下流程，TCC模型还有个事务管理者的角色，用来记录TCC全局事务状态并提交或者回滚事务。</p><p><img src="https://pic2.zhimg.com/v2-d5e1320582ef47e97e48209ff23f6df5_b.png" alt=""></p><p>优点： 跟 2PC 比起来， 实现以及流程相对简单了一些， 但数据的一致性比 2PC 也要差一些</p><p>缺点： TCC 属于应用层的一种补偿方式， 所以需要程序员在实现的时候多写很多补偿的代码， 而且补偿的时候也有可能失败， 在一些场景中， 一些业务流程可能用 TCC 不太好定义及处理。</p><p><img src="http://img.xxfxpt.top/202112111910080.PNG" alt=""></p><p><strong>XA是资源层面的分布式事务，强一致性，在两阶段提交的整个过程中，一直会持有资源的锁。</strong></p><p><strong>TCC是业务层面的分布式事务，最终一致性，不会一直持有资源的锁。</strong></p><p><strong>两阶段提交协议(2PC)存在的问题</strong></p><p>二阶段提交看起来确实能够提供原子性的操作，但是不幸的是，二阶段提交还是有几个缺点的：</p><p><strong>1、同步阻塞问题。</strong></p><p>两阶段提交方案下全局事务的ACID特性，是依赖于RM的。一个全局事务内部包含了多个独立的事务分支，这一组事务分支要不都成功，要不都失败。各个事务分支的ACID特性共同构成了全局事务的ACID特性。也就是将单个事务分支的支持的ACID特性提升一个层次到分布式事务的范畴。 即使在本地事务中，如果对操作读很敏感，我们也需要将事务隔离级别设置为SERIALIZABLE。而对于分布式事务来说，更是如此，可重复读隔离级别不足以保证分布式事务一致性。如果我们使用mysql来支持XA分布式事务的话，那么最好将事务隔离级别设置为SERIALIZABLE，然而SERIALIZABLE(串行化)是四个事务隔离级别中最高的一个级别，也是执行效率最低的一个级别。</p><p><strong>2、单点故障。</strong></p><p>由于协调者的重要性，一旦协调者TM发生故障，参与者RM会一直阻塞下去。尤其在第二阶段，协调者发生故障，那么所有的参与者还都处于锁定事务资源的状态中，而无法继续完成事务操作。（如果是协调者挂掉，可以重新选举一个协调者，但是无法解决因为协调者宕机导致的参与者处于阻塞状态的问题）</p><p>**3、数据不一致。**在二阶段提交的阶段二中，当协调者向参与者发送commit请求之后，发生了局部网络异常或者在发送commit请求过程中协调者发生了故障，这会导致只有一部分参与者接受到了commit请求，而在这部分参与者接到commit请求之后就会执行commit操作，但是其他部分未接到commit请求的机器则无法执行事务提交。于是整个分布式系统便出现了数据不一致性的现象。</p><p><strong>两阶段提交方案锁定资源时间长， 对性能影响很大， 基本不适合解决微服务事务问题。</strong></p><p>基于两阶段的问题，提出了三阶段提交。</p><h4 id="_2、三阶段提交协议-3pc" tabindex="-1"><a class="header-anchor" href="#_2、三阶段提交协议-3pc" aria-hidden="true">#</a> 2、<strong>三阶段提交协议 （<strong>3PC</strong>）</strong></h4><p>3PC 的出现是为了解决 2PC 的一些问题，相比于 2PC 它在<strong>参与者中也引入了超时机制</strong>，并且<strong>新增了一个阶段</strong>使得参与者可以利用这一个阶段统一各自的状态。</p><p>3PC 包含了三个阶段，分别是<strong>准备阶段、预提交阶段和提交阶段</strong>，对应的英文就是：CanCommit、PreCommit 和 DoCommit。</p><p>与两阶段提交不同的是，三阶段提交有两个改动点：</p><p>1、引入超时机制。同时在协调者和参与者中都引入超时机制。</p><p>2、在第一阶段和第二阶段中插入一个准备阶段。保证了在最后提交阶段之前各参与节点的状态是一致的。</p><p><strong>CanCommit阶段</strong></p><p>协调者向参与者发送commit请求，参与者如果可以提交就返回 Yes 响应，否则返回 No 响应。</p><p>1.事务询问:协调者向参与者发送 CanCommit 请求。询问是否可以执行事务提交操作。然后开始等待参与者的响应。</p><p>2.响应反馈: 参与者接到 CanCommit 请求之后，正常情况下，如果其自身认为可以顺利执行事务，则返回 Yes 响应，并进入预备状态。否则反馈No。</p><p>这一阶段主要是确定分布式事务的参与者是否具备了完成 commit 的条件， 并不会执行事务操作。</p><p><img src="http://img.xxfxpt.top/202112111939500.png" alt=""></p><p><strong>PreCommit阶段</strong></p><p>协调者根据参与者的反应情况来决定是否可以继续事务的PreCommit操作。根据响应情况，有以下两种可能。</p><p>假如协调者从所有的参与者获得的反馈都是Yes响应，那么就会执行事务的预执行。</p><p>1.发送预提交请求 :协调者向参与者发送PreCommit请求，并进入Prepared阶段。</p><p>2.事务预提交: 参与者接收到PreCommit请求后，会执行事务操作，并将undo和redo信息记录到事务日志中。</p><p>3.响应反馈 :如果参与者成功的执行了事务操作，则返回ACK响应，同时开始等待最终指令。</p><p>假如有任何一个参与者向协调者发送了No响应，或者等待超时之后，协调者都没有接到参与者的响应，那么就执行事务的中断。</p><p>1.发送中断请求 ：协调者向所有参与者发送abort请求。</p><p>2.中断事务 ：参与者收到来自协调者的abort请求之后（或超时之后，仍未收到协调者的请求），执行事务的中断。</p><p><strong>doCommit阶段</strong></p><p>该阶段进行真正的事务提交，也可以分为以下两种情况。</p><p><strong>Case 1：执行提交</strong></p><p>1.发送提交请求: 协调接收到参与者发送的ACK响应，那么他将从预提交状态进入到提交状态。并向所有参与者发送 doCommit请求。</p><p>2.事务提交: 参与者接收到doCommit请求之后，执行正式的事务提交。并在完成事务提交之后释放所有事务资源。</p><p>3.响应反馈 :事务提交完之后，向协调者发送Ack响应。</p><p>4.完成事务 :协调者接收到所有参与者的ack响应之后，完成事务。</p><p><strong>Case 2：中断事务</strong></p><p>协调者没有接收到参与者发送的ACK响应（可能是接受者发送的不是ACK响应，也可能响应超时），那么就会执行中断事务。</p><p>1.发送中断请求: 协调者向所有参与者发送abort请求</p><p>2.事务回滚: 参与者接收到abort请求之后，利用其在阶段二记录的undo信息来执行事务的回滚操作，并在完成回滚之 后释放所有的事务资源。</p><p>3.反馈结果: 参与者完成事务回滚之后，向协调者发送ACK消息</p><p>4.中断事务 :协调者接收到参与者反馈的ACK消息之后，执行事务的中断。</p><p>在doCommit阶段，如果参与者无法及时接收到来自协调者的doCommit或者rebort请求时，会在等待超时之后，会 继续进行事务的提交。（其实这个应该是基于概率来决定的，当进入第三阶段时，说明参与者在第二阶段已经收到了PreCommit请求，那么协调者产生PreCommit请求的前提条件是他在第二阶段开始之前，收到所有参与者的CanCommit响应都是Yes。（一旦参与者收到了PreCommit，意味他知道大家其实都同意修改了）所以，一句话概括就是，当进入第三阶段时，由于网络超时等原因，虽然参与者没有收到commit或者abort响应，但是他有理由相信：成功提交的几率很大。 ）</p><p>优点：</p><p>相比较 2PC， 最大的优点是减少了参与者的阻塞范围（第一个阶段是不阻塞的），并且能够在单点故障后继续达成一致（2PC 在提交阶段会出现此问题， 而 3PC 会根据协调者的状态进行回滚或者提交）。</p><p>缺点：</p><p>如果参与者收到了 preCommit 消息后， 出现了网络分区， 那么参与者等待超时后， 都会进行事务的提交， 这必然会出现事务不一致的问题。</p><h4 id="_2pc与3pc的区别" tabindex="-1"><a class="header-anchor" href="#_2pc与3pc的区别" aria-hidden="true">#</a> <strong>2PC与3PC的区别</strong></h4><p>相对于2PC，3PC主要解决的单点故障问题，并减少阻塞，因为一旦参与者无法及时收到来自协调者的信息之后，他会默认执行commit。而不会一直持有事务资源并处于阻塞状态。但是这种机制也会导致数据一致性问题，因为，由于网络原因，协调者发送的abort响应没有及时被参与者接收到，那么参与者在等待超时之后执行了commit操作。这样就和其他接到abort命令并执行回滚的参与者之间存在数据不一致的情况。</p><p><strong>无论是二阶段提交还是三阶段提交都无法彻底解决分布式的一致性问题</strong></p><h4 id="_3、mq-事务消息" tabindex="-1"><a class="header-anchor" href="#_3、mq-事务消息" aria-hidden="true">#</a> 3、MQ 事务消息</h4><p>目前， 仅阿里云的 RocketMQ 支持事务消息。 帮助用户实现类似 X/Open XA 的分布事务功能， 通过 MQ 事务消息能达到分布式事务的最终一致。</p><p><img src="https://pic2.zhimg.com/v2-02d62ac6fea9d06d513a8a23d3349f89_b.jpeg" alt="img"></p><ol><li><p>发送方向 MQ 服务端发送消息</p></li><li><p>MQ Server 将消息持久化成功之后， 向发送方 ACK 确认消息已经发送成功， 此时消息为半消息（<strong>这个消息对消费者来说不可见</strong>）</p></li><li><p>发送方开始执行本地事务逻辑</p></li><li><p>发送方根据本地事务执行结果向 MQ Server 提交二次确认（Commit 或是 Rollback） ， MQ Server 收到 Commit为可投递， 订阅方最终将收到该消息； MQ Server 收到 Rollback 状态则删除半消息， 订阅方将不会接受该消息</p></li><li><p>在断网或者是应用重启的特殊情况下， 上述步骤 4 提交的二次确认最终未到达 MQ Server， 经过固定时间后 MQ起消息回查， RocketMQ 的发送方会提供一个<strong>反查事务状态接口</strong>，如果一段时间内半消息没有收到任何操作请求，那么 Broker 会通过反查接口得知发送方事务是否执行成功，然后执行 Commit 或者 RollBack 命令。</p></li><li><p>发送方收到消息回查后， 需要检查对应消息的本地事务执行的最终结果</p></li><li><p>发送方根据检查得到的本地事务的最终状态再次提交二次确认， MQ Server 仍按照步骤 4 对半消息进行操作</p></li></ol><p>RocketMQ优点：</p><ul><li>单机吞吐量：十万级</li><li>可用性：非常高，分布式架构</li><li>消息可靠性：经过参数优化配置，消息可以做到0丢失</li><li>功能支持：MQ功能较为完善，还是分布式的，扩展性好</li><li>支持10亿级别的消息堆积，不会因为堆积导致性能下降</li><li>源码是java，我们可以自己阅读源码，定制自己公司的MQ，可以掌控</li><li>天生为金融互联网领域而生，对于可靠性要求很高的场景，尤其是电商里面的订单扣款，以及业务削峰，在大量交易涌入时，后端可能无法及时处理的情况</li><li><strong>RoketMQ</strong>在稳定性上可能更值得信赖，这些业务场景在阿里双11已经经历了多次考验，如果你的业务有上述并发场景，建议可以选择<strong>RocketMQ</strong></li></ul><p>RocketMQ缺点：</p><ul><li>支持的客户端语言不多，目前是java及c++，其中c++不成熟</li><li>社区活跃度不是特别活跃那种</li><li>没有在 mq 核心中去实现<strong>JMS</strong>等接口，有些系统要迁移需要修改大量代码</li></ul><h4 id="_4、最大努力通知型" tabindex="-1"><a class="header-anchor" href="#_4、最大努力通知型" aria-hidden="true">#</a> <strong>4、最大努力通知型</strong></h4><p>业务处理后，向被动方发送通知消息（允许消息丢失）</p><p>主动发可以设置时间梯度通知规则，在通知失败后按照规则重复通知，直到通知N次后不再通知主动方提供查询接口供校对查询，如：收款通知、注册通知等等（支付宝/微信/12306，付款后页面自动跳转）</p><p><img src="https://pic1.zhimg.com/v2-de4975c80bb6745ebdc1a01b71653f90_b.png" alt="img"></p><h4 id="_5、本地消息表" tabindex="-1"><a class="header-anchor" href="#_5、本地消息表" aria-hidden="true">#</a> <strong>5、本地消息表</strong></h4><p>本地消息表其实就是利用了 <strong>各系统本地的事务</strong>来实现分布式事务。</p><p>本地消息表顾名思义就是会有一张存放本地消息的表，一般都是放在数据库中，然后在执行业务的时候 <strong>将业务的执行和将消息放入消息表中的操作放在同一个事务中</strong>，这样就能保证消息放入本地表中业务肯定是执行成功的。然后再去调用下一个操作，如果下一个操作调用成功了好说，消息表的消息状态可以直接改成已成功。</p><p>如果调用失败也没事，会有 <strong>后台任务定时去读取本地消息表</strong>，筛选出还未成功的消息再调用对应的服务，服务更新成功了再变更消息的状态。</p><p>这时候有可能消息对应的操作不成功，因此也需要重试，重试就得保证对应服务的方法是幂等的，而且一般重试会有最大次数，超过最大次数可以记录下报警让人工处理。</p><p><img src="http://img.xxfxpt.top/202112112123822.webp" alt=""></p><ul><li><p>步骤1和2，系统收到用户下单请求，将订单业务数据写入订单表中，同时把该订单对应的消息数据写入本地消息表中，订单表与本地消息表为同一个数据库，更新订单和存储消息为同一个本地事务，数据库事务处理，要么都成功，要么都失败。</p></li><li><p>步骤345，订单服务发送消息到消息队列，库存服务收到消息，进行库存业务操作，更新库存数据</p></li><li><p>步骤6和7，返回业务处理结果，订单服务收到结果后，将本地消息表中的数据设置完成状态或者删除数据。</p></li><li><p>步骤8，另起定时任务，定时扫描本地消息表，看是否有未完成的任务，有则重试。</p></li></ul><p><strong>本地消息表优缺点</strong></p><p>本地消息表实现了分布式事务的最终一致性，优缺点比较明显。 <strong>优点：</strong></p><ul><li>实现逻辑简单，开发成本比较低</li></ul><p><strong>缺点：</strong></p><ul><li>与业务场景绑定，高耦合，不可公用</li><li>本地消息表与业务数据表在同一个库，占用业务系统资源，量大可能会影响数据库性能</li></ul><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> <strong>总结</strong></h3><p>可以看出 2PC 和 3PC 是一种强一致性事务，不过还是有数据不一致，阻塞等风险，而且只能用在数据库层面。</p><p>而 TCC 是一种补偿性事务思想，适用的范围更广，在业务层面实现，因此对业务的侵入性较大，每一个操作都需要实现对应的三个方法。</p><p>本地消息、事务消息和最大努力通知其实都是最终一致性事务，因此适用于一些对时间不敏感的业务。</p>',165),a=[e];function i(n,g){return t(),r("div",null,a)}const m=p(s,[["render",i],["__file","分布式事务.html.vue"]]);export{m as default};
