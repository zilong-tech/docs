import{_ as e,W as n,X as i,a1 as l}from"./framework-2afc6763.js";const s={},d=l(`<p>责任链设计模式（Chain of Responsibility）</p><h3 id="定义" tabindex="-1"><a class="header-anchor" href="#定义" aria-hidden="true">#</a> 定义：</h3><p>为了避免请求发送者与多个请求处理者耦合在一起，于是将所有请求的处理者通过前一对象记住其下一个对象的引用而连成一条链；当有请求发生时，可将请求沿着这条链传递，直到有对象处理它为止。</p><p>在责任链模式中，客户只需要将请求发送到责任链上即可，无须关心请求的处理细节和请求的传递过程，请求会自动进行传递。所以责任链将请求的发送者和请求的处理者解耦了。</p><p>简单的理解的话就是进行层级处理。生活中比较常见的是请假、出差、加薪等申请等等，而工作中比较常见的就是拦截器和过滤器。如果请假申请是用以前的那种方式，发起者需要和每个负责人进行申请，会比较麻烦，但是现在一般是走OA流程，只需发起一个OA申请即可。这也是一种 这种就是典型的责任链模式，发起者只需将请求请求发送到职责链上即可，无需关心处理细节和请求的传递。</p><h3 id="应用场景" tabindex="-1"><a class="header-anchor" href="#应用场景" aria-hidden="true">#</a> 应用场景</h3><p>一个请求的处理需要多个对象当中的一个或几个协作处理。</p><h3 id="优缺点" tabindex="-1"><a class="header-anchor" href="#优缺点" aria-hidden="true">#</a> 优缺点</h3><p>优点：</p><ol><li>降低了对象之间的耦合度。该模式使得一个对象无须知道到底是哪一个对象处理其请求以及链的结构，发送者和接收者也无须拥有对方的明确信息。</li><li>增强了系统的可扩展性。可以根据需要增加新的请求处理类，满足开闭原则。</li><li>增强了给对象指派职责的灵活性。当工作流程发生变化，可以动态地改变链内的成员或者调动它们的次序，也可动态地新增或者删除责任。</li><li>责任链简化了对象之间的连接。每个对象只需保持一个指向其后继者的引用，不需保持其他所有处理者的引用，这避免了使用众多的 if 或者 if···else 语句。</li><li>责任分担。每个类只需要处理自己该处理的工作，不该处理的传递给下一个对象完成，明确各类的责任范围，符合类的单一职责原则。</li></ol><p>缺点：</p><ol><li>不能保证每个请求一定被处理。由于一个请求没有明确的接收者，所以不能保证它一定会被处理，该请求可能一直传到链的末端都得不到处理。</li><li>对比较长的职责链，请求的处理可能涉及多个处理对象，系统性能将受到一定影响。</li><li>职责链建立的合理性要靠客户端来保证，增加了客户端的复杂性，可能会由于职责链的错误设置而导致系统出错，如可能会造成循环调用。</li></ol><h2 id="实现" tabindex="-1"><a class="header-anchor" href="#实现" aria-hidden="true">#</a> 实现</h2><p>职责链模式主要包含以下角色。</p><ol><li>抽象处理者（Handler）角色：定义一个处理请求的接口，包含抽象处理方法和一个后继连接。</li><li>具体处理者（Concrete Handler）角色：实现抽象处理者的处理方法，判断能否处理本次请求，如果可以处理请求则处理，否则将该请求转给它的后继者。</li><li>客户类（Client）角色：创建处理链，并向链头的具体处理者对象提交请求，它不关心处理细节和请求的传递过程。</li></ol><p>下面用一个简单例子实现责任链模式</p><p><img src="https://pica.zhimg.com/80/v2-c72ee4b7777ecd3d91fb7a48cff98c7f_1440w.png" alt=""></p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public class ChainResponsibilityPatternTest {
    public static void main(String[] args) {
        //组装责任链
        Handler handler1 = new ConcreteHandler1();
        Handler handler2 = new ConcreteHandler2();
        handler1.setNext(handler2);
        //提交请求
        handler1.handleRequest(&quot;two&quot;);
    }
}

//抽象处理者角色
abstract class Handler {
    private Handler next;

    public void setNext(Handler next) {
        this.next = next;
    }

    public Handler getNext() {
        return next;
    }

    //处理请求的方法
    public abstract void handleRequest(String request);
}

//具体处理者角色1
class ConcreteHandler1 extends Handler {
    public void handleRequest(String request) {
        if (&quot;one&quot;.equals(request)) {
            System.out.println(&quot;ConcreteHandler1负责处理该请求！&quot;);
        } else {
            System.out.println(&quot;不是我处理&quot;);
            if (getNext() != null) {
                getNext().handleRequest(request);
            } else {
                System.out.println(&quot;没有人处理该请求！&quot;);
            }
        }
    }
}

//具体处理者角色2
class ConcreteHandler2 extends Handler {
    public void handleRequest(String request) {
        if (&quot;two&quot;.equals(request)) {
            System.out.println(&quot;ConcreteHandler2负责处理该请求！&quot;);
        } else {
            System.out.println(&quot;不是我处理&quot;);
            if (getNext() != null) {
                getNext().handleRequest(request);
            } else {
                System.out.println(&quot;没有人处理该请求！&quot;);
            }
        }
    }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>运行结果：</p><blockquote><p>不是我处理 ConcreteHandler2负责处理该请求！</p></blockquote>`,20),a=[d];function r(t,v){return n(),i("div",null,a)}const c=e(s,[["render",r],["__file","责任链模式.html.vue"]]);export{c as default};
