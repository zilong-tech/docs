import{_ as n,W as s,X as a,a1 as e}from"./framework-2afc6763.js";const i={},l=e(`<p>单例模式是一种常用的软件设计模式，其定义是单例对象的类只能允许一个实例存在。</p><p>许多时候整个系统只需要拥有一个的全局对象，这样有利于我们协调系统整体的行为。比如在某个服务器程序中，该服务器的配置信息存放在一个文件中，这些配置数据由一个单例对象统一读取，然后服务进程中的其他对象再通过这个单例对象获取这些配置信息。这种方式简化了在复杂环境下的配置管理。</p><h3 id="特点" tabindex="-1"><a class="header-anchor" href="#特点" aria-hidden="true">#</a> 特点</h3><ul><li>单例类只有一个实例对象；</li><li>该单例对象必须由单例类自行创建；</li><li>单例类对外提供一个访问该单例的全局访问点。</li></ul><h3 id="单例模式的实现" tabindex="-1"><a class="header-anchor" href="#单例模式的实现" aria-hidden="true">#</a> 单例模式的实现</h3><p><strong>懒汉式单例</strong></p><p>该模式的特点是类加载时没有生成单例，只有当第一次调用 getlnstance 方法时才去创建这个单例。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * Description:懒汉式单例
 *
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">LazySingleton</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * instance = new LazySingleton()这行代码并不是原子性的，也就是说，这行代码需要处理器分为多步才能完成，
     * 其中主要包含两个操作，分配内存空间，引用变量指向内存，由于编译器可能会产生指令重排序的优化操作，
     * 所以两个步骤不能确定实际的先后顺序，假如线程A已经指向了内存，但是并没有分配空间，线程A阻塞，
     * 那么当线程B执行时，会发现Instance已经非空了，那么这时返回的Instance变量实际上还没有分配内存,所以要使用
     * volatile关键字，保证操作可见性
     */</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">volatile</span> <span class="token class-name">LazySingleton</span> instance <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token comment">//private 避免类在外部被实例化</span>
    <span class="token keyword">private</span> <span class="token class-name">LazySingleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 如果线程A调用getInstance()方法时，开始先判断instance是否为空，
     * 如果为空则需要创建实例，但是此时A线程阻塞，B线程也调用了getInstance()方法，也发现Instance为空，
     * 所以需要创建实例，此时A线程继续执行，则又创建了一个实例，A和B线程各创建了一个实例对象，
     * 违背了单例模式的初衷，所以需要实现单例模式的线程同步
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">synchronized</span> <span class="token class-name">LazySingleton</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

        <span class="token keyword">if</span> <span class="token punctuation">(</span>instance <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">LazySingleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> instance<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>


    <span class="token doc-comment comment">/**
     * 采用synchronized关键字来回对方法加锁有很大的性能开销,可以把同步方法改进为对代码块进行加锁
     * double check 保证线程安全 DCL
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span>  <span class="token class-name">LazySingleton</span> <span class="token function">getInstance1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>

        <span class="token comment">//在同步之前先判断Instance是否为空，如果已经是非空了，也就没必要同步了</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span>instance <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token keyword">synchronized</span><span class="token punctuation">(</span><span class="token class-name">LazySingleton</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
                <span class="token keyword">if</span><span class="token punctuation">(</span>instance <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
                    instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">LazySingleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> instance<span class="token punctuation">;</span>

    <span class="token punctuation">}</span>

 <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>饿汉式单例</strong></p><p>该模式的特点是类一旦加载就创建一个单例，保证在调用 getInstance 方法之前单例已经存在了。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * Description:饿汉式单例
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">HungrySingleton</span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">HungrySingleton</span> instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HungrySingleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">HungrySingleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">HungrySingleton</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> instance<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用场景" tabindex="-1"><a class="header-anchor" href="#使用场景" aria-hidden="true">#</a> 使用场景</h3><ul><li>系统只需要一个实例对象，如系统要求提供一个唯一的序列号生成器，或者需要考虑资源消耗太大而只允许创建一个对象。</li><li>客户调用类的单个实例只允许使用一个公共访问点，除了该公共访问点，不能通过其他途径访问该实例。</li><li>需要频繁创建的一些类，使用单例可以降低系统的内存压力，减少 GC。</li><li>某些类创建实例时占用资源较多，或实例化耗时较长，且经常使用。</li><li>某类需要频繁实例化，而创建的对象又频繁被销毁的时候，如多线程的线程池、网络连接池等。</li><li>频繁访问数据库或文件的对象。对于一些控制硬件级别的操作，或者从系统上来讲应当是单一控制逻辑的操作，如果有多个实例，则系统会完全乱套。</li><li>当对象需要被共享的场合。由于单例模式只允许创建一个对象，共享该对象可以节省内存，并加快对象访问速度。如 Web 中的配置对象、数据库的连接池等。</li></ul><h3 id="单例模式的优点" tabindex="-1"><a class="header-anchor" href="#单例模式的优点" aria-hidden="true">#</a> 单例模式的优点</h3><ul><li>单例模式可以保证内存里只有一个实例，减少了内存的开销。</li><li>可以避免对资源的多重占用。</li><li>单例模式设置全局访问点，可以优化和共享资源的访问。</li></ul><h3 id="单例模式的缺点" tabindex="-1"><a class="header-anchor" href="#单例模式的缺点" aria-hidden="true">#</a> 单例模式的缺点</h3><ul><li>单例模式一般没有接口，扩展困难。如果要扩展，则除了修改原来的代码，没有第二种途径，违背开闭原则。</li><li>在并发测试中，单例模式不利于代码调试。在调试过程中，如果单例中的代码没有执行完，也不能模拟生成一个新的对象。</li><li>单例模式的功能代码通常写在一个类中，如果功能设计不合理，则很容易违背单一职责原则。</li></ul>`,17),t=[l];function c(p,o){return s(),a("div",null,t)}const d=n(i,[["render",c],["__file","单例模式 Singleton.html.vue"]]);export{d as default};
