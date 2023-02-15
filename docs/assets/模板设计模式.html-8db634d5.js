import{_ as n,W as s,X as a,a1 as e}from"./framework-2afc6763.js";const i={},l=e(`<h1 id="模板设计模式" tabindex="-1"><a class="header-anchor" href="#模板设计模式" aria-hidden="true">#</a> 模板设计模式</h1><p>模板方法定义了一个算法的步骤，并允许子类为一个或多个步骤提供具体实现。</p><p>模板方法模式需要开发抽象类和具体子类的设计师之间的协作。一个设计师负责给出一个算法的轮廓和骨架，另一些设计师则负责给出这个算法的各个逻辑步骤。代表这些具体逻辑步骤的方法称做基本方法(primitive method)；而将这些基本方法汇总起来的方法叫做模板方法(template method)，这个设计模式的名字就是从此而来。</p><p>模板方法所代表的行为称为顶级行为，其逻辑称为顶级逻辑。模板方法模式的静态结构图如下所示：</p><p><img src="https://pic2.zhimg.com/80/v2-5fe8cf582a8130c11c6781ea1e76185b_1440w.png" alt=""></p><p>这里涉及到两个角色：</p><p>抽象模板(Abstract Template)角色有如下责任：</p><ul><li>定义了一个或多个抽象操作，以便让子类实现。这些抽象操作叫做基本操作，它们是一个顶级逻辑的组成步骤。</li><li>定义并实现了一个模板方法。这个模板方法一般是一个具体方法，它给出了一个顶级逻辑的骨架，而逻辑的组成步骤在相应的抽象操作中，推迟到子类实现。顶级逻辑也有可能调用一些具体方法。</li></ul><p>具体模板(Concrete Template)角色有如下责任：</p><ul><li>实现父类所定义的一个或多个抽象方法，它们是一个顶级逻辑的组成步骤。</li><li>每一个抽象模板角色都可以有任意多个具体模板角色与之对应，而每一个具体模板角色都可以给出这些抽象方法（也就是顶级逻辑的组成步骤）的不同实现，从而使得顶级逻辑的实现各不相同。</li></ul><h3 id="代码实现" tabindex="-1"><a class="header-anchor" href="#代码实现" aria-hidden="true">#</a> 代码实现</h3><p>定义父类</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">AbstractTemplate</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/**
     * 模板方法
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">templateMethod</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token comment">//调用基本方法</span>
        <span class="token function">abstractMethod</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 
        <span class="token function">concreteMethod</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token doc-comment comment">/**
     * 基本方法的声明（由子类实现）
     */</span>
    <span class="token keyword">protected</span> <span class="token keyword">abstract</span> <span class="token keyword">void</span> <span class="token function">abstractMethod</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 
    <span class="token doc-comment comment">/**
     * 基本方法（已经实现）
     */</span>
    <span class="token keyword">private</span>  <span class="token keyword">void</span> <span class="token function">concreteMethod</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token comment">//业务相关的代码</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>具体模板方法</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public class ConcreteTemplate extends AbstractTemplate{
    //基本方法的实现
    @Override
    public void abstractMethod() {
        //业务相关的代码
    }
 
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public class TemplateMethodTest { 

 public static void main(String[] args) { 

    AbstractTemplate abstractClass = new ConcreteTemplate(); 

     abstractClass.templateMethod(); 

 } 

} 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>模板模式的关键是：<strong>子类可以置换掉父类的可变部分，但是子类却不可以改变模板方法所代表的顶级逻辑。</strong></p><h3 id="应用场景" tabindex="-1"><a class="header-anchor" href="#应用场景" aria-hidden="true">#</a> 应用场景</h3><p>1.当你想让客户端只扩展算法的特定步骤，而不是整个算法或其结构时，请使用Template Method模式。</p><p>2.当你有几个类包含几乎相同的算法，但有一些细微的差异时，请使用此模式。</p><p>优点：</p><p>你可以让客户端只覆盖大型算法的某些部分，从而减少算法其他部分发生的更改对它们的影响。</p>`,23),t=[l];function c(d,p){return s(),a("div",null,t)}const r=n(i,[["render",c],["__file","模板设计模式.html.vue"]]);export{r as default};
