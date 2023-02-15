import{_ as n,W as s,X as a,a1 as e}from"./framework-2afc6763.js";const i={},l=e(`<h1 id="中介者模式" tabindex="-1"><a class="header-anchor" href="#中介者模式" aria-hidden="true">#</a> 中介者模式</h1><h3 id="定义" tabindex="-1"><a class="header-anchor" href="#定义" aria-hidden="true">#</a> 定义</h3><p>用一个中介对象封装一系列的对象交互，中介者使各对象不需要显示地相互作用，从而使其耦合松散，而且可以独立地改变它们之间的交互。</p><p><img src="https://pic3.zhimg.com/80/v2-5f07fc18f50c9f4220cbf8bcf142e27c_720w.png" alt=""></p><p>从类图中看，中介者模式由以下几部分组成：</p><ul><li><p>Mediator 抽象中介者角色</p><p>抽象中介者角色定义统一的接口，用于各同事角色之间的通信。</p></li><li><p>Concrete Mediator 具体中介者角色</p><p>具体中介者角色通过协调各同事角色实现协作行为，因此它必须依赖于各个同事角色。</p></li><li><p>Colleague 抽象同事类</p><p>定义同事类的接口，保存中介者对象，提供同事对象交互的抽象方法，实现所有相互影响的同事类的公共功能。</p><p>每一个同事角色都知道中介者角色，而且与其他的同事角色通信的时候，一定要通过中介者角色协作。每个同事类的行为分为两种：一种是同事本身的行为，比如改变对象本身的状态，处理自己的行为等，这种行为叫做自发行为（Self-Method），与其他的同事类或中介者没有任何的依赖；第二种是必须依赖中介者才能完成的行为，叫做依赖方法（Dep-Method）。</p></li><li><p>Concrete Colleague 同事角色</p></li></ul><p>抽象同事类的实现者，当需要与其他同事对象交互时，由中介者对象负责后续的交互。</p><h2 id="核心思想" tabindex="-1"><a class="header-anchor" href="#核心思想" aria-hidden="true">#</a> 核心思想</h2><p>如果一个系统中对象之间的联系呈现出网状结构，对象之间存在大量多对多关系，将导致关系及其复杂，这些对象称为 &quot;同事对象&quot;。我们可以引入一个中介者对象，使各个同事对象只跟中介者对象打交道，<strong>将同事对象之间的关系行为进行分离和封装</strong>，使之成为一个松耦合的系统。</p><h2 id="本质" tabindex="-1"><a class="header-anchor" href="#本质" aria-hidden="true">#</a> <strong>本质</strong></h2><p>解耦各个同事对象之间的交互关系。每个对象都持有中介者对象的引用，只跟中介者对象打交道。通过中介者对象统一管理这些交互关系，并且还可以在同事对象的逻辑上封装自己的逻辑。</p><h3 id="实现简单的中介者模式" tabindex="-1"><a class="header-anchor" href="#实现简单的中介者模式" aria-hidden="true">#</a> 实现简单的中介者模式</h3><p>模拟同事之间发送、接收消息</p><p>每一个同事角色都知道中介者角色，而且与其它的同事角色通信的时候，一定要通过中介者角色协作。每个同事类的行为分两种：一种是同事本身行为，比如改变对象本身的状态，处理自己的行为等，这种行为叫做自发行为，与其它同事类或者中介者没有任何依赖；第二种是必须依赖中介者才能完成的行为，叫做依赖方法。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 抽象同事类
 * <span class="token keyword">@version</span> 1.0.0
 * <span class="token keyword">@date</span> 2021/11/25 17:31
 */</span>
<span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">Colleague</span> <span class="token punctuation">{</span>

    <span class="token keyword">protected</span> <span class="token class-name">Mediator</span> mediator<span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setMedium</span><span class="token punctuation">(</span><span class="token class-name">Mediator</span> mediator<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>mediator <span class="token operator">=</span> mediator<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">void</span> <span class="token function">receive</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">void</span> <span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>抽象中介者角色定义统一的接口，用于各同事角色之间的通信。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 抽象中介者
 * <span class="token keyword">@version</span> 1.0.0
 * <span class="token keyword">@date</span> 2021/11/25 17:30
 */</span>
<span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">Mediator</span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">void</span> <span class="token function">register</span><span class="token punctuation">(</span><span class="token class-name">Colleague</span> colleague<span class="token punctuation">)</span><span class="token punctuation">;</span>


    <span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">void</span> <span class="token function">relay</span><span class="token punctuation">(</span><span class="token class-name">Colleague</span> colleague<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>具体中介者角色通过协调各同事角色实现协作行为，因此它必须依赖于各个同事角色。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 具体中介者
 * <span class="token keyword">@version</span> 1.0.0
 * <span class="token keyword">@date</span> 2021/11/25 17:46
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ConcreteMediator</span> <span class="token keyword">extends</span> <span class="token class-name">Mediator</span><span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Colleague</span><span class="token punctuation">&gt;</span></span> colleagues <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Colleague</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">register</span><span class="token punctuation">(</span><span class="token class-name">Colleague</span> colleague<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>colleagues<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span>colleague<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            colleagues<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>colleague<span class="token punctuation">)</span><span class="token punctuation">;</span>
            colleague<span class="token punctuation">.</span><span class="token function">setMedium</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">relay</span><span class="token punctuation">(</span><span class="token class-name">Colleague</span> cl<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Colleague</span> ob <span class="token operator">:</span> colleagues<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>ob<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>cl<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                ob<span class="token punctuation">.</span><span class="token function">receive</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同事类必须有中介者，而中介者却可以只有部分同事类。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 具体同事1
 * <span class="token keyword">@version</span> 1.0.0
 * <span class="token keyword">@date</span> 2021/11/25 17:37
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ConcreteColleague1</span> <span class="token keyword">extends</span> <span class="token class-name">Colleague</span><span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">receive</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;具体同事类1收到请求。&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;具体同事类1发出请求。&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//请中介者转发</span>
        mediator<span class="token punctuation">.</span><span class="token function">relay</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 具体同事2
 * <span class="token keyword">@version</span> 1.0.0
 * <span class="token keyword">@date</span> 2021/11/25 18:00
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ConcreteColleague2</span> <span class="token keyword">extends</span> <span class="token class-name">Colleague</span><span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">receive</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;具体同事类2收到请求。&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;具体同事类2发出请求。&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//请中介者转发</span>
        mediator<span class="token punctuation">.</span><span class="token function">relay</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出结果</p><blockquote><p>具体同事类1发出请求。</p><p>具体同事类2收到请求。</p><p>具体同事类2发出请求。 具体同事类1收到请求。</p></blockquote><h3 id="应用场景" tabindex="-1"><a class="header-anchor" href="#应用场景" aria-hidden="true">#</a> 应用场景</h3><ol><li>何时使用</li></ol><ul><li>多个类相互耦合，形成网状结构时</li></ul><ol start="2"><li>方法</li></ol><ul><li><p>将网状结构分离为星型结构</p></li><li><p>系统中对象之间存在比较复杂的引用关系</p></li><li><p>想通过一个中间类来封装多个类的行为，而又不想生成太多的子类</p></li></ul><h3 id="优点" tabindex="-1"><a class="header-anchor" href="#优点" aria-hidden="true">#</a> 优点</h3><p>中介者模式的优点就是减少类间的依赖，把原有的一对多的依赖变成了一对一的依赖，同事类只依赖中介者，减少了依赖，当然同时也降低了类间的耦合。类之间各司其职，符合迪米特法则</p><h3 id="缺点" tabindex="-1"><a class="header-anchor" href="#缺点" aria-hidden="true">#</a> 缺点</h3><p>中介者模式的缺点就是中介者会膨胀得很大，而且逻辑复杂，原本N个对象直接的相互依赖关系转换为中介者和同事类的依赖关系，同事类越多，中介者的逻辑就越复杂。</p><h3 id="应用" tabindex="-1"><a class="header-anchor" href="#应用" aria-hidden="true">#</a> 应用</h3><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 抽象中介者
 */
public interface Mediator {

    void register(String dname,Department d);

    void command(String dname);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 抽象同事类
 */
public interface Department {

    // 做本部门的事情
    void selfAction();
    // 向总经理发出申请
    void outAction();
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 具体中介者  总经理
 */
public class President implements Mediator{

    private Map&lt;String,Department&gt; map = new HashMap    &lt;String , Department&gt;();

    @Override
    public void command(String dname) {
        // 在不改变同事类的情况下，封装一些公共的逻辑
        System.out.println(&quot;执行前-----打印日志信息&quot;);
        map.get(dname).selfAction();
        System.out.println(&quot;执行后-----打印日志信息&quot;);
    }

    @Override
    public void register(String dname, Department d) {
        map.put(dname, d);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 具体同事类 财务
 */
public class Finacial implements Department {

    // 持有中介者(总经理)的引用
    private Mediator m;

    public Finacial(Mediator m) {
        super();
        this.m = m;
        m.register(&quot;finacial&quot;, this);
    }

    @Override
    public void outAction() {
        System.out.println(&quot;汇报工作！没钱了&quot;);
    }

    @Override
    public void selfAction() {
        System.out.println(&quot;管理财务&quot;);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>/**
 * 具体同事类 市场部
 */
public class Market  implements Department {

    // 持有中介者(总经理)的引用
    private Mediator m;

    public Market(Mediator m) {
        super();
        this.m = m;
        m.register(&quot;market&quot;, this);
    }

    @Override
    public void outAction() {
        System.out.println(&quot;汇报项目承接的进度，需要资金支持&quot;);
        // 通过中介者调用同事类，并没有和同事类耦合。
        m.command(&quot;finacial&quot;);
    }

    @Override
    public void selfAction() {
        System.out.println(&quot;谈项目&quot;);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>客户端测试：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public class Client {

    public static void main(String[] args) {
        Mediator m = new President();

        Market market = new Market(m);
        Finacial f = new Finacial(m);

        market.selfAction();
        market.outAction();
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出结果</p><blockquote><p>谈项目 汇报项目承接的进度，需要资金支持 执行前-----打印日志信息 管理财务 执行后-----打印日志信息</p></blockquote><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> <strong>总结</strong></h2><p>中介者模式其实就是<strong>将一个复杂的事分离出来统一管理</strong>，将同事对象之间的关系行为进行分离和封装。</p>`,45),t=[l];function c(p,d){return s(),a("div",null,t)}const u=n(i,[["render",c],["__file","中介者模式.html.vue"]]);export{u as default};
