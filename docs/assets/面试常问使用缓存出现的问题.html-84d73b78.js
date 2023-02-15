import{_ as n,W as t,X as p,Y as r,Z as e,a0 as s,a1 as a,F as c}from"./framework-2afc6763.js";const d={},o=a('<h2 id="缓存和数据库一致性解决方案" tabindex="-1"><a class="header-anchor" href="#缓存和数据库一致性解决方案" aria-hidden="true">#</a> 缓存和数据库一致性解决方案</h2><h2 id="需求起因" tabindex="-1"><a class="header-anchor" href="#需求起因" aria-hidden="true">#</a> <strong>需求起因</strong></h2><p>在高并发的业务场景下，数据库大多数情况都是用户并发访问最薄弱的环节。所以，就需要使用redis做一个缓冲操作，让请求先访问到redis，而不是直接访问MySQL等数据库。</p><p><img src="https://pic2.zhimg.com/80/v2-a5af5c1f96e94360e33720cf40037a49_720w.jpg" alt="img"></p>',4),h={href:"https://www.zhihu.com/search?q=Redis%E7%BC%93%E5%AD%98&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22article%22%2C%22sourceId%22%3A348148967%7D",target:"_blank",rel:"noopener noreferrer"},l=a('<p><img src="https://pic3.zhimg.com/80/v2-71df0305b4ff6ac7054d503e73657e76_720w.jpg" alt="img"></p><p>读取缓存步骤一般没有什么问题，但是一旦涉及到数据更新：数据库和缓存更新，就容易出现<strong>缓存(Redis)和数据库（MySQL）间的数据一致性问题</strong>。</p><h2 id="更新缓存" tabindex="-1"><a class="header-anchor" href="#更新缓存" aria-hidden="true">#</a> 更新缓存</h2><p>当我们对数据进行修改的时候，到底是先删缓存，还是先写数据库？</p><p>1、先更新缓存，再更新 DB</p><p>这个方案一般不考虑。原因是更新缓存成功，更新数据库出现异常了， 导致缓存数据与数据库数据完全不一致，而且很难察觉，因为缓存中的数据一直都存在。</p><p>2、先更新 DB，再更新缓存</p><p>这种方案会出现的问题：数据库更新成功了，缓存更新失败，同样会出现数据不一致问题</p><p>3、先删除缓存，后更新 DB</p><p>该方案也会出问题，具体出现的原因如下。</p><p>此时来了两个请求，请求 A（更新操作） 和请求 B（查询操作）</p><p>请求 A 会先删除 Redis 中的数据，然后去数据库进行更新操作；</p><p>此时请求 B 看到 Redis 中的数据时空的，会去数据库中查询该值，补录到Redis 中；</p><p>但是此时请求 A 并没有更新成功，或者事务还未提交，请求 B 去数据库查询得到旧值；</p><p><img src="https://pica.zhimg.com/80/v2-7aa311db30e2ddb9ee2b19bf8ea3e784_720w.png" alt="img"></p><p>4、先更新 DB，后删除缓存</p>',16),u={href:"https://www.zhihu.com/search?q=%E6%95%B0%E6%8D%AE%E5%BA%93&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22article%22%2C%22sourceId%22%3A348148967%7D",target:"_blank",rel:"noopener noreferrer"},g=r("p",null,"最经典的缓存+数据库读写的模式",-1),_=r("p",null,"为什么是删除缓存，而不是更新缓存？",-1),m=r("ul",null,[r("li",null,"懒加载")],-1),b={href:"https://www.zhihu.com/search?q=%E7%BC%93%E5%AD%98%E6%9B%B4%E6%96%B0&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22article%22%2C%22sourceId%22%3A348148967%7D",target:"_blank",rel:"noopener noreferrer"},v=a('<ul><li>并发问题：</li></ul><p>同时有请求 A 和请求 B 进行更新操作，那么会出现</p><p>（1）线程 A 更新了数据库</p><p>（2）线程 B 更新了数据库</p><p>（3）线程 B 更新了缓存</p><p>（4）线程 A 更新了缓存</p><p><img src="https://pic3.zhimg.com/80/v2-4b0f33e2917a16b6f05a52fc9aa44f85_720w.png" alt="img"></p><p>这就出现请求 A 更新缓存应该比请求 B 更新缓存早才对，但是因为网络等原因，B 却比 A 更早更新了缓存。这就导致了脏数据，因此不考虑。</p><p><strong>Cache Aside Pattern 的缺陷：</strong></p><p><strong>缺陷1：首次请求数据一定不在 cache 的问题</strong></p><p>解决办法：可以将热点数据可以提前放入cache 中。</p><p><strong>缺陷2：写操作比较频繁的话导致cache中的数据会被频繁被删除，这样会影响缓存命中率 。</strong></p><p>解决办法：</p><ul><li>数据库和缓存数据强一致场景 ：更新DB的时候同样更新cache，不过我们需要加一个锁/分布式锁来保证更新cache的时候不存在线程安全问题。</li><li>可以短暂地允许数据库和缓存数据不一致的场景 ：更新DB的时候同样更新cache，但是给缓存加一个比较短的过期时间，这样的话就可以保证即使数据不一致的话影响也比较小。</li></ul><p><strong>缺陷3：数据不一致</strong></p><p>理论上来说还是可能会出现数据不一致性的问题，不过概率非常小，因为缓存的写入速度是比数据库的写入速度快很多！</p><p>（1）缓存刚好失效</p><p>（2）请求 A 查询数据库，得一个旧值</p><p>（3）请求 B 将新值写入数据库</p><p>（4）请求 B 删除缓存</p><p>（5）请求 A 将查到的旧值写入缓存</p><img src="https://gitee.com/zysspace/pic/raw/master/images/202112032309047.png" style="zoom:50%;"><p>解决方案：异步更新缓存(基于订阅binlog的同步机制)</p><img src="https://gitee.com/zysspace/pic/raw/master/images/202112032311427.png" style="zoom:67%;"><p><strong>技术整体思路：</strong></p><p>MySQL binlog增量订阅消费+消息队列+增量数据更新到redis</p><ul><li><strong>读Redis</strong>：热数据基本都在Redis</li><li><strong>写MySQL</strong>:增删改都是操作MySQL</li><li><strong>更新Redis数据</strong>：订阅MySQL的binlog日志，来更新到Redis</li></ul><p>1）把全量数据写入到缓存中</p><p>2）订阅binlog日志，推送到消息队列，消费端更新缓存</p><p>可以使用canal(阿里的一款开源框架)，对MySQL的binlog进行订阅。</p><h2 id="缓存与数据库双写不一致" tabindex="-1"><a class="header-anchor" href="#缓存与数据库双写不一致" aria-hidden="true">#</a> <strong>缓存与数据库双写不一致</strong></h2><p><img src="https://gitee.com/zysspace/pic/raw/master/images/202203232106542.png" alt=""></p><h2 id="缓存更新的设计模式" tabindex="-1"><a class="header-anchor" href="#缓存更新的设计模式" aria-hidden="true">#</a> <strong>缓存更新的设计模式</strong></h2><p>SoR（system-of-record）：记录系统，或者可以叫做数据源，即实际存储原始数据的系统。</p><p>Cache：缓存，是SoR的快照数据，Cache的访问速度比SoR要快，放入Cache的目的是提升访问速度，减少回源到SoR的次数。</p><p>回源：即回到数据源头获取数据，Cache没有命中时，需要从SoR读取数据，这叫做回源。</p><p><strong>1、Cache Aside Pattern 旁路缓存</strong></p><p>失效：应用程序先从 cache 取数据，没有得到，则从数据库中取数据，成功 后，放到缓存中。</p><p>命中：应用程序从 cache 中取数据，取到后返回。</p><p>更新：先把数据存到数据库中，成功后，再让缓存失效。</p><p>这种模式下，没有了删除 cache 数据的操作了，而是先更新了数据库中的数据，此时，缓存依然有效，所以，并发的查询操作拿的是没有更新的数据，但是，更新操作马上让缓存的失效了，后续的查询操作再把数据从数据库中拉出来不会存在后续的查询操作一直都在取老的数据。</p><p><strong>Cache-As-SoR</strong></p><p>Cache-As-SoR即把Cache看作为SoR，所有操作都是对Cache进行，然后Cache再委托给SoR进行真实的读/写。即业务代码中只看到Cache的操作，看不到关于SoR相关的代码。有三种实现：read-through、write-through、write-behind。</p><ul><li>Read-Through</li></ul><p>Read-Through，业务代码首先调用Cache，如果Cache不命中由Cache回源到SoR，而不是业务代码（即由Cache读SoR）。使用Read-Through模式，需要配置一个CacheLoader组件用来回源到SoR加载源数据。</p><ul><li>Write-Through</li></ul><p>Write-Through，被称为穿透写模式/直写模式——业务代码首先调用Cache写（新增/修改）数据，然后由Cache负责写缓存和写SoR，而不是由业务代码。使用Write-Through模式需要配置一个CacheWriter组件用来回写SoR。</p><ul><li>Write-Behind</li></ul><p>Write-Behind，也叫Write-Back，我们称之为回写模式。不同于Write-Through是同步写SoR和Cache，Write-Behind是异步写。异步之后可以实现批量写、合并写、延时和限流。</p><h2 id="缓存雪崩" tabindex="-1"><a class="header-anchor" href="#缓存雪崩" aria-hidden="true">#</a> <strong>缓存雪崩</strong></h2><p>缓存雪崩指的是在某一个时刻大流量怼到系统， 这时候系统出现了大量的 key同时失效， 这样导致了大量的请求到了数据库层， 导致数据库奔溃从而导致整个系统雪崩的现象。</p><p>解决方案：</p><p>预防和解决缓存雪崩问题,可以从以下三个方面进行着手。</p><p>1）保证缓存层服务高可用性。和飞机都有多个引擎一样，如果缓存层设计成高可用的,即使个别节点、个别机器、甚至是机房宕掉，依然可以提供服务， Redis Sentinel 和 Redis Cluster 都实现了高可用。</p><p>2）依赖隔离组件为后端限流并降级。无论是缓存层还是存储层都会有出错的概率，可以将它们视同为资源。作为并发量较大的系统，假如有一个资源不可 用，可能会造成线程全部阻塞(hang)在这个资源上，造成整个系统不可用。降级机制在高并发系统中是非常普遍的。</p><p>3）提前演练。在项目上线前，演练缓存层宕掉后，应用以及后端的负载情况以及可能出现的问题,在此基础上做一些预案设定。</p><p>4）将缓存失效时间分散开，比如我们可以在原有的失效时间基础上增加一 个随机值，比如 1-5 分钟随机，这样每一个缓存的过期时间的重复率就会降低，就很难引发集体失效的事件。 缓存雪崩和缓存击穿的区别在于缓存击穿针对某一 key 缓存，缓存雪崩则是很多 key。</p><h2 id="缓存穿透" tabindex="-1"><a class="header-anchor" href="#缓存穿透" aria-hidden="true">#</a> <strong>缓存穿透</strong></h2><p>缓存穿透更多的是一种恶意访问， 黑客故意大量访问一个 redis 里面没有， 数据库也没有的数据， 这样同样会导致大量请求落到数据库， 所以访问数据库加锁是必要的。 但是这里又有一个问题， 恶意访问会占用 redis 的连接资源， 所以这里需要使用拦截手段， 把请求拦截在 redis 之外， 比如用布隆过滤器， 比如用本地缓存都可以有效拦截对 redis 的恶意访问。</p><p>解决方案：</p><p>1、使用布隆过滤器提前拦截</p><p>2、如果是 redis 没有， 数据库也没有的情况， 可以把一个 null 字符串存储到 redis 并且存一份到本地缓存， 存本地缓存的目的也是为了减少对redis 的访问压力。</p><p>3、参数校验，对接口入参参数进行校验</p><h2 id="缓存击穿" tabindex="-1"><a class="header-anchor" href="#缓存击穿" aria-hidden="true">#</a> 缓存击穿</h2><p>在某一个时刻大并发下请求某一个 key， 而这个 key 恰好在这个时候失效了， 这时候大量的请求会怼到数据库从而导致系统奔溃。</p><p>解决方案：</p><p>缓存要做预热， 且缓存的失效时间要大于业务生命周期时间， 比如一个秒杀业务， 1 小时内秒完， 那么这个 key 的失效时间要大于 1 小时。</p><p>请求数据库的逻辑需要加锁， 避免大量请求落到数据库层。 可能这个锁的逻辑块永远不会执行， 因为缓存是存在在 redis 的， 但是代码要有健壮性考虑。</p><p><strong>使用互斥锁(mutex key)</strong></p>',69),y={href:"https://www.zhihu.com/search?q=mutex+key&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra=%7B%22sourceType%22%3A%22article%22%2C%22sourceId%22%3A348148967%7D",target:"_blank",rel:"noopener noreferrer"},f=a(`<p>伪代码：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>       public String get(key) {
            String value = redis.get(key);
            if (value == null) { //代表缓存值过期
                //设置 3min 的超时，防止 del 操作失败的时候，下次缓存过期一直不能 load  db
                //代表设置成功
                if (redis.setnx(key_mutex, 1, 3 * 60) == 1) {
                    value = db.get(key);
                    redis.set(key, value, expire_secs);
                    redis.del(key_mutex);
                } else {
                    //这个时候代表同时候的其他线程已经 load db 并回设到缓存了，这时候重试获取缓存值即可
                    sleep(50);
                    get(key); //重试
                }
            } else {
                return value;
            }
        }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>永远不过期</strong></p><p>这里的“永远不过期”包含两层意思：</p><p>(1) 从 redis 上看，确实没有设置过期时间，这就保证了，不会出现热点key 过期问题，也就是“物理”不过期。</p><p>(2) 从功能上看，如果不过期，那不就成静态的了吗？所以我们把过期时间存在 key 对应的 value 里，如果发现要过期了，通过一个后台的异步线程进行缓存的构建，也就是“逻辑”过期 从实战看，这种方法对于性能非常友好，唯一不足的就是构建缓存时候，其余线程(非构建缓存的线程)可能访问的是老数据，但是对于一般的互联网功能来说这个还是可以忍受。</p>`,6);function B(R,x){const i=c("ExternalLinkIcon");return t(),p("div",null,[o,r("p",null,[e("这个业务场景，主要是解决读数据从"),r("a",h,[e("Redis缓存"),s(i)]),e("，一般都是按照下图的流程来进行业务操作。")]),l,r("p",null,[e("这种方式，被称为 Cache Aside Pattern，读的时候，先读缓存，缓存没有的 话，就读"),r("a",u,[e("数据库"),s(i)]),e("，然后取出数据后放入缓存，同时返回响应。更新的时候，先更新数据库，然后再删除缓存。")]),g,_,m,r("p",null,[e("更新缓存成本大，但是缓存利用率低，比如：一个缓存涉及的表的字段，在 1 分钟内就修改了 20 次，或者是 100 次，那么"),r("a",b,[e("缓存更新"),s(i)]),e(" 20 次、100 次；但是这个缓存在 1 分钟内只被读取了 1 次，有大量的冷数据。不要每次都重新做复杂的计算，不管它会不会用到，而是让它到需要被使用的时候再重新计算。")]),v,r("p",null,[e("业界比较常用的做法，是使用 mutex。简单地来说，就是在缓存失效的时候 （判断拿出来的值为空），不是立即去 load db，而是先使用缓存工具的某些带成功操作返回值的操作（比如 Redis 的 SETNX 或者 Memcache 的 ADD）去 set 一个 "),r("a",y,[e("mutex key"),s(i)]),e("，当操作返回成功时，再进行 load db 的操作并回设缓存；否则，就重试整个 get 缓存的方法。")]),f])}const A=n(d,[["render",B],["__file","面试常问使用缓存出现的问题.html.vue"]]);export{A as default};
