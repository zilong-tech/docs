import{_ as n,W as a,X as s,a1 as e}from"./framework-2afc6763.js";const i={},t=e(`<p>swagger,中文“拽”的意思。它是一个功能强大的api框架，它的集成非常简单，不仅提供了在线文档的查阅，而且还提供了在线文档的测试。另外swagger很容易构建restful风格的api，简单优雅帅气，正如它的名字。</p><p><code>Knife4j</code>的前身是<code>swagger-bootstrap-ui</code>,前身<code>swagger-bootstrap-ui</code>是一个纯<code>swagger-ui</code>的<code>ui</code>皮肤项目。</p><h3 id="引入依赖" tabindex="-1"><a class="header-anchor" href="#引入依赖" aria-hidden="true">#</a> 引入依赖</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;dependency&gt;
    &lt;groupId&gt;com.github.xiaoymin&lt;/groupId&gt;
    &lt;artifactId&gt;knife4j-spring-boot-starter&lt;/artifactId&gt;
    &lt;!--在引用时请在maven中央仓库搜索2.X最新版本号--&gt;
    &lt;version&gt;2.0.9&lt;/version&gt;
&lt;/dependency&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建swagger配置依赖" tabindex="-1"><a class="header-anchor" href="#创建swagger配置依赖" aria-hidden="true">#</a> 创建Swagger配置依赖</h3><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2WebMvc;

@Configuration
@EnableSwagger2WebMvc
public class Knife4jConfiguration {

    @Bean(value = &quot;defaultApi2&quot;)
    public Docket defaultApi2() {
        Docket docket=new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(new ApiInfoBuilder()
                        //.title(&quot;swagger-bootstrap-ui-demo RESTful APIs&quot;)
                        .description(&quot;# swagger-bootstrap-ui-demo RESTful APIs&quot;)
                        .termsOfServiceUrl(&quot;http://www.xx.com/&quot;)
                        .contact(&quot;xx@qq.com&quot;)
                        .version(&quot;1.0&quot;)
                        .build())
                //分组名称
                .groupName(&quot;2.X版本&quot;)
                .select()
                //这里指定Controller扫描包路径
                .apis(RequestHandlerSelectors.basePackage(&quot;com.demo.controller&quot;))
                .paths(PathSelectors.any())
                .build();
        return docket;
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="添加接口" tabindex="-1"><a class="header-anchor" href="#添加接口" aria-hidden="true">#</a> 添加接口</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Api</span><span class="token punctuation">(</span>tags <span class="token operator">=</span> <span class="token string">&quot;首页模块&quot;</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@RestController</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">IndexController</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@ApiImplicitParam</span><span class="token punctuation">(</span>name <span class="token operator">=</span> <span class="token string">&quot;name&quot;</span><span class="token punctuation">,</span>value <span class="token operator">=</span> <span class="token string">&quot;姓名&quot;</span><span class="token punctuation">,</span>required <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@ApiOperation</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;测试&quot;</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">&quot;/sayHi&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token class-name">ResponseEntity</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token function">sayHi</span><span class="token punctuation">(</span><span class="token annotation punctuation">@RequestParam</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;name&quot;</span><span class="token punctuation">)</span><span class="token class-name">String</span> name<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">ResponseEntity</span><span class="token punctuation">.</span><span class="token function">ok</span><span class="token punctuation">(</span><span class="token string">&quot;Hi:&quot;</span><span class="token operator">+</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动Spring Boot工程，在浏览器中访问：<code>http://localhost:8080/doc.html</code></p><p><img src="https://gitee.com/zysspace/mq-demo/raw/master/image/202207172155578.png" alt=""></p><h3 id="注解说明" tabindex="-1"><a class="header-anchor" href="#注解说明" aria-hidden="true">#</a> 注解说明</h3><p>swagger通过注解表明该接口会生成文档，包括接口名、请求方法、参数、返回信息的等等。</p><ul><li>@Api：修饰整个类，描述Controller的作用</li><li>@ApiOperation：描述一个类的一个方法，或者说一个接口</li><li>@ApiParam：单个参数描述</li><li>@ApiModel：用对象来接收参数</li><li>@ApiProperty：用对象接收参数时，描述对象的一个字段</li><li>@ApiResponse：HTTP响应其中1个描述</li><li>@ApiResponses：HTTP响应整体描述</li><li>@ApiIgnore：使用该注解忽略这个API</li><li>@ApiError ：发生错误返回的信息</li><li>@ApiParamImplicitL：一个请求参数</li><li>@ApiParamsImplicit 多个请求参数</li></ul><blockquote><p>参考文档：https://doc.xiaominfo.com/knife4j/documentation/get_start.html</p></blockquote>`,14),o=[t];function l(p,c){return a(),s("div",null,o)}const u=n(i,[["render",l],["__file","spring boot中集成swagger.html.vue"]]);export{u as default};
