import{_ as e,W as p,X as c,Y as s,Z as n,a0 as o,a1 as a,F as i}from"./framework-2afc6763.js";const l={},u=a(`<p>使用 Netty 自定义协议连接物联网设备，业务增大之后，势必需要使用集群方案。</p><h3 id="nginx负载均衡" tabindex="-1"><a class="header-anchor" href="#nginx负载均衡" aria-hidden="true">#</a> nginx负载均衡</h3><p>Nginx 1.9 已经支持 TCP 代理和负载均衡，并可以通过一致性哈希算法将连接均匀的分配到所有的服务器上。</p><p>修改配置文件</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>stream{
	  upstream cloudsocket {

        hash $remote_addr consistent;

        server 127.0.0.1:3000 weight=5 max_fails=3 fail_timeout=30s;

        server 27.196.3.228:4000 weight=5 max_fails=3 fail_timeout=30s; 

     }
	 
	  server {
        listen       8080;
		proxy_pass cloudsocket;
	 }


}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意：stream和http是平级的。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>#重启
./nginx -s reload
#检查配置文件语法是否正确
./nginx -t
#停止
./nginx -s stop
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>经过测试可以发现，设备上报的数据分配到不同服务器上。</p><p><strong>window 10,nginx配置后，本地可以访问，局域网机器其他访问不了</strong></p><p>1、防火墙问题</p>`,10),d={href:"https://so.csdn.net/so/search?q=nginx&spm=1001.2101.3001.7020",target:"_blank",rel:"noopener noreferrer"},r=a(`<p><img src="https://img-blog.csdnimg.cn/20191101134230890.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyNDQwOTE5,size_16,color_FFFFFF,t_70" alt=""></p><p><img src="https://img-blog.csdnimg.cn/2019110113432489.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyNDQwOTE5,size_16,color_FFFFFF,t_70" alt=""></p><h3 id="长连接处理" tabindex="-1"><a class="header-anchor" href="#长连接处理" aria-hidden="true">#</a> 长连接处理</h3><p>在物联网中，设备和服务器之间是可以互相通信的，也就是说设备可以向服务器上报数据，服务器也可以向设备下发指令。由于设备和服务网之间是长连接，下发指令和接收设备上传数据的服务器只能是同一台服务器，因为只有它们之间建立了连接通道。</p><p>我们可以使用map保存设备和ChannelHandlerContext映射关系。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>
	<span class="token doc-comment comment">/**
	 * 用来保存对应的设备-channel
	 */</span>
	<span class="token keyword">private</span>  <span class="token keyword">static</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">ChannelHandlerContext</span><span class="token punctuation">&gt;</span></span> channelMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ConcurrentHashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

	<span class="token doc-comment comment">/**
	 * 用来标记channel当连接断开时要清除channelMap中的记录
	 */</span>
	<span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ChannelHandlerContext</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> mark <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ConcurrentHashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在设备连接、断开时候更新channelMap。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">channelRead0</span><span class="token punctuation">(</span><span class="token class-name">ChannelHandlerContext</span> ctx<span class="token punctuation">,</span> <span class="token class-name">Object</span> msg<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>

	<span class="token keyword">boolean</span> containsKey <span class="token operator">=</span> <span class="token class-name">ServerHandler</span><span class="token punctuation">.</span>channelMap<span class="token punctuation">.</span><span class="token function">containsKey</span><span class="token punctuation">(</span>deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>

			<span class="token comment">// 设备id和通道建立关系</span>
			<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>containsKey<span class="token punctuation">)</span> <span class="token punctuation">{</span>
				<span class="token class-name">ServerHandler</span><span class="token punctuation">.</span>channelMap<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span>deviceId<span class="token punctuation">,</span> ctx<span class="token punctuation">)</span><span class="token punctuation">;</span>
				<span class="token class-name">ServerHandler</span><span class="token punctuation">.</span>mark<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>
			<span class="token punctuation">}</span>

<span class="token punctuation">}</span>


	<span class="token doc-comment comment">/**
	 * 客户端与服务端断开连接时调用
	 */</span>
	<span class="token annotation punctuation">@Override</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">channelInactive</span><span class="token punctuation">(</span><span class="token class-name">ChannelHandlerContext</span> ctx<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
		<span class="token keyword">boolean</span> containsKey <span class="token operator">=</span> <span class="token class-name">ServerHandler</span><span class="token punctuation">.</span>mark<span class="token punctuation">.</span><span class="token function">containsKey</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token keyword">if</span> <span class="token punctuation">(</span>containsKey<span class="token punctuation">)</span> <span class="token punctuation">{</span>
			<span class="token class-name">String</span> code <span class="token operator">=</span> <span class="token class-name">ServerHandler</span><span class="token punctuation">.</span>mark<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span><span class="token punctuation">;</span>
			<span class="token class-name">ServerHandler</span><span class="token punctuation">.</span>channelMap<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span>code<span class="token punctuation">,</span> ctx<span class="token punctuation">)</span><span class="token punctuation">;</span>
			<span class="token class-name">ServerHandler</span><span class="token punctuation">.</span>mark<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="指令下发消息处理" tabindex="-1"><a class="header-anchor" href="#指令下发消息处理" aria-hidden="true">#</a> 指令下发消息处理</h3><p>可以通过redis发布/订阅模式实现。将消息 pub 到 redis 集群中，而所有集群中的服务器都 sub 这个 redis 集群，一旦有消息，所有的服务器都会消费消息，保持连接的服务器会处理消息。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>
	<span class="token doc-comment comment">/**
	 * 向设备发送消息
	 *
	 * <span class="token keyword">@param</span> <span class="token parameter">deviceId</span> 设备id
	 * <span class="token keyword">@param</span> <span class="token parameter">msg</span>  信息
	 */</span>
	<span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">send</span><span class="token punctuation">(</span><span class="token class-name">String</span> deviceId<span class="token punctuation">,</span> <span class="token class-name">Object</span> msg<span class="token punctuation">)</span> <span class="token punctuation">{</span>

		<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">ServerHandler</span><span class="token punctuation">.</span>channelMap<span class="token punctuation">.</span><span class="token function">containsKey</span><span class="token punctuation">(</span>deviceId<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
			<span class="token class-name">ChannelHandlerContext</span> handlerContext <span class="token operator">=</span> <span class="token class-name">ServerHandler</span><span class="token punctuation">.</span>channelMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>
			<span class="token keyword">if</span><span class="token punctuation">(</span>handlerContext<span class="token punctuation">.</span><span class="token function">channel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">isActive</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
				<span class="token class-name">ChannelFuture</span> channelFuture <span class="token operator">=</span> handlerContext<span class="token punctuation">.</span><span class="token function">writeAndFlush</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span><span class="token punctuation">;</span>
				<span class="token comment">//操作完成后通知注册一个 ChannelFutureListener</span>
				channelFuture<span class="token punctuation">.</span><span class="token function">addListener</span><span class="token punctuation">(</span><span class="token punctuation">(</span>future<span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">{</span>
					<span class="token keyword">if</span> <span class="token punctuation">(</span>channelFuture<span class="token punctuation">.</span><span class="token function">isSuccess</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
						<span class="token comment">//发送消息操作成功</span>
						log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;指令下发成功&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
					<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
						<span class="token comment">//发送消息操作异常</span>
						<span class="token class-name">Throwable</span> cause <span class="token operator">=</span> channelFuture<span class="token punctuation">.</span><span class="token function">cause</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
						log<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&quot;sendMSG &quot;</span><span class="token operator">+</span>msg<span class="token operator">+</span><span class="token string">&quot; err:&quot;</span><span class="token punctuation">,</span>cause<span class="token punctuation">)</span><span class="token punctuation">;</span>
						<span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">BaseException</span><span class="token punctuation">(</span>cause<span class="token punctuation">.</span><span class="token function">getMessage</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
					<span class="token punctuation">}</span>
				<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
			<span class="token punctuation">}</span><span class="token keyword">else</span> <span class="token punctuation">{</span>
				<span class="token class-name">ServerHandler</span><span class="token punctuation">.</span>channelMap<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span>deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>
			<span class="token punctuation">}</span>

		<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
			log<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&quot;-------设备 {} 已经断开连接-------&quot;</span><span class="token punctuation">,</span>deviceId<span class="token punctuation">)</span><span class="token punctuation">;</span>
			<span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">BaseException</span><span class="token punctuation">(</span>deviceId <span class="token operator">+</span> <span class="token string">&quot;设备已经断开连接&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,11);function k(v,m){const t=i("ExternalLinkIcon");return p(),c("div",null,[u,s("p",null,[n("打开防火墙，允许"),s("a",d,[n("nginx"),o(t)]),n("，并且的专用和公用的网络都允许访问。")]),r])}const h=e(l,[["render",k],["__file","Netty TCP长连接集群方案.html.vue"]]);export{h as default};
