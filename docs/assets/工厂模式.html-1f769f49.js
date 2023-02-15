import{_ as n,W as s,X as a,a1 as e}from"./framework-2afc6763.js";const t={},c=e(`<h3 id="工厂模式的定义" tabindex="-1"><a class="header-anchor" href="#工厂模式的定义" aria-hidden="true">#</a> 工厂模式的定义</h3><p>定义一个创建产品对象的工厂接口，将产品对象的实际创建工作推迟到具体子工厂类当中。这满足创建型模式中所要求的“创建与使用相分离”的特点。</p><p>把被创建的对象称为“产品”，把创建产品的对象称为“工厂”。</p><p>按实际业务场景划分，工厂模式有 3 种不同的实现方式，分别是简单工厂模式、工厂方法模式和抽象工厂模式。</p><h3 id="简单工厂模式" tabindex="-1"><a class="header-anchor" href="#简单工厂模式" aria-hidden="true">#</a> <strong>简单工厂模式</strong></h3><p>在简单工厂模式中创建实例的方法通常为静态（static）方法，因此简单工厂模式（Simple Factory Pattern）又叫作静态工厂方法模式（Static Factory Method Pattern）。</p><p>用一个专业类（工厂类）来负责一种产品的对象创建，此模式，不属于23种设计模式，但它是工厂模式的基础。</p><p>简单工厂模式的主要角色如下：</p><ul><li>简单工厂（SimpleFactory）：是简单工厂模式的核心，负责实现创建所有实例的内部逻辑。工厂类的创建产品类的方法可以被外界直接调用，创建所需的产品对象。</li><li>抽象产品（Product）：是简单工厂创建的所有对象的父类，负责描述所有实例共有的公共接口。</li><li>具体产品（ConcreteProduct）：是简单工厂模式的创建目标。</li></ul><p><img src="https://pic1.zhimg.com/v2-79f1a9b3357db123c75254ba428d6634_b.png" alt="img"></p><p><img src="https://pic2.zhimg.com/v2-fcb22601b2333b6025f29a6abce56849_b.png" alt="img"></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class Client {
    public static void main(String[] args) {
    }

    //抽象产品
    public interface Product {
        void show();
    }

    //具体产品：ProductA
    static class ConcreteProduct1 implements Product {
        public void show() {
            System.out.println(&quot;具体产品1显示...&quot;);
        }
    }

    //具体产品：ProductB
    static class ConcreteProduct2 implements Product {
        public void show() {
            System.out.println(&quot;具体产品2显示...&quot;);
        }
    }

    final class Const {
        static final int PRODUCT_A = 0;
        static final int PRODUCT_B = 1;
        static final int PRODUCT_C = 2;
    }

    static class SimpleFactory {
        public static Product makeProduct(int kind) {
            switch (kind) {
                case Const.PRODUCT_A:
                    return new ConcreteProduct1();
                case Const.PRODUCT_B:
                    return new ConcreteProduct2();
            }
            return null;
        }
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>弊端：</p><p>随着产品类不断增加，StaticFactory类不断修改，方法扩展极为庞大。</p><p>不符合单一职责原则：一个类负责了各类水果的创建。</p><p>不符合开闭原则：扩展品类时，需要修改已有代码。</p><h3 id="工厂方法模式" tabindex="-1"><a class="header-anchor" href="#工厂方法模式" aria-hidden="true">#</a> <strong>工厂方法模式</strong></h3><h4 id="定义" tabindex="-1"><a class="header-anchor" href="#定义" aria-hidden="true">#</a> 定义</h4><p>定义一个用于创建对象的接口，让子类决定实例化哪一个类。工厂方法使一个类的实例化延迟到其子类。</p><p>工厂方法模式由抽象工厂、具体工厂、抽象产品和具体产品等4个要素构成。</p><p>将工厂类抽象出一个接口，对象的创建方法延迟到工厂子类去实现。扩展新的品类时，不要修改已有代码。</p><p>工厂方法模式是对简单工厂模式的进一步抽象化，其好处是可以使系统在不修改原来代码的情况下引进新的产品，即满足开闭原则。</p><p>工厂方法模式的主要角色如下。</p><ol><li>抽象工厂（Creator）：提供了创建产品的接口，调用者通过它访问具体工厂的工厂方法 newProduct() 来创建产品。</li><li>具体工厂（ConcreteCreator）：主要是实现抽象工厂中的抽象方法，完成具体产品的创建。</li><li>抽象产品（Product）：定义了产品的规范，描述了产品的主要特性和功能。</li><li>具体产品（ConcreteProduct）：实现了抽象产品角色所定义的接口，由具体工厂来创建，它同具体工厂之间一一对应</li></ol><p>通用类图：</p><img src="https://gitee.com/zysspace/pic/raw/master/images/202112212228164.png" alt="image-20211221222753177" style="zoom:150%;"><p>1、为了弥补这种扩展性。在工厂方法模式中，将工厂方法抽象出来，成单独接口。</p><p>2、工厂类结构与产品类结构一一对应，每一种产品都对应一个工厂子类。</p><p>3、当新增一个产品类型时，新加对应的工厂子类即可，不再需要修改既有类。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// 抽象产品类</span>
<span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">Product</span> <span class="token punctuation">{</span>

    <span class="token comment">//产品类的公共方法</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">method1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token comment">//业务逻辑处理</span>
    <span class="token punctuation">}</span>
    <span class="token comment">//抽象方法</span>
    <span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">void</span> <span class="token function">method2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// 具体产品1</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ConcreteProduct1</span> <span class="token keyword">extends</span> <span class="token class-name">Product</span><span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">method2</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;创建产品1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ConcreteProduct2</span> <span class="token keyword">extends</span> <span class="token class-name">Product</span><span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">method2</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;创建产品2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>抽象工厂类</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">Creator</span> <span class="token punctuation">{</span>

    <span class="token comment">/*
     * 创建一个产品对象，其输入参数类型可以自行设置
     * 通常为String、Enum、Class等，当然也可以为空
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span> <span class="token keyword">extends</span> <span class="token class-name">Product</span><span class="token punctuation">&gt;</span></span> <span class="token class-name">T</span> <span class="token function">createProduct</span><span class="token punctuation">(</span><span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> c<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>具体工厂类</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ConcreteCreator</span> <span class="token keyword">extends</span> <span class="token class-name">Creator</span><span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span> <span class="token keyword">extends</span> <span class="token class-name">Product</span><span class="token punctuation">&gt;</span></span> <span class="token class-name">T</span> <span class="token function">createProduct</span><span class="token punctuation">(</span><span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> c<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Product</span> product<span class="token operator">=</span><span class="token keyword">null</span><span class="token punctuation">;</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            product <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Product</span><span class="token punctuation">)</span><span class="token class-name">Class</span><span class="token punctuation">.</span><span class="token function">forName</span><span class="token punctuation">(</span>c<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">newInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">//异常处理</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token class-name">T</span><span class="token punctuation">)</span>product<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试类</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Client</span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Creator</span> creator <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ConcreteCreator</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Product</span> product <span class="token operator">=</span> creator<span class="token punctuation">.</span><span class="token function">createProduct</span><span class="token punctuation">(</span><span class="token class-name">ConcreteProduct1</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        product<span class="token punctuation">.</span><span class="token function">method2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出结果：</p><blockquote><p>创建产品1</p></blockquote><h4 id="缺点" tabindex="-1"><a class="header-anchor" href="#缺点" aria-hidden="true">#</a> 缺点</h4><p>同种类称为同等级，也就是说：工厂方法模式只考虑生产同等级的产品，但是在现实生活中许多工厂是综合型的工厂，能生产多等级（种类） 的产品，如农场里既养动物又种植物，电器厂既生产电视机又生产洗衣机或空调，大学既有软件专业又有生物专业等。</p><h4 id="优点" tabindex="-1"><a class="header-anchor" href="#优点" aria-hidden="true">#</a> 优点</h4><p>良好的封装性，代码结构清晰。</p><p>工厂方法模式的扩展性非常优秀。在增加产品类的情况下，只要适当地修改具体的工厂类或扩展一个工厂类，就可以完成产品创建。</p><p>屏蔽产品类，产品类的实现如何变化，调用者都不需要关心，它只需要关心产品的接口，只要接口保持不变，系统中的上层模块就不要发生变化。</p><p>厂方法模式是典型的解耦框架。高层模块值需要知道产品的抽象类，其他的实现类都不用关心，符合迪米特法则。</p><h4 id="使用场景" tabindex="-1"><a class="header-anchor" href="#使用场景" aria-hidden="true">#</a> 使用场景</h4><p>需要灵活的、可扩展的框架时，可以考虑采用工厂方法模式。</p><h3 id="抽象工厂模式" tabindex="-1"><a class="header-anchor" href="#抽象工厂模式" aria-hidden="true">#</a> <strong>抽象工厂模式</strong></h3><p>抽象工厂（AbstractFactory）模式的定义：是一种为访问类提供一个创建一组相关或相互依赖对象的接口，且访问类无须指定所要产品的具体类就能得到同族的不同等级的产品的模式结构。</p><p>抽象工厂模式将考虑多等级产品的生产，将同一个具体工厂所生产的位于不同等级的一组产品称为一个产品族</p><p>抽象工厂模式是工厂方法模式的升级版本，工厂方法模式只生产一个等级的产品，而抽象工厂模式可生产多个等级的产品。</p><p>使用抽象工厂模式一般要满足以下条件。</p><ul><li>系统中有多个产品族，每个具体工厂创建同一族但属于不同等级结构的产品。</li><li>系统一次只可能消费其中某一族产品，即同族的产品一起使用。</li></ul><p>抽象工厂模式同工厂方法模式一样，也是由抽象工厂、具体工厂、抽象产品和具体产品等 4 个要素构成，但抽象工厂中方法个数不同，抽象产品的个数也不同。现在我们来分析其基本结构和实现方法。</p><p>抽象工厂模式的主要角色如下。</p><ol><li>抽象工厂（Abstract Factory）：提供了创建产品的接口，它包含多个创建产品的方法 newProduct()，可以创建多个不同等级的产品。</li><li>具体工厂（Concrete Factory）：主要是实现抽象工厂中的多个抽象方法，完成具体产品的创建。</li><li>抽象产品（Product）：定义了产品的规范，描述了产品的主要特性和功能，抽象工厂模式有多个抽象产品。</li><li>具体产品（ConcreteProduct）：实现了抽象产品角色所定义的接口，由具体工厂来创建，它同具体工厂之间是多对一的关系。</li></ol><p>通用类图：</p><p><img src="https://gitee.com/zysspace/pic/raw/master/images/202112212259703.png" alt="image-20211221225900173"></p><p>抽象产品类</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span>   <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">AbstractProductA</span> <span class="token punctuation">{</span>

    <span class="token comment">//每个产品共有的方法</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">shareMethod</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token punctuation">}</span>
    <span class="token comment">//每个产品相同方法，不同实现</span>
    <span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">void</span> <span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token punctuation">}</span>


<span class="token keyword">public</span>   <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">AbstractProductB</span> <span class="token punctuation">{</span>

    <span class="token comment">//每个产品共有的方法</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">shareMethod</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token punctuation">}</span>
    <span class="token comment">//每个产品相同方法，不同实现</span>
    <span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">void</span> <span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>具体产品类</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ProductA1</span> <span class="token keyword">extends</span> <span class="token class-name">AbstractProductA</span><span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;产品A1的实现方法&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ProductA2</span> <span class="token keyword">extends</span> <span class="token class-name">AbstractProductA</span><span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;产品A2的实现方法&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>抽象工厂类</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">AbstractCreator</span> <span class="token punctuation">{</span>

    <span class="token comment">//创建A产品家族</span>
    <span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token class-name">AbstractProductA</span> <span class="token function">createProductA</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">//创建B产品家族</span>
    <span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token class-name">AbstractProductB</span> <span class="token function">createProductB</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>具体工厂类：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class Creator1 extends AbstractCreator{

    //只生产产品等级为1的A产品
    public AbstractProductA createProductA() {
        return new ProductA1();
    }
    //只生产产品等级为1的B产品
    public AbstractProductB createProductB() {
        return new ProductB1();
    }

}
public class Creator2 extends AbstractCreator{

    //只生产产品等级为1的A产品
    public AbstractProductA createProductA() {
        return new ProductA1();
    }
    //只生产产品等级为1的B产品
    public AbstractProductB createProductB() {
        return new ProductB1();
    }

}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有M个产品等级就应该有M个实现工厂类，在每个实现工厂中，实现不同产品族的生产任务。</p><p>测试类</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Client</span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">//定义出两个工厂</span>
        <span class="token class-name">AbstractCreator</span> creator1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Creator1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">AbstractCreator</span> creator2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Creator2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//产生A1对象</span>
        <span class="token class-name">AbstractProductA</span> a1 <span class="token operator">=</span>  creator1<span class="token punctuation">.</span><span class="token function">createProductA</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        a1<span class="token punctuation">.</span><span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//产生A2对象</span>
        <span class="token class-name">AbstractProductA</span> a2 <span class="token operator">=</span> creator2<span class="token punctuation">.</span><span class="token function">createProductA</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        a2<span class="token punctuation">.</span><span class="token function">doSomething</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//产生B1对象</span>
        <span class="token class-name">AbstractProductB</span> b1 <span class="token operator">=</span> creator1<span class="token punctuation">.</span><span class="token function">createProductB</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//产生B2对象</span>
        <span class="token class-name">AbstractProductB</span> b2 <span class="token operator">=</span> creator2<span class="token punctuation">.</span><span class="token function">createProductB</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在测试类中，没有任何一个方法与产品实现类有关系，对于一个产品来说，我们只要知道它的工厂方法就可以直接产生一个产品对象，无须关心它的实现类。</p><h4 id="优点-1" tabindex="-1"><a class="header-anchor" href="#优点-1" aria-hidden="true">#</a> 优点</h4><p>抽象工厂模式除了具有工厂方法模式的优点外，其他主要优点如下。</p><ul><li>可以在类的内部对产品族中相关联的多等级产品共同管理，而不必专门引入多个新的类来进行管理。</li><li>当需要产品族时，抽象工厂可以保证客户端始终只使用同一个产品的产品组。</li><li>抽象工厂增强了程序的可扩展性，当增加一个新的产品族时，不需要修改原代码，满足开闭原则。</li><li>封装性，每个产品的实现类不是高层模块要关心的，它要关心的是什么？是接口，是抽象，它不关心对象是如何创建出来，这由谁负责呢？工厂类，只要知道工厂类是谁，我就能创建出一个需要的对象。</li></ul><h4 id="缺点-1" tabindex="-1"><a class="header-anchor" href="#缺点-1" aria-hidden="true">#</a> 缺点</h4><p>抽象工厂模式的最大缺点就是产品族扩展非常困难，比如想增加一个产品C，抽象类、实现都要修改，违反了开闭原则。</p><h4 id="使用场景-1" tabindex="-1"><a class="header-anchor" href="#使用场景-1" aria-hidden="true">#</a> 使用场景</h4><p>一个对象族（或是一组没有任何关系的对象）都有相同的约束，则可以使用抽象工厂模式。</p>`,78),p=[c];function i(l,o){return s(),a("div",null,p)}const d=n(t,[["render",i],["__file","工厂模式.html.vue"]]);export{d as default};
