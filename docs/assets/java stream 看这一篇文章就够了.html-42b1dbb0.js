import{_ as s,W as i,X as l,Y as n,a0 as a,a1 as e,F as r}from"./framework-2afc6763.js";const d={},o=e(`<h3 id="lambda表达式简介" tabindex="-1"><a class="header-anchor" href="#lambda表达式简介" aria-hidden="true">#</a> Lambda表达式简介</h3><p>Lambda 表达式，也可称为闭包，它是推动 Java 8 发布的最重要新特性。</p><p>Lambda 允许把函数作为一个方法的参数（函数作为参数传递进方法中）。</p><p>使用 Lambda 表达式可以使代码变的更加简洁紧凑。</p><p>可以把Lambda表达式理解为简洁的表示可传递的匿名函数的一种方式：它没有名称，但它有参数列表，函数主体，返回类型，可能还有一个可以抛出的异常列表。</p><h4 id="语法" tabindex="-1"><a class="header-anchor" href="#语法" aria-hidden="true">#</a> 语法</h4><p>java中，引入了一个新的操作符“-&gt;”，该操作符在很多资料中，称为箭头操作符，或者lambda操作符；箭头操作符将lambda分成了两个部分：</p><ol><li><p>左侧：lambda表达式的参数列表</p></li><li><p>右侧：lambda表达式中所需要执行的功能，即lambda函数体</p></li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>  (parameters) -&gt; expression

   或 
   
   (parameters) -&gt;{ statements; }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>**可选类型声明：**不需要声明参数类型，编译器可以统一识别参数值。</p></li><li><p>**可选的参数圆括号：**一个参数无需定义圆括号，但多个参数需要定义圆括号。</p></li><li><p>**可选的大括号：**如果主体包含了一个语句，就不需要使用大括号。</p></li><li><p>**可选的返回关键字：**如果主体只有一个表达式返回值则编译器会自动返回值，大括号需要指定表达式返回了一个数值。</p></li></ul><p>语法格式：</p><p>A.无参数，无返回值的用法 ：() -&gt; System.out.println(&quot;hello lambda&quot;);</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>    @Test
	public void test1() {
		Runnable r = new Runnable() {
			@Override
			public void run() {
				System.out.println(&quot;hello runnable&quot;);
			}
		};
		r.run();
		
		
		Runnable r1 = () -&gt; System.out.println(&quot;hello lambda&quot;);
		r1.run();
	}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>B.带参函数</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// JDK7 匿名内部类写法
List&lt;String&gt; list = Arrays.asList(&quot;I&quot;, &quot;love&quot;, &quot;you&quot;, &quot;too&quot;);
Collections.sort(list, new Comparator&lt;String&gt;(){// 接口名
    @Override
    public int compare(String s1, String s2){// 方法名
        if(s1 == null)
            return -1;
        if(s2 == null)
            return 1;
        return s1.length()-s2.length();
    }
});

// JDK8 Lambda表达式写法
List&lt;String&gt; list = Arrays.asList(&quot;I&quot;, &quot;love&quot;, &quot;you&quot;, &quot;too&quot;);
Collections.sort(list, (s1, s2) -&gt;{// 省略参数表的类型
    if(s1 == null)
        return -1;
    if(s2 == null)
        return 1;
    return s1.length()-s2.length();
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>C.lambda表达式中，多行语句，分别在无返回值和有返回值的抽象类中的用法</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>@Test
public void test4() {
    // 无返回值lambda函数体中用法
    Runnable r1 = () -&gt; {
    System.out.println(&quot;hello lambda1&quot;);
    System.out.println(&quot;hello lambda2&quot;);
    System.out.println(&quot;hello lambda3&quot;);
};
r1.run();

// 有返回值lambda函数体中用法
BinaryOperator&lt;Integer&gt; binary = (x, y) -&gt; {
    int a = x * 2;
    int b = y + 2;
    return a + b;
};
System.out.println(binary.apply(1, 2));// 6
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，多行的，只需要用大括号{}把语句包含起来就可以了；有返回值和无返回值的，只有一个return的区别；只有一条语句的，大括号和renturn都可以不用写；</p><p>D. lambda的类型推断</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>    @Test
	public void test5() {
		BinaryOperator binary = (Integer x, Integer y) -&gt; x + y;
		System.out.println(binary.apply(1, 2));// 3
	}


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到，在lambda中的参数列表，可以不用写参数的类型，跟java7中 new ArrayList&lt;&gt;(); 不需要指定泛型类型，这样的&lt;&gt;棱形操作符一样，根据上下文做类型的推断</p><p><strong>能够使用Lambda的依据是必须有相应的函数接口</strong>（函数接口，是指内部只有一个抽象方法的接口）。这一点跟Java是强类型语言吻合，也就是说你并不能在代码的任何地方任性的写Lambda表达式。实际上<em>Lambda的类型就是对应函数接口的类型</em>。<strong>Lambda表达式另一个依据是类型推断机制</strong>，在上下文信息足够的情况下，编译器可以推断出参数表的类型，而不需要显式指名。Lambda表达更多合法的书写形式如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// Lambda表达式的书写形式</span>
<span class="token class-name">Runnable</span> run <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;Hello World&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 1</span>
<span class="token class-name">ActionListener</span> listener <span class="token operator">=</span> event <span class="token operator">-&gt;</span> <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;button clicked&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">// 2</span>
<span class="token class-name">Runnable</span> multiLine <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">{</span><span class="token comment">// 3 代码块</span>
    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">print</span><span class="token punctuation">(</span><span class="token string">&quot;Hello&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot; Hoolee&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token class-name">BinaryOperator</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Long</span><span class="token punctuation">&gt;</span></span> add <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Long</span> x<span class="token punctuation">,</span> <span class="token class-name">Long</span> y<span class="token punctuation">)</span> <span class="token operator">-&gt;</span> x <span class="token operator">+</span> y<span class="token punctuation">;</span><span class="token comment">// 4</span>
<span class="token class-name">BinaryOperator</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Long</span><span class="token punctuation">&gt;</span></span> addImplicit <span class="token operator">=</span> <span class="token punctuation">(</span>x<span class="token punctuation">,</span> y<span class="token punctuation">)</span> <span class="token operator">-&gt;</span> x <span class="token operator">+</span> y<span class="token punctuation">;</span><span class="token comment">// 5 类型推断</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="函数式接口" tabindex="-1"><a class="header-anchor" href="#函数式接口" aria-hidden="true">#</a> 函数式接口</h3><p>函数式接口(Functional Interface)是Java 8对一类特殊类型的接口的称呼。 这类接口只定义了唯一的抽象方法的接口，并且这类接口使用了<code>@FunctionalInterface</code>进行注解。函数式接口可以被隐式转换为 lambda 表达式。在jdk8中，引入了一个新的包<code>java.util.function</code>, 可以使java 8 的函数式编程变得更加简便。这个package中的接口大致分为了以下四类：</p><ul><li><p>Function: 接收参数，并返回结果，主要方法 <code>R apply(T t)</code></p></li><li><p>Consumer: 接收参数，无返回结果, 主要方法为 <code>void accept(T t)</code></p></li><li><p>Supplier: 不接收参数，但返回结构，主要方法为 <code>T get()</code></p></li><li><p>Predicate: 接收参数，返回boolean值，主要方法为 <code>boolean test(T t)</code></p><p><img src="https://pica.zhimg.com/80/v2-6333a74781eea89a3d6b3b33fd88b465_720w.png" alt=""></p></li></ul><h2 id="function" tabindex="-1"><a class="header-anchor" href="#function" aria-hidden="true">#</a> Function</h2><p>表示一个方法接收参数并返回结果。</p><h3 id="接收单个参数" tabindex="-1"><a class="header-anchor" href="#接收单个参数" aria-hidden="true">#</a> 接收单个参数</h3><table><thead><tr><th>Interface</th><th>functional method</th><th>说明</th></tr></thead><tbody><tr><td>Function&lt;T,R</td><td>R apply(T t)</td><td>接收参数类型为T，返回参数类型为R</td></tr><tr><td>IntFunction</td><td>R apply(int value)</td><td>以下三个接口，指定了接收参数类型，返回参数类型为泛型R</td></tr><tr><td>LongFunction</td><td>R apply(long value)</td><td></td></tr><tr><td>Double</td><td>R apply(double value)</td><td></td></tr><tr><td>ToIntFunction</td><td>int applyAsInt(T value)</td><td>以下三个接口，指定了返回参数类型，接收参数类型为泛型T</td></tr><tr><td>ToLongFunction</td><td>long applyAsLong(T value)</td><td></td></tr><tr><td>ToDoubleFunction</td><td>double applyAsDouble(T value)</td><td></td></tr><tr><td>IntToLongFunction</td><td>long applyAsLong(int value)</td><td>以下六个接口，既指定了接收参数类型，也指定了返回参数类型</td></tr><tr><td>IntToDoubleFunction</td><td>double applyAsLong(int value)</td><td></td></tr><tr><td>LongToIntFunction</td><td>int applyAsLong(long value)</td><td></td></tr><tr><td>LongToDoubleFunction</td><td>double applyAsLong(long value)</td><td></td></tr><tr><td>DoubleToIntFunction</td><td>int applyAsLong(double value)</td><td></td></tr><tr><td>DoubleToLongFunction</td><td>long applyAsLong(double value)</td><td></td></tr><tr><td>UnaryOperator</td><td>T apply(T t)</td><td>特殊的Function，接收参数类型和返回参数类型一样</td></tr><tr><td>IntUnaryOperator</td><td>int applyAsInt(int left, int right)</td><td>以下三个接口，指定了接收参数和返回参数类型，并且都一样</td></tr><tr><td>LongUnaryOperator</td><td>long applyAsInt(long left, long right)</td><td></td></tr><tr><td>DoubleUnaryOperator</td><td>double applyAsInt(double left, double right)</td><td></td></tr></tbody></table><h3 id="接收两个参数" tabindex="-1"><a class="header-anchor" href="#接收两个参数" aria-hidden="true">#</a> 接收两个参数</h3><table><thead><tr><th>interface</th><th>functional method</th><th>说明</th></tr></thead><tbody><tr><td>BiFunction&lt;T,U,R&gt;</td><td>R apply(T t, U u)</td><td>接收两个参数的Function</td></tr><tr><td>ToIntBiFunction&lt;T,U&gt;</td><td>int applyAsInt(T t, U u)</td><td>以下三个接口，指定了返回参数类型，接收参数类型分别为泛型T, U</td></tr><tr><td>ToLongBiFunction&lt;T,U&gt;</td><td>long applyAsLong(T t, U u)</td><td></td></tr><tr><td>ToDoubleBiFunction&lt;T,U&gt;</td><td>double appleyAsDouble(T t, U u)</td><td></td></tr><tr><td>BinaryOperator</td><td>T apply(T t, T u)</td><td>特殊的BiFunction, 接收参数和返回参数类型一样</td></tr><tr><td>IntBinaryOperator</td><td>int applyAsInt(int left, int right)</td><td></td></tr><tr><td>LongBinaryOperator</td><td>long applyAsInt(long left, long right)</td><td></td></tr><tr><td>DoubleBinaryOperator</td><td>double applyAsInt(double left, double right)</td><td></td></tr></tbody></table><h2 id="consumer" tabindex="-1"><a class="header-anchor" href="#consumer" aria-hidden="true">#</a> Consumer</h2><p>表示一个方法接收参数但不产生返回值。</p><h3 id="接收一个参数" tabindex="-1"><a class="header-anchor" href="#接收一个参数" aria-hidden="true">#</a> 接收一个参数</h3><table><thead><tr><th>interface</th><th>functional method</th><th>说明</th></tr></thead><tbody><tr><td>Consumer</td><td>void accept(T t)</td><td>接收一个泛型参数，无返回值</td></tr><tr><td>IntConsumer</td><td>void accept(int value)</td><td>以下三个类，接收一个指定类型的参数</td></tr><tr><td>LongConsumer</td><td>void accept(long value)</td><td></td></tr><tr><td>DoubleConsumer</td><td>void accept(double value)</td><td></td></tr></tbody></table><h3 id="接收两个参数-1" tabindex="-1"><a class="header-anchor" href="#接收两个参数-1" aria-hidden="true">#</a> 接收两个参数</h3><table><thead><tr><th>interface</th><th>functional method</th><th>说明</th></tr></thead><tbody><tr><td>BiConsumer&lt;T,U&gt;</td><td>void accept(T t, U u)</td><td>接收两个泛型参数</td></tr><tr><td>ObjIntConsumer</td><td>void accept(T t, int value)</td><td>以下三个类，接收一个泛型参数，一个指定类型的参数</td></tr><tr><td>ObjLongConsumer</td><td>void accept(T t, long value)</td><td></td></tr><tr><td>ObjDoubleConsumer</td><td>void accept(T t, double value)</td><td></td></tr></tbody></table><h2 id="supplier" tabindex="-1"><a class="header-anchor" href="#supplier" aria-hidden="true">#</a> Supplier</h2><p>返回一个结果，并不要求每次调用都返回一个新的或者独一的结果</p><table><thead><tr><th>interface</th><th>functional method</th><th>说明</th></tr></thead><tbody><tr><td>Supplier</td><td>T get()</td><td>返回类型为泛型T</td></tr><tr><td>BooleanSupplier</td><td>boolean getAsBoolean()</td><td>以下三个接口，返回指定类型</td></tr><tr><td>IntSupplier</td><td>int getAsInt()</td><td></td></tr><tr><td>LongSupplier</td><td>long getAsLong()</td><td></td></tr><tr><td>DoubleSupplier</td><td>double getAsDouble()</td><td></td></tr></tbody></table><h2 id="predicate" tabindex="-1"><a class="header-anchor" href="#predicate" aria-hidden="true">#</a> Predicate</h2><p>根据接收参数进行断言，返回boolean类型</p><table><thead><tr><th>interface</th><th>functional method</th><th>说明</th></tr></thead><tbody><tr><td>Predicate</td><td>boolean test(T t)</td><td>接收一个泛型参数</td></tr><tr><td>IntPredicate</td><td>boolean test(int value)</td><td>以下三个接口，接收指定类型的参数</td></tr><tr><td>LongPredicate</td><td>boolean test(long value)</td><td></td></tr><tr><td>DoublePredicate</td><td>boolean test(double value)</td><td></td></tr><tr><td>BiPredicate&lt;T,U&gt;</td><td>boolean test(T t, U u)</td><td>接收两个泛型参数，分别为T，U</td></tr></tbody></table><p>自定义函数式接口</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>@FunctionalInterface
interface GreetingService {
    void sayMessage(String message);
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么就可以使用Lambda表达式来表示该接口的一个实现(注：JAVA 8 之前一般是用匿名类实现的)：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GreetingService greetService1 = message -&gt; System.out.println(&quot;Hello &quot; + message);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>jdk7写法是这样的</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>GreetingService greetService1 = new GreetingService() {
    @Override
    public void sayMessage(String message) {
        System.out.println(&quot;Hello &quot; + message);
    }
};
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="方法引用" tabindex="-1"><a class="header-anchor" href="#方法引用" aria-hidden="true">#</a> 方法引用</h3><p>方法引用使用一对冒号 <strong>::</strong> 。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>@FunctionalInterface
public interface Supplier&lt;T&gt; {

    /**
     * Gets a result.
     *
     * @return a result
     */
    T get();
}


    class Car {
        //Supplier是jdk1.8的接口，这里和lamda一起使用了
        public static Car create(final Supplier&lt;Car&gt; supplier) {
            return supplier.get();
        }

        public static void collide(final Car car) {
            System.out.println(&quot;Collided &quot; + car.toString());
        }

        public void follow(final Car another) {
            System.out.println(&quot;Following the &quot; + another.toString());
        }

        public void repair() {
            System.out.println(&quot;Repaired &quot; + this.toString());
        }
    }

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="构造器引用" tabindex="-1"><a class="header-anchor" href="#构造器引用" aria-hidden="true">#</a> 构造器引用：</h5><p>它的语法是Class::new，或者更一般的Class&lt; T &gt;::new实例如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>final Car car = Car.create( Car::new );
final List&lt; Car &gt; cars = Arrays.asList( car );
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="静态方法引用" tabindex="-1"><a class="header-anchor" href="#静态方法引用" aria-hidden="true">#</a> 静态方法引用</h5><p>它的语法是Class::static_method，实例如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>cars.forEach( Car::collide );
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="特定类的任意对象的方法引用" tabindex="-1"><a class="header-anchor" href="#特定类的任意对象的方法引用" aria-hidden="true">#</a> 特定类的任意对象的方法引用</h5><p>它的语法是Class::method实例如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>cars.forEach( Car::repair );

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="特定对象的方法引用" tabindex="-1"><a class="header-anchor" href="#特定对象的方法引用" aria-hidden="true">#</a> 特定对象的方法引用</h5><p>它的语法是instance::method实例如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>final Car police = Car.create( Car::new ); 
cars.forEach( police::follow );
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="stream" tabindex="-1"><a class="header-anchor" href="#stream" aria-hidden="true">#</a> Stream</h3><p>Java 8 API添加了一个新的抽象称为流Stream，可以让你以一种声明的方式处理数据。</p><p>Stream 使用一种类似用 SQL 语句从数据库查询数据的直观方式来提供一种对 Java 集合运算和表达的高阶抽象。</p><p>Stream API可以极大提高Java程序员的生产力，让程序员写出高效率、干净、简洁的代码。</p><p>这种风格将要处理的元素集合看作一种流， 流在管道中传输， 并且可以在管道的节点上进行处理， 比如筛选， 排序，聚合等。</p><p>元素流在管道中经过中间操作（intermediate operation）的处理，最后由最终操作(terminal operation)得到前面处理的结果。</p><h3 id="什么是-stream" tabindex="-1"><a class="header-anchor" href="#什么是-stream" aria-hidden="true">#</a> 什么是 Stream？</h3><p>Stream（流）是一个来自数据源的元素队列并支持聚合操作</p><ul><li>元素是特定类型的对象，形成一个队列。 Java中的Stream并不会存储元素，而是按需计算。</li><li><strong>数据源</strong> 流的来源。 可以是集合，数组，I/O channel， 产生器generator 等。</li><li><strong>聚合操作</strong> 类似SQL语句一样的操作， 比如filter, map, reduce, find, match, sorted等。</li></ul><p>和以前的Collection操作不同， Stream操作还有两个基础的特征：</p><ul><li><strong>Pipelining</strong>: 中间操作都会返回流对象本身。 这样多个操作可以串联成一个管道， 如同流式风格（fluent style）。 这样做可以对操作进行优化， 比如延迟执行(laziness)和短路( short-circuiting)。</li><li><strong>内部迭代</strong>： 以前对集合遍历都是通过Iterator或者For-Each的方式, 显式的在集合外部进行迭代， 这叫做外部迭代。 Stream提供了内部迭代的方式， 通过访问者模式(Visitor)实现。</li></ul><h3 id="怎么使用stream" tabindex="-1"><a class="header-anchor" href="#怎么使用stream" aria-hidden="true">#</a> 怎么使用Stream？</h3><p>使用Stream流分为三步：</p><ol><li><p>创建Stream流</p></li><li><p>通过Stream流对象执行中间操作</p></li><li><p>执行最终操作，得到结果</p></li></ol><img src="https://pic1.zhimg.com/80/v2-3c7d8da09743c5b1db451c1b0f5b5ca3_720w.png" style="zoom:80%;"><h3 id="创建流" tabindex="-1"><a class="header-anchor" href="#创建流" aria-hidden="true">#</a> 创建流</h3><p>在 Java 8 中, 集合接口有两个方法来生成流：</p><ul><li><strong>stream()</strong> − 为集合创建串行流。</li><li><strong>parallelStream()</strong> − 为集合创建并行流。</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>List&lt;String&gt; strings = Arrays.asList(&quot;abc&quot;, &quot;&quot;, &quot;bc&quot;, &quot;efg&quot;, &quot;abcd&quot;,&quot;&quot;, &quot;jkl&quot;); 
List&lt;String&gt; filtered = strings.stream().filter(string -&gt; !string.isEmpty()).collect(Collectors.toList());
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>虽然大部分情况下<em>stream</em>是容器调用<code>Collection.stream()</code>方法得到的，但<em>stream</em>和<em>collections</em>有以下不同：</p><ul><li><strong>无存储</strong>。<em>stream</em>不是一种数据结构，它只是某种数据源的一个视图，数据源可以是一个数组，Java容器或I/O channel等。</li><li><strong>为函数式编程而生</strong>。对<em>stream</em>的任何修改都不会修改背后的数据源，比如对<em>stream</em>执行过滤操作并不会删除被过滤的元素，而是会产生一个不包含被过滤元素的新<em>stream</em>。</li><li><strong>惰式执行</strong>。<em>stream</em>上的操作并不会立即执行，只有等到用户真正需要结果的时候才会执行。</li><li><strong>可消费性</strong>。<em>stream</em>只能被“消费”一次，一旦遍历过就会失效，就像容器的迭代器那样，想要再次遍历必须重新生成。</li></ul><p>对<em>stream</em>的操作分为为两类，<strong>中间操作(*intermediate operations*)和结束操作(*terminal operations*)</strong>，二者特点是：</p><ol><li><strong>中间操作总是会惰式执行</strong>，调用中间操作只会生成一个标记了该操作的新<em>stream</em>，仅此而已。</li><li><strong>结束操作会触发实际计算</strong>，计算发生时会把所有中间操作积攒的操作以<em>pipeline</em>的方式执行，这样可以减少迭代次数。计算完成之后<em>stream</em>就会失效。</li></ol><p><code>Stream</code>接口的部分常见方法：</p><table><thead><tr><th>操作类型</th><th>接口方法</th></tr></thead><tbody><tr><td>中间操作</td><td>concat() 、distinct()、 filter() 、flatMap()、 limit() 、map() 、peek() 、skip() 、sorted() 、parallel()、 sequential() 、unordered()</td></tr><tr><td>结束操作</td><td>allMatch()、 anyMatch() 、collect()、 count()、 findAny() 、findFirst() 、forEach() 、forEachOrdered() 、max() 、min() 、noneMatch() 、reduce()、 toArray()</td></tr></tbody></table><p>区分中间操作和结束操作最简单的方法，就是看方法的返回值，返回值为<em>stream</em>的大都是中间操作，否则是结束操作。</p><h3 id="stream方法使用" tabindex="-1"><a class="header-anchor" href="#stream方法使用" aria-hidden="true">#</a> stream方法使用</h3><h3 id="foreach" tabindex="-1"><a class="header-anchor" href="#foreach" aria-hidden="true">#</a> forEach()</h3><p>我们对<code>forEach()</code>方法并不陌生，在<code>Collection</code>中我们已经见过。方法签名为<code>void forEach(Consumer&lt;? super E&gt; action)</code>，作用是对容器中的每个元素执行<code>action</code>指定的动作，也就是对元素进行遍历。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 使用Stream.forEach()迭代
Stream&lt;String&gt; stream = Stream.of(&quot;I&quot;, &quot;love&quot;, &quot;you&quot;, &quot;too&quot;);
stream.forEach(str -&gt; System.out.println(str));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由于<code>forEach()</code>是结束方法，上述代码会立即执行，输出所有字符串。</p><h3 id="filter" tabindex="-1"><a class="header-anchor" href="#filter" aria-hidden="true">#</a> filter()</h3>`,97),c={href:"https://github.com/CarpenterLee/JavaLambdaInternals/blob/master/Figures/Stream.filter.png",target:"_blank",rel:"noopener noreferrer"},u=n("img",{src:"https://github.com/CarpenterLee/JavaLambdaInternals/raw/master/Figures/Stream.filter.png",alt:"Stream filter",style:{zoom:"80%"}},null,-1),p=e(`<p>函数原型为<code>Stream&lt;T&gt; filter(Predicate&lt;? super T&gt; predicate)</code>，作用是返回一个只包含满足<code>predicate</code>条件元素的<code>Stream</code>。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 保留长度等于3的字符串
Stream&lt;String&gt; stream= Stream.of(&quot;I&quot;, &quot;love&quot;, &quot;you&quot;, &quot;too&quot;);
stream.filter(str -&gt; str.length()==3)
    .forEach(str -&gt; System.out.println(str));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码将输出为长度等于3的字符串<code>you</code>和<code>too</code>。注意，由于<code>filter()</code>是个中间操作，如果只调用<code>filter()</code>不会有实际计算，因此也不会输出任何信息。</p><h3 id="distinct" tabindex="-1"><a class="header-anchor" href="#distinct" aria-hidden="true">#</a> distinct()</h3>`,4),m={href:"https://github.com/CarpenterLee/JavaLambdaInternals/blob/master/Figures/Stream.distinct.png",target:"_blank",rel:"noopener noreferrer"},v=n("img",{src:"https://github.com/CarpenterLee/JavaLambdaInternals/raw/master/Figures/Stream.distinct.png",alt:"Stream distinct",style:{zoom:"80%"}},null,-1),b=e(`<p>函数原型为<code>Stream&lt;T&gt; distinct()</code>，作用是返回一个去除重复元素之后的<code>Stream</code>。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Stream&lt;String&gt; stream= Stream.of(&quot;wo&quot;, &quot;are&quot;, &quot;family&quot;,&quot;wo&quot;);
stream.distinct()
    .forEach(str -&gt; System.out.println(str));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="sorted" tabindex="-1"><a class="header-anchor" href="#sorted" aria-hidden="true">#</a> sorted()</h3><p>排序函数有两个，一个是用自然顺序排序，一个是使用自定义比较器排序，函数原型分别为<code>Stream&lt;T&gt;　sorted()</code>和<code>Stream&lt;T&gt;　sorted(Comparator&lt;? super T&gt; comparator)</code>。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Stream&lt;String&gt; stream= Stream.of(&quot;wo&quot;, &quot;are&quot;, &quot;family&quot;);
stream.sorted((str1, str2) -&gt; str1.length()-str2.length())
    .forEach(str -&gt; System.out.println(str));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码将输出按照长度升序排序后的字符串，结果完全在预料之中。</p><h3 id="map" tabindex="-1"><a class="header-anchor" href="#map" aria-hidden="true">#</a> map()</h3>`,7),g={href:"https://github.com/CarpenterLee/JavaLambdaInternals/blob/master/Figures/Stream.map.png",target:"_blank",rel:"noopener noreferrer"},h=n("img",{src:"https://github.com/CarpenterLee/JavaLambdaInternals/raw/master/Figures/Stream.map.png",alt:"Stream map"},null,-1),k=e(`<p>函数原型为<code>&lt;R&gt; Stream&lt;R&gt; map(Function&lt;? super T,? extends R&gt; mapper)</code>，作用是返回一个对当前所有元素执行执行<code>mapper</code>之后的结果组成的<code>Stream</code>。直观的说，就是对每个元素按照某种操作进行转换，转换前后<code>Stream</code>中元素的个数不会改变，但元素的类型取决于转换之后的类型。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Stream&lt;String&gt; stream　= Stream.of(&quot;I&quot;, &quot;love&quot;, &quot;you&quot;, &quot;too&quot;);
stream.map(str -&gt; str.toUpperCase())
    .forEach(str -&gt; System.out.println(str));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码将输出原字符串的大写形式。</p><h3 id="flatmap" tabindex="-1"><a class="header-anchor" href="#flatmap" aria-hidden="true">#</a> flatMap()</h3>`,4),y={href:"https://github.com/CarpenterLee/JavaLambdaInternals/blob/master/Figures/Stream.flatMap.png",target:"_blank",rel:"noopener noreferrer"},x=n("img",{src:"https://github.com/CarpenterLee/JavaLambdaInternals/raw/master/Figures/Stream.flatMap.png",alt:"Stream flatMap"},null,-1),S=e(`<p>函数原型为<code>&lt;R&gt; Stream&lt;R&gt; flatMap(Function&lt;? super T,? extends Stream&lt;? extends R&gt;&gt; mapper)</code>，作用是对每个元素执行<code>mapper</code>指定的操作，并用所有<code>mapper</code>返回的<code>Stream</code>中的元素组成一个新的<code>Stream</code>作为最终返回结果。说起来太拗口，通俗的讲<code>flatMap()</code>的作用就相当于把原<em>stream</em>中的所有元素都&quot;摊平&quot;之后组成的<code>Stream</code>，转换前后元素的个数和类型都可能会改变。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Stream&lt;List&lt;Integer&gt;&gt; stream = Stream.of(Arrays.asList(1,2), Arrays.asList(3, 4, 5));
stream.flatMap(list -&gt; list.stream())
    .forEach(i -&gt; System.out.println(i));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中，原来的<code>stream</code>中有两个元素，分别是两个<code>List&lt;Integer&gt;</code>，执行<code>flatMap()</code>之后，将每个<code>List</code>都“摊平”成了一个个的数字，所以会新产生一个由5个数字组成的<code>Stream</code>。所以最终将输出1~5这5个数字。</p><p>以上简单介绍流的一些简单用法，下面介绍下在集合中常用的操作</p><h3 id="规约操作" tabindex="-1"><a class="header-anchor" href="#规约操作" aria-hidden="true">#</a> 规约操作</h3><p>规约操作（<em>reduction operation</em>）又被称作折叠操作（<em>fold</em>），是通过某个连接动作将所有元素汇总成一个汇总结果的过程。元素求和、求最大值或最小值、求出元素总个数、将所有元素转换成一个列表或集合，都属于规约操作。<em>Stream</em>类库有两个通用的规约操作<code>reduce()</code>和<code>collect()</code>，也有一些为简化书写而设计的专用规约操作，比如<code>sum()</code>、<code>max()</code>、<code>min()</code>、<code>count()</code>等。</p><h3 id="reduce" tabindex="-1"><a class="header-anchor" href="#reduce" aria-hidden="true">#</a> reduce()</h3><p>归约Reduce流运算允许我们通过对序列中的元素重复应用合并操作，从而从元素序列中产生一个单一结果。</p><p><em>reduce</em>操作可以实现从一组元素中生成一个值，<code>sum()</code>、<code>max()</code>、<code>min()</code>、<code>count()</code>等都是<em>reduce</em>操作，将他们单独设为函数只是因为常用。<code>reduce()</code>的方法定义有三种重写形式：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Optional&lt;T&gt; reduce(BinaryOperator&lt;T&gt; accumulator)
T reduce(T identity, BinaryOperator&lt;T&gt; accumulator)
&lt;U&gt; U reduce(U identity, BiFunction&lt;U,? super T,U&gt; accumulator, BinaryOperator&lt;U&gt; combiner)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>标识identity：代表一个元素，它是归约reduce运算的初始值，如果流为空，则为此默认结果。</li><li>accumulator 累加器：具有两个参数的函数：归约reduce运算后的部分结果和流的下一个元素</li><li>combiner 组合器：当归约是并行化或累加器参数的类型与累加器实现的类型不匹配时，用于合并combine归约操作的部分结果的函数</li></ul><p>接口继承关系</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Optional&lt;T&gt; reduce(BinaryOperator&lt;T&gt; accumulator);

@FunctionalInterface
public interface BinaryOperator&lt;T&gt; extends BiFunction&lt;T,T,T&gt; {
	//两个静态方法，先进行忽略
}

@FunctionalInterface
public interface BiFunction&lt;T, U, R&gt; {
	R apply(T t, U u);
	//一个默认方法，先进行忽略
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>方法一 reduce(BinaryOperator accumulator)</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>
<span class="token comment">//reduce(BinaryOperator&lt;T&gt; accumulator)方法需要一个函数式接口参数\`，该函数式接口需要\`两个参数\`，返回\`一个结果\`(reduce中</span>
<span class="token comment">//返回的结果会作为下次累加器计算的第一个参数)，也就是\`累加器\`,最终得到一个\`Optional对象</span>
<span class="token comment">//最长单词</span>
<span class="token class-name">Stream</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> stream1 <span class="token operator">=</span> <span class="token class-name">Stream</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token string">&quot;we&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;are&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;family&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">Optional</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> longest <span class="token operator">=</span> stream1<span class="token punctuation">.</span><span class="token function">reduce</span><span class="token punctuation">(</span><span class="token punctuation">(</span>s1<span class="token punctuation">,</span> s2<span class="token punctuation">)</span> <span class="token operator">-&gt;</span> s1<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">&gt;=</span>s2<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">?</span> s1 <span class="token operator">:</span> s2<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>longest<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// family</span>

  #等价于
   <span class="token class-name">Stream</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> stream1 <span class="token operator">=</span> <span class="token class-name">Stream</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token string">&quot;we&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;are&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;family&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Optional</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> longest <span class="token operator">=</span> stream1<span class="token punctuation">.</span><span class="token function">reduce</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">BinaryOperator</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">apply</span><span class="token punctuation">(</span><span class="token class-name">String</span> s1<span class="token punctuation">,</span> <span class="token class-name">String</span> s2<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">return</span> s1<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&gt;=</span> s2<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">?</span> s1 <span class="token operator">:</span> s2<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>方法二 reduce(T identity, BinaryOperator accumulator)</strong></p><p>identity参数与Stream中数据同类型，相当于一个的<code>初始值</code>，通过累加器<code>accumulator迭代计算Stream中的数据</code>，得到一个跟Stream中数据相同类型的最终结果。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">//求和</span>
<span class="token keyword">int</span> s <span class="token operator">=</span> <span class="token class-name">Stream</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">7</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">,</span> <span class="token number">9</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">reduce</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">45</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>acc<span class="token punctuation">,</span> n<span class="token punctuation">)</span> <span class="token operator">-&gt;</span> acc <span class="token operator">+</span> n<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 0</span>

<span class="token comment">//等价于</span>
<span class="token keyword">int</span> s <span class="token operator">=</span> <span class="token class-name">Stream</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">7</span><span class="token punctuation">,</span> <span class="token number">8</span><span class="token punctuation">,</span> <span class="token number">9</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">reduce</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">45</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">BinaryOperator</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token class-name">Integer</span> <span class="token function">apply</span><span class="token punctuation">(</span><span class="token class-name">Integer</span> acc<span class="token punctuation">,</span> <span class="token class-name">Integer</span> n<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> acc <span class="token operator">+</span> n<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>方法三 reduce(U identity,BiFunction&lt;U, ? super T, U&gt; accumulator,BinaryOperator combiner)</strong></p><p>第一个参数：返回实例u，传递你要返回的U类型对象的初始化实例u</p><p>第二个参数：累加器accumulator，可以使用lambda表达式，声明你在u上累加你的数据来源t的逻辑，例如(u,t)-&gt;u.sum(t),此时lambda表达式的行参列表是返回实例u和遍历的集合元素t，函数体是在u上累加t</p><p>第三个参数：参数组合器combiner，接受lambda表达式。参数的数据类型必须为返回数据类型，该参数主要用于合并多个线程的result值。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 求单词长度之和
Stream&lt;String&gt; stream = Stream.of(&quot;a&quot;,&quot;bb&quot;,&quot;ccc&quot;);
Integer lengthSum = stream.reduce(0,
        (sum, str) -&gt; {
            System.out.println(&quot;执行BiFunction&quot;);
            return sum + str.length();
        },
        (a, b) -&gt; {
            System.out.println(&quot;执行BinaryOperator&quot;);
            return a + b;
        });
System.out.println(lengthSum);


//等价于
Stream&lt;String&gt; stream = Stream.of(&quot;a&quot;,&quot;bb&quot;,&quot;ccc&quot;);
Integer lengthSum = stream.reduce(0,
        new BiFunction&lt;Integer, String, Integer&gt;() {
            @Override
            public Integer apply(Integer sum, String str) {
                System.out.println(&quot;执行BiFunction&quot;);
                return sum + str.length();
            }
        },
        new BinaryOperator&lt;Integer&gt;() {
            @Override
            public Integer apply(Integer a, Integer b) {
                System.out.println(&quot;执行BinaryOperator&quot;);
                return a + b;
            }
        });
System.out.println(lengthSum);

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出结果：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>执行BiFunction
执行BiFunction
执行BiFunction
6
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从输出结果可以看出第三个参数并没有执行。</p><p>这是因为Stream是支持并发操作的，为了避免竞争，对于reduce线程都会有独立的result，combiner的作用在于合并每个线程的result得到最终结果。这也说明了了第三个函数参数的数据类型必须为返回数据类型了。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Integer lengthSum = stream.parallel().reduce(0,
        (sum, str) -&gt; {
            System.out.println(&quot;执行BiFunction&quot;);
            return sum + str.length();
        },
        (a, b) -&gt; {
            System.out.println(&quot;执行BinaryOperator&quot;);
            return a + b;
        });
System.out.println(lengthSum);

输出结果

执行BiFunction
执行BiFunction
执行BiFunction
执行BinaryOperator
执行BinaryOperator
6
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="collect" tabindex="-1"><a class="header-anchor" href="#collect" aria-hidden="true">#</a> collect()</h3><p>首先定义个实体类</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>@Data
class Apple {

    private String color;
    private Integer weight;

}

@Data
class Person {

    private String firstName, lastName, job, gender;
    private int salary,age;

}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>collect是一个终端操作,它接收的参数是将流中的元素累积到汇总结果的各种方式(称为收集器)</p><p>collect源码</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;R, A&gt; R collect(Collector&lt;? super T, A, R&gt; collector);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>使用collect()生成Collection</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 将Stream转换成List或Set
Stream&lt;String&gt; stream = Stream.of(&quot;a&quot;, &quot;bb&quot;, &quot;ccc&quot;, &quot;ddd&quot;);
List&lt;String&gt; list = stream.collect(Collectors.toList()); 
Set&lt;String&gt; set = stream.collect(Collectors.toSet()); 

 ArrayList&lt;String&gt; arrayList = stream.collect(Collectors.toCollection(ArrayList::new));
 HashSet&lt;String&gt; hashSet = stream.collect(Collectors.toCollection(HashSet::new));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>使用collect()生成Map</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Stream&lt;String&gt; stream = Stream.of(&quot;a&quot;, &quot;bb&quot;, &quot;ccc&quot;, &quot;ddd&quot;);
// 指定key和value
stream.collect(Collectors.toMap(Function.identity(),String::length));

//分组
Map&lt;Integer, List&lt;Person&gt;&gt; map = listPerson1.stream().collect(Collectors.groupingBy(Person::getSalary));

listPerson1.stream().collect(HashMap::new,(maps,p)-&gt;maps.put(p.getFirstName(),p.getLastName()),Map::putAll);

//toMap()参数一：key值，参数二：value值 参数三：当两个key值相同时，决定保留前一个value值还是后一个value值,key为null
listPerson1.stream()
		   .collect(Collectors.toMap(p -&gt; p.getFirstName(), p -&gt;
           Optional.ofNullable(p.getLastName()).orElse(&quot;value为null加非空检验&quot;), (k1, k2) -&gt; k1));

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>增强版的<code>groupingBy()</code>允许我们对元素分组之后再执行某种运算，比如求和、计数、平均值、类型转换等。这种先将元素分组的收集器叫做<strong>上游收集器</strong>，之后执行其他运算的收集器叫做<strong>下游收集器</strong>(<em>downstream Collector</em>)。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//counting方法返回所收集元素的总数
Map&lt;Integer, Long&gt; count = listPerson1.stream().collect(Collectors.groupingBy(Person::getSalary,Collectors.counting()));

//summing方法会对元素求和
Map&lt;Integer, Integer&gt; ageCount = listPerson1.stream().collect(Collectors.groupingBy(Person::getSalary,Collectors.summingInt(Person::getAge)));

//axBy和minBy会接受一个比较器，求最大值，最小值
Map&lt;Integer, Optional&lt;Person&gt;&gt; ageMax =  listPerson1.stream().collect(Collectors.groupingBy(Person::getSalary,Collectors.maxBy(Comparator.comparing(Person::getAge))));

//mapping函数会应用到downstream结果上，并需要和其他函数配合使用
Map&lt;Integer, List&lt;String&gt;&gt; nameMap =  listPerson1.stream().collect(Collectors.groupingBy(Person::getSalary,Collectors.mapping(Person::getFirstName,Collectors.toList())));


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>使用collect()做字符串join</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>String str = Arrays.asList(&quot;voidcc.com&quot;, &quot;voidmvn.com&quot;, &quot;voidtool.com&quot;).stream().collect(Collectors.joining(&quot;,&quot;));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>Stream其他用法</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//升序
Stream&lt;Integer&gt; sorted = listPerson1.stream().map(Person::getAge).sorted((x, y) -&gt; x.compareTo(y));
//降序
Stream&lt;Integer&gt; sorted = listPerson1.stream().map(Person::getAge).sorted((x, y) -&gt; y.compareTo(x));
//按key升序
map.entrySet().stream().sorted(Comparator.comparing(e -&gt; e.getKey()));

//最大值
Optional&lt;Person&gt; max = listPerson1.stream().max(Comparator.comparing(Person::getAge));

//Map集合转 List
map.entrySet().stream().sorted(Comparator.comparing(e -&gt; e.getKey()))
                .map(e -&gt; new Apple(e.getKey(), e.getValue())).collect(Collectors.toList())
                .forEach(System.out::println);

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,44);function f(q,L){const t=r("ExternalLinkIcon");return i(),l("div",null,[o,n("p",null,[n("a",c,[u,a(t)])]),p,n("p",null,[n("a",m,[v,a(t)])]),b,n("p",null,[n("a",g,[h,a(t)])]),k,n("p",null,[n("a",y,[x,a(t)])]),S])}const I=s(d,[["render",f],["__file","java stream 看这一篇文章就够了.html.vue"]]);export{I as default};
