import{_ as e,W as i,X as n,a1 as s}from"./framework-2afc6763.js";const l={},a=s(`<h1 id="spring-autowired-map-list" tabindex="-1"><a class="header-anchor" href="#spring-autowired-map-list" aria-hidden="true">#</a> Spring @Autowired Map List</h1><p>这是Spring的一个特殊的注入功能</p><p>当注入一个Map的时候 ，value泛型为T，则注入后Spring会将实例化后的bean放入value ，key则为注入后bean的名字</p><p>当注入一个List的时候，List的泛型为T，则注入后Spring会将实例化的bean放入List中</p><p>定义一个接口</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public interface UserService {
    
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>两个实现类</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>@Service(&quot;beijing&quot;)
public class BeijingUserServiceImpl implements UserService{
    
}


@Service(&quot;shanghai&quot;)
public class ShanghaiServiceImpl implements UserService {
    
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试类</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>@Autowired
Map&lt;String, UserService&gt; map ;

@Autowired
List&lt;UserService&gt; list;

public void test(){
	 for (Map.Entry m : map.entrySet()){
            System.out.println(&quot;key : &quot; + m.getKey()+&quot; =value:&quot; + m.getValue());
        }
        
           for (Map.Entry m : map.entrySet()){
            System.out.println(&quot;key : &quot; + m.getKey()+&quot;; value:&quot; + m.getValue());
        }

        list.stream().forEach(l -&gt;{

            System.out.println(l.toString());
        });

}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>打印结果：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>key : beijing; value:com.test.controller.BeijingUserServiceImpl@188c5d23
key : shanghai; value:com.test.controller.ShanghaiServiceImpl@183e329d

com.test.controller.BeijingUserServiceImpl@188c5d23
com.test.controller.ShanghaiServiceImpl@183e329d
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注入map的使用场景：</p><p>完成简单版的策略模式</p>`,14),d=[a];function r(t,v){return i(),n("div",null,d)}const u=e(l,[["render",r],["__file","Spring  @Autowired Map.html.vue"]]);export{u as default};
