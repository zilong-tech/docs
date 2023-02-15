import{_ as n,W as s,X as a,a1 as t}from"./framework-2afc6763.js";const p={},e=t(`<p>ZooKeeper应用的开发主要通过Java客户端API去连接和操作ZooKeeper集群。可供选择的Java客户端API有：</p><ul><li><p>ZooKeeper官方的Java客户端API。</p></li><li><p>第三方的Java客户端API，比如Curator。</p></li></ul><p>ZooKeeper官方API功能比较简单，在实际开发过程中比较笨重，一般不推荐使用。 本文主要介绍Curator。</p><h3 id="curator开源客户端" tabindex="-1"><a class="header-anchor" href="#curator开源客户端" aria-hidden="true">#</a> <strong>Curator开源客户端</strong></h3><p>Curator是Netflix公司开源的一套ZooKeeper客户端框架，和ZkClient一样它解决了非常底层的细节开发工作，包括连接、重连、反复注册Watcher的问题以及NodeExistsException 异常等。</p><p>Curator是Apache基金会的顶级项目之一，Curator具有更加完善的文档，另外还提供了一套易用性和可读性更强的Fluent风格的客户端API框架。</p><p>Curator还为ZooKeeper客户端框架提供了一些比较普遍的、开箱即用的、分布式开发用的解决方案，例如Recipe、共享锁服务、Master选举机制和分布式计算器等，帮助开发者避免了“重复造轮子”的无效开发工作。</p><h4 id="引入依赖" tabindex="-1"><a class="header-anchor" href="#引入依赖" aria-hidden="true">#</a> 引入依赖</h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;!-- zookeeper client --&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.apache.zookeeper&lt;/groupId&gt;
    &lt;artifactId&gt;zookeeper&lt;/artifactId&gt;
    &lt;version&gt;3.8.0&lt;/version&gt;
&lt;/dependency&gt;

&lt;!--curator--&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.apache.curator&lt;/groupId&gt;
    &lt;artifactId&gt;curator-recipes&lt;/artifactId&gt;
    &lt;version&gt;5.1.0&lt;/version&gt;
    &lt;exclusions&gt;
        &lt;exclusion&gt;
            &lt;groupId&gt;org.apache.zookeeper&lt;/groupId&gt;
            &lt;artifactId&gt;zookeeper&lt;/artifactId&gt;
        &lt;/exclusion&gt;
    &lt;/exclusions&gt;
&lt;/dependency&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Curator 包含了几个包：</p><p>curator-framework是对ZooKeeper的底层API的一些封装。</p><p>curator-client提供了一些客户端的操作，例如重试策略等。</p><p>curator-recipes封装了一些高级特性，如：Cache事件监听、选举、分布式锁、分布式计数器、分布式Barrier等。</p><p>注意：版本号要和zk的版本对应上，本示例使用zk版本号是3.5.8</p><h4 id="创建客户端实例" tabindex="-1"><a class="header-anchor" href="#创建客户端实例" aria-hidden="true">#</a> 创建客户端实例</h4><p>在使用curator-framework包操作ZooKeeper前，首先要创建一个客户端实例。这是一个 CuratorFramework类型的对象，有两种方法：</p><ul><li>使用工厂类CuratorFrameworkFactory的静态newClient()方法。</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">//创建连接实例</span>
<span class="token keyword">private</span> <span class="token class-name">CuratorFramework</span> client <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token comment">// 重试策略 baseSleepTimeMs：初始的重试等待时间  maxRetries：最多重试次数</span>
<span class="token class-name">RetryPolicy</span> retryPolicy <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ExponentialBackoffRetry</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//创建客户端实例</span>
client <span class="token operator">=</span> <span class="token class-name">CuratorFrameworkFactory</span><span class="token punctuation">.</span><span class="token function">newClient</span><span class="token punctuation">(</span><span class="token constant">CONNECT_STR</span><span class="token punctuation">,</span> retryPolicy<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//启动客户端</span>
client<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>使用工厂类CuratorFrameworkFactory的静态builder构造者方法。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">RetryPolicy</span> retryPolicy <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ExponentialBackoffRetry</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
client <span class="token operator">=</span> <span class="token class-name">CuratorFrameworkFactory</span><span class="token punctuation">.</span><span class="token function">builder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">connectString</span><span class="token punctuation">(</span><span class="token constant">CONNECT_STR</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">retryPolicy</span><span class="token punctuation">(</span>retryPolicy<span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">sessionTimeoutMs</span><span class="token punctuation">(</span>sessionTimeoutMs<span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">connectionTimeoutMs</span><span class="token punctuation">(</span>connectionTimeoutMs<span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
client<span class="token punctuation">.</span><span class="token function">getConnectionStateListenable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">addListener</span><span class="token punctuation">(</span><span class="token punctuation">(</span>client<span class="token punctuation">,</span> newState<span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>newState <span class="token operator">==</span> <span class="token class-name">ConnectionState</span><span class="token punctuation">.</span><span class="token constant">CONNECTED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;连接成功！&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

client<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><p>参数说明：</p><p>connectionString：服务器地址列表，如果是多个地址，那么每个服务器地址列表用逗号分隔。</p><p>retryPolicy：重试策略，当客户端异常退出或者与服务端失去连接的时候，可以通过设置客户端重新连接 ZooKeeper 服务端。而 Curator 提供了 一次重试、多次重试等不同种类的实现方式。在 Curator 内部，可以通过判断服务器返回的 keeperException 的状态代码来判断是否进行重试处理，如果返回的是 OK 表示一切操作都没有问题，而 SYSTEMERROR 表示系统或服务端错误。</p><table><thead><tr><th>策略名称</th><th>描述</th></tr></thead><tbody><tr><td>ExponentialBackoffRetry</td><td>重试一组次数，重试之间的睡眠时间增加</td></tr><tr><td>RetryNTimes</td><td>重试最大次数</td></tr><tr><td>RetryOneTime</td><td>只重试一次</td></tr><tr><td>RetryUntilElapsed</td><td>在给定的时间结束之前重试</td></tr></tbody></table><p>超时时间：Curator 客户端创建过程中，有两个超时时间的设置。一个是 sessionTimeoutMs 会话超时时间，用来设置该条会话在 ZooKeeper 服务端的失效时间。另一个是 connectionTimeoutMs 客户端创建会话的超时时间，用来限制客户端发起一个会话连接到接收 ZooKeeper 服务端应答的时间。sessionTimeoutMs 作用在服务端，而 connectionTimeoutMs 作用在客户端。</p><h4 id="创建节点" tabindex="-1"><a class="header-anchor" href="#创建节点" aria-hidden="true">#</a> 创建节点</h4><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">//创建永久节点</span>
client<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forPath</span><span class="token punctuation">(</span><span class="token string">&quot;/curator&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;curator data&quot;</span><span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">//创建永久有序节点</span>
client<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">withMode</span><span class="token punctuation">(</span><span class="token class-name">CreateMode</span><span class="token punctuation">.</span><span class="token constant">PERSISTENT_SEQUENTIAL</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forPath</span><span class="token punctuation">(</span><span class="token string">&quot;/curator_sequential&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;/curator_sequential data&quot;</span><span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">//创建临时节点</span>
client<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">withMode</span><span class="token punctuation">(</span><span class="token class-name">CreateMode</span><span class="token punctuation">.</span><span class="token constant">EPHEMERAL</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">forPath</span><span class="token punctuation">(</span><span class="token string">&quot;/curator/ephemeral&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;/curator/ephemeral data&quot;</span><span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">//创建临时有序节点</span>
client<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">withMode</span><span class="token punctuation">(</span><span class="token class-name">CreateMode</span><span class="token punctuation">.</span><span class="token constant">EPHEMERAL_SEQUENTIAL</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">forPath</span><span class="token punctuation">(</span><span class="token string">&quot;/curator/ephemeral_path1&quot;</span><span class="token punctuation">,</span><span class="token string">&quot;/curator/ephemeral_path1 data&quot;</span><span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">//创建带层级结构的节点</span>
<span class="token class-name">String</span> path <span class="token operator">=</span> client<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">creatingParentsIfNeeded</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forPath</span><span class="token punctuation">(</span><span class="token string">&quot;/node-parent/sub-node&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 Curator 中，可以使用 create 函数创建数据节点，并通过 withMode 函数指定节点类型（持久化节点，临时节点，顺序节点，临时顺序节点，持久化顺序节点等），默认是持久化节点，之后调用 forPath 函数来指定节点的路径和数据信息。</p><h4 id="检测节点是否存在" tabindex="-1"><a class="header-anchor" href="#检测节点是否存在" aria-hidden="true">#</a> 检测节点是否存在</h4><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">Stat</span> stat1 <span class="token operator">=</span> client<span class="token punctuation">.</span><span class="token function">checkExists</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forPath</span><span class="token punctuation">(</span><span class="token string">&quot;/curator&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">Stat</span> stat2 <span class="token operator">=</span> client<span class="token punctuation">.</span><span class="token function">checkExists</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forPath</span><span class="token punctuation">(</span><span class="token string">&quot;/curator2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="列出子节点" tabindex="-1"><a class="header-anchor" href="#列出子节点" aria-hidden="true">#</a> 列出子节点</h4><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">String</span> pathWithParent <span class="token operator">=</span> <span class="token string">&quot;/node-parent&quot;</span><span class="token punctuation">;</span>
<span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> nodes <span class="token operator">=</span> client<span class="token punctuation">.</span><span class="token function">getChildren</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forPath</span><span class="token punctuation">(</span>pathWithParent<span class="token punctuation">)</span><span class="token punctuation">;</span>
nodes<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span> i<span class="token operator">-&gt;</span> log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;node:{}&quot;</span><span class="token punctuation">,</span>i<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="获取数据" tabindex="-1"><a class="header-anchor" href="#获取数据" aria-hidden="true">#</a> 获取数据</h4><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> bytes <span class="token operator">=</span> client<span class="token punctuation">.</span><span class="token function">getData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forPath</span><span class="token punctuation">(</span><span class="token string">&quot;/curator&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="更新节点" tabindex="-1"><a class="header-anchor" href="#更新节点" aria-hidden="true">#</a> <strong>更新节点</strong></h4><p>通过客户端实例的 setData() 方法更新 ZooKeeper 服务上的数据节点</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>client<span class="token punctuation">.</span><span class="token function">setData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forPath</span><span class="token punctuation">(</span><span class="token string">&quot;/curator&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;changed!&quot;</span><span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="删除节点" tabindex="-1"><a class="header-anchor" href="#删除节点" aria-hidden="true">#</a> <strong>删除节点</strong></h4><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">String</span> pathWithParent <span class="token operator">=</span> <span class="token string">&quot;/node-parent&quot;</span><span class="token punctuation">;</span>
client<span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">guaranteed</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">deletingChildrenIfNeeded</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forPath</span><span class="token punctuation">(</span>pathWithParent<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>guaranteed：主要起到一个保障删除成功的作用，其底层工作方式是：只要该客户端的会话有效，就会在后台持续发起删除请求，直到该数据节点在 ZooKeeper 服务端被删除。</p><p>deletingChildrenIfNeeded：在删除该数据节点的时候会以递归的方式直接删除其子节点，以及子节点的子节点。</p><h4 id="异步接口" tabindex="-1"><a class="header-anchor" href="#异步接口" aria-hidden="true">#</a> <strong>异步接口</strong></h4><p>Curator 引入了BackgroundCallback 接口，用来处理服务器端返回来的信息，这个处理过程是在异步线程中调用，默认在 <strong>EventThread</strong> 中调用，也可以自定义线程池。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">BackgroundCallback</span> callback <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BackgroundCallback</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">processResult</span><span class="token punctuation">(</span><span class="token class-name">CuratorFramework</span> client<span class="token punctuation">,</span> <span class="token class-name">CuratorEvent</span> event<span class="token punctuation">)</span>
            <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>

        <span class="token class-name">KeeperException<span class="token punctuation">.</span>Code</span> code <span class="token operator">=</span> <span class="token class-name">KeeperException<span class="token punctuation">.</span>Code</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>event<span class="token punctuation">.</span><span class="token function">getResultCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;path:{},data:{}&quot;</span> <span class="token punctuation">,</span> event<span class="token punctuation">.</span><span class="token function">getPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>


    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>


client<span class="token punctuation">.</span><span class="token function">setData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">inBackground</span><span class="token punctuation">(</span>callback<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forPath</span><span class="token punctuation">(</span><span class="token constant">ZK_NODE</span><span class="token punctuation">,</span><span class="token string">&quot;/curator modified data with Callback&quot;</span><span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>


<span class="token comment">//为了防止单元测试结束从而看不到异步执行结果</span>
<span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">20000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二种监听方式：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>    <span class="token class-name">String</span> <span class="token constant">ZK_NODE</span><span class="token operator">=</span><span class="token string">&quot;/node-parent&quot;</span><span class="token punctuation">;</span>
    <span class="token comment">//创建监听器</span>
    <span class="token class-name">CuratorListener</span> listener <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">CuratorListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">eventReceived</span><span class="token punctuation">(</span><span class="token class-name">CuratorFramework</span> client<span class="token punctuation">,</span> <span class="token class-name">CuratorEvent</span> event<span class="token punctuation">)</span>
                <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
            log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;path:{}&quot;</span> <span class="token punctuation">,</span> event<span class="token punctuation">.</span><span class="token function">getPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>

    <span class="token comment">//添加监听器</span>
    client<span class="token punctuation">.</span><span class="token function">getCuratorListenable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">addListener</span><span class="token punctuation">(</span>listener<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">//异步设置某个节点数据</span>
    client<span class="token punctuation">.</span><span class="token function">setData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">inBackground</span><span class="token punctuation">(</span><span class="token punctuation">(</span>client<span class="token punctuation">,</span> event<span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">{</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot; background: {}&quot;</span><span class="token punctuation">,</span> event<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forPath</span><span class="token punctuation">(</span><span class="token constant">ZK_NODE</span><span class="token punctuation">,</span><span class="token string">&quot;data&quot;</span><span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>指定线程池：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">ExecutorService</span> executorService <span class="token operator">=</span> <span class="token class-name">Executors</span><span class="token punctuation">.</span><span class="token function">newSingleThreadExecutor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">String</span> <span class="token constant">ZK_NODE</span><span class="token operator">=</span><span class="token string">&quot;/node-parent&quot;</span><span class="token punctuation">;</span>
client<span class="token punctuation">.</span><span class="token function">setData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">inBackground</span><span class="token punctuation">(</span><span class="token punctuation">(</span>client<span class="token punctuation">,</span> event<span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">{</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot; background: {}&quot;</span><span class="token punctuation">,</span> event<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>executorService<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forPath</span><span class="token punctuation">(</span><span class="token constant">ZK_NODE</span><span class="token punctuation">,</span><span class="token string">&quot;test&quot;</span><span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,47),o=[e];function c(i,u){return s(),a("div",null,o)}const r=n(p,[["render",c],["__file","Java整合Zookeeper实战.html.vue"]]);export{r as default};
