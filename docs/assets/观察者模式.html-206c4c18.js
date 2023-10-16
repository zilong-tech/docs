import{_ as n,W as s,X as a,a1 as e}from"./framework-2afc6763.js";const i={},l=e(`<h1 id="观察者模式" tabindex="-1"><a class="header-anchor" href="#观察者模式" aria-hidden="true">#</a> 观察者模式</h1><h3 id="定义" tabindex="-1"><a class="header-anchor" href="#定义" aria-hidden="true">#</a> 定义</h3><p>观察者模式（Observer Pattern）也叫做发布订阅模式（Publish/subscribe）,它是一个在项目中经常使用的模式。定义对象间一种一对多的依赖关系，使得每当一个对象改变状态，则所有依赖于它的对象都会得到通知并被自动更新。通过这种方式来达到减少依赖关系，解耦合的作用。</p><p>我们先来解释一下观察者模式的几个角色名称：</p><p>● Subject被观察者 定义被观察者必须实现的职责，它必须能够动态地增加、取消观察者。它一般是抽象类或者是实现类，仅仅完成作为被观察者必须实现的职责：管理观察者并通知观察者。</p><p>● Observer观察者 观察者接收到消息后，即进行update（更新方法）操作，对接收到的信息进行处理。</p><p>● ConcreteSubject具体的被观察者 定义被观察者自己的业务逻辑，同时定义对哪些事件进行通知。</p><p>● ConcreteObserver具体的观察者 每个观察在接收到消息后的处理反应是不同，各个观察者有自己的处理逻辑。</p><p>一般类图是这样的</p><p><img src="https://pic3.zhimg.com/80/v2-2d23038e476507b0a8675cc9945bbd51_720w.png" alt=""></p><p>在软件系统中经常会有这样的需求：如果一个对象的状态发生改变，某些与它相关的对象也要随之做出相应的变化。比如说邮件系统，你在收到一封邮件的时候经常桌面上会有通知，告诉你有邮件收到了。 <strong>观察者模式特点</strong>：那就是一个对象要时刻监听着另一个对象，只要它的状态一发生改变，自己随之要做出相应的行动。</p><h3 id="简单代码实现" tabindex="-1"><a class="header-anchor" href="#简单代码实现" aria-hidden="true">#</a> 简单代码实现</h3><p>1、被观察者</p><p>被观察者的职责非常简单，就是定义谁能够观察，谁不能观察</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 被观察者
 * <span class="token keyword">@version</span> 1.0.0
 * <span class="token keyword">@date</span> 2021/12/01 16:39
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Subject</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 定义一个观察者数组
     */</span>
    <span class="token keyword">private</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Observer</span><span class="token punctuation">&gt;</span></span> observerList <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 增加一个观察者
     * <span class="token keyword">@param</span> <span class="token parameter">o</span>
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">addObserver</span><span class="token punctuation">(</span><span class="token class-name">Observer</span> o<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>observerList<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>o<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 删除一个观察者
     * <span class="token keyword">@param</span> <span class="token parameter">o</span>
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">delObserver</span><span class="token punctuation">(</span><span class="token class-name">Observer</span> o<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>observerList<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span>o<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 通知所有观察者
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">notifyObservers</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token class-name">Observer</span> o <span class="token operator">:</span><span class="token keyword">this</span><span class="token punctuation">.</span>observerList<span class="token punctuation">)</span><span class="token punctuation">{</span>
            o<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、具体被观察者</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>/**
 * 具体被观察者
 * @version 1.0.0
 * @date 2021/12/01 17:04
 */
public class ConcreteSubject extends Subject{

    //具体的业务
    public void doSomething(){
        /*
         * do something
         */
        super.notifyObservers();
    }

}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3、观察者</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 观察者
 * <span class="token keyword">@version</span> 1.0.0
 * <span class="token keyword">@date</span> 2021/12/01 16:41
 */</span>
<span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">Observer</span> <span class="token punctuation">{</span>

    <span class="token comment">//更新方法</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4、具体观察者</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 具体观察者
 * <span class="token keyword">@version</span> 1.0.0
 * <span class="token keyword">@date</span> 2021/12/01 16:46
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ConcreteObserver</span> <span class="token keyword">implements</span> <span class="token class-name">Observer</span><span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 实现更新方法
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;接收到信息，并进行处理！&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>5、测试类</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Client</span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">//创建一个被观察者</span>
        <span class="token class-name">ConcreteSubject</span> subject <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ConcreteSubject</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//定义一个观察者</span>
        <span class="token class-name">Observer</span> obs<span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ConcreteObserver</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//观察者观察被观察者</span>
        subject<span class="token punctuation">.</span><span class="token function">addObserver</span><span class="token punctuation">(</span>obs<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//观察者开始活动了</span>
        subject<span class="token punctuation">.</span><span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="优点" tabindex="-1"><a class="header-anchor" href="#优点" aria-hidden="true">#</a> 优点</h3><p>1、观察者和被观察者之间是抽象耦合 不管是增加观察者还是被观察者都非常容易扩展，而且在Java中都已经实现的抽象层级的定义，在系统扩展方面更是得心应手。</p><p>2、建立一套触发机制</p><p>根据单一职责原则，每个类的职责是单一的，那么怎么把各个单一的职责串联成真实世界的复杂的逻辑关系呢？观察者模式是一种常用的触发机制，它形成一条触发链，依次对各个观察者的方法进行处理。但同时，这也算是观察者模式一个缺点，由于是链式触发，当观察者比较多的时候，性能问题是比较令人担忧的。</p><h3 id="使用场景" tabindex="-1"><a class="header-anchor" href="#使用场景" aria-hidden="true">#</a> 使用场景</h3><ul><li>关联行为场景。需要注意的是，关联行为是可拆分的，而不是“组合”关系。</li><li>事件多级触发场景。当一个对象在不知道对方具体是如何实现时需要通知其它对象。</li><li>跨系统的消息交换场景，如消息队列的处理机制。</li><li>当一个对象改变需要通知不确定数的对象时</li></ul><h3 id="实际应用" tabindex="-1"><a class="header-anchor" href="#实际应用" aria-hidden="true">#</a> 实际应用</h3><p>发送消息，消息是被观察者，用户是观察者</p><p>1、被观察者</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public interface Subject {

    // 添加订阅关系
    void attach(Observer observer);
    // 移除订阅关系
    void detach(Observer observer);
    // 通知订阅者
    void notifyObservers(String message);

}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、具体被观察者</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public class ConcreteSubject implements Subject{

    // 订阅者容器
    private List&lt;Observer&gt; observers = new ArrayList&lt;Observer&gt;();

    @Override
    public void attach(Observer observer) {
        // 添加订阅关系
        observers.add(observer);
    }

    @Override
    public void detach(Observer observer) {
        // 移除订阅关系
        observers.remove(observer);
    }

    @Override
    public void notifyObservers(String message) {
        // 通知订阅者
        for (Observer observer : observers) {
            observer.update(message);
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3、观察者</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public interface Observer {

    //更新方法
    public void update(String message);

}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4、具体观察者</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public class ConcreteObserver implements Observer{

    @Override
    public void update(String message) {
        // 模拟处理业务逻辑
        System.out.println(&quot;用户收到消息：&quot; + message);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>5、测试</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public class Client {

    public static void main(String[] args) {

        ConcreteSubject subject = new ConcreteSubject();
        // 这里假设是增加新用户
        subject.attach(new ConcreteObserver());
        ConcreteObserver twoObserver = new ConcreteObserver();
        subject.attach(twoObserver);

        // 发送朋友圈动态
        subject.notifyObservers(&quot;第一条消息&quot;);

        subject.detach(twoObserver);
        
        subject.notifyObservers(&quot;第二个消息&quot;);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>运行结果</p><blockquote><p>用户收到消息：第一条消息 用户收到消息：第一条消息 用户收到消息：第二个消息</p></blockquote><p>可以看到，ConcreteSubject 维护了一个订阅关系，在通过notifyObservers 方法通知订阅者之后，观察者都获取到消息从而处理自己的业务逻辑。如果有新的业务添加进来，我们也只需要创建一个新的订阅者，并且维护到observers 容器中即可，也符合我们的开闭原则。</p><p>上面代码依赖关系</p><p><img src="http://img.xxfxpt.top/202112012314871.png" alt=""></p><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h3><p>观察者模式是围绕了<strong>解耦</strong>的思想来写的，观察者模式作为行为型设计模式，主要也是为了不同的业务行为的代码<strong>解耦</strong>。</p><p>合理的使用设计模式可以使代码结构更加清晰，同时还能满足不同的小模块符合单一职责，以及开闭原则，提高代码的可扩展性，维护成本低的特点。</p>`,49),c=[l];function t(d,p){return s(),a("div",null,c)}const o=n(i,[["render",t],["__file","观察者模式.html.vue"]]);export{o as default};
