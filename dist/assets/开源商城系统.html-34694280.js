import{_ as a,W as d,X as i,a1 as e}from"./framework-2afc6763.js";const l={},t=e(`<p>今天分享几款热门的电商开源项目。</p><h3 id="一、mall4j商城系统" tabindex="-1"><a class="header-anchor" href="#一、mall4j商城系统" aria-hidden="true">#</a> 一、mall4j商城系统</h3><p>一个基于spring boot、spring oauth2.0、mybatis、redis的轻量级、前后端分离、防范xss攻击、拥有分布式锁，为生产环境多实例完全准备，数据库为b2b2c设计，拥有完整sku和下单流程的完全开源商城。</p><p><code>Mall4j</code>项目致力于为中小企业打造一个完整、易于维护的开源的电商系统，采用现阶段流行技术实现。后台管理系统包含商品管理、订单管理、运费模板、规格管理、会员管理、运营管理、内容管理、统计报表、权限管理、设置等模块。</p><img src="https://images.gitee.com/uploads/images/2019/0711/174845_6db7724e_5094767.png" style="zoom:50%;"><h3 id="系统功能" tabindex="-1"><a class="header-anchor" href="#系统功能" aria-hidden="true">#</a> 系统功能</h3><p><img src="https://pica.zhimg.com/80/v2-709689d42cb86939dba628e9395d5501_720w.png" alt=""></p><h3 id="技术选型" tabindex="-1"><a class="header-anchor" href="#技术选型" aria-hidden="true">#</a> 技术选型</h3><table><thead><tr><th>技术</th><th>版本</th><th>说明</th></tr></thead><tbody><tr><td>Spring Boot</td><td>2.1.6</td><td>MVC核心框架</td></tr><tr><td>Spring Security oauth2</td><td>2.1.5</td><td>认证和授权框架</td></tr><tr><td>MyBatis</td><td>3.5.0</td><td>ORM框架</td></tr><tr><td>MyBatisPlus</td><td>3.1.0</td><td>基于mybatis，使用lambda表达式的</td></tr><tr><td>Swagger-UI</td><td>2.9.2</td><td>文档生产工具</td></tr><tr><td>Hibernator-Validator</td><td>6.0.17</td><td>验证框架</td></tr><tr><td>redisson</td><td>3.10.6</td><td>对redis进行封装、集成分布式锁等</td></tr><tr><td>hikari</td><td>3.2.0</td><td>数据库连接池</td></tr><tr><td>log4j2</td><td>2.11.2</td><td>更快的log日志工具</td></tr><tr><td>fst</td><td>2.57</td><td>更快的序列化和反序列化工具</td></tr><tr><td>orika</td><td>1.5.4</td><td>更快的bean复制工具</td></tr><tr><td>lombok</td><td>1.18.8</td><td>简化对象封装工具</td></tr><tr><td>hutool</td><td>4.5.0</td><td>更适合国人的java工具集</td></tr><tr><td>swagger-bootstrap</td><td>1.9.3</td><td>基于swagger，更便于国人使用的swagger ui</td></tr></tbody></table><h3 id="目录结构" tabindex="-1"><a class="header-anchor" href="#目录结构" aria-hidden="true">#</a> 目录结构</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>mall4j
├── mall4m -- 小程序代码
├── mall4v -- 后台vue代码
├── yami-shop-admin -- 后台（vue）接口工程[8085]
├── yami-shop-api -- 前端（小程序）接口工程[8086]
├── yami-shop-bean -- 所有公共的实体类，商城基本流程所需的实体类 
├── yami-shop-common -- 前后台需要用到的公共配置，工具类等的集合地
├── yami-shop-mp -- 微信公众号模块
├── yami-shop-quartz -- 定时任务模块
├── yami-shop-security -- oauth2.0 授权认证模块
├── yami-shop-service -- 前后台需要用到的公共的、商城基本流程所需的service，dao的集合地
├── yami-shop-sys -- 后台用户角色权限管理模块
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="相关截图" tabindex="-1"><a class="header-anchor" href="#相关截图" aria-hidden="true">#</a> 相关截图</h3><p>1、后台管理截图</p><p><img src="https://gitee.com/gz-yami/mall4j/raw/master/screenshot/order.png" alt=""></p><p><img src="https://gitee.com/gz-yami/mall4j/raw/master/screenshot/prodList.png" alt=""></p><p>2、小程序截图</p><p><img src="https://images.gitee.com/uploads/images/2019/0706/085234_4eb7509b_5094767.jpeg" alt=""></p><h3 id="二、-mall4cloud微服务商城" tabindex="-1"><a class="header-anchor" href="#二、-mall4cloud微服务商城" aria-hidden="true">#</a> 二、 mall4cloud微服务商城</h3><p>mall4cloud是mall4j的微服务架构。</p><p>微服务架构，分布式部署，静态化分离，高性能高并发，支持负载均衡，支持多端开发</p><p>商城是基于Spring Cloud、Nacos、Seata、Mysql、Redis、RocketMQ、canal、ElasticSearch、minio的微服务B2B2C电商商城系统，采用主流的互联网技术架构、全新的UI设计、支持集群部署、服务注册和发现以及拥有完整的订单流程等，代码完全开源，没有任何二次封装，是一个非常适合二次开发的电商平台系统。</p><p>商城致力于为中大型企业打造一个功能完整、易于维护的微服务B2B2C电商商城系统，采用主流微服务技术实现。后台管理系统包含平台管理，店铺管理、商品管理、订单管理、规格管理、权限管理、资源管理等模块。</p><h3 id="系统功能-1" tabindex="-1"><a class="header-anchor" href="#系统功能-1" aria-hidden="true">#</a> 系统功能</h3><img src="https://19838323.s21i.faiusr.com/2/4/ABUIABACGAAgotivhwYombGKmAUwsAk4gA8.jpg"><h2 id="系统架构" tabindex="-1"><a class="header-anchor" href="#系统架构" aria-hidden="true">#</a> 系统架构</h2><p><img src="https://19838323.s21i.faiusr.com/4/4/ABUIABAEGAAgv8KyiAYotq2x9gQwsAk4whE.png" alt=""></p><h3 id="技术选型-1" tabindex="-1"><a class="header-anchor" href="#技术选型-1" aria-hidden="true">#</a> 技术选型</h3><p><img src="https://gitee.com/gz-yami/mall4cloud/raw/master/doc/img/readme/技术框架.png" alt=""></p><h3 id="目录结构-1" tabindex="-1"><a class="header-anchor" href="#目录结构-1" aria-hidden="true">#</a> 目录结构</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>mall4cloud
├─mall4cloud-api -- 内网接口
│  ├─mall4cloud-api-auth  -- 授权对内接口
│  ├─mall4cloud-api-biz  -- biz对内接口
│  ├─mall4cloud-api-leaf  -- 美团分布式id生成接口
│  ├─mall4cloud-api-multishop  -- 店铺对内接口
│  ├─mall4cloud-api-order  -- 订单对内接口
│  ├─mall4cloud-api-platform  -- 平台对内接口
│  ├─mall4cloud-api-product  -- 商品对内接口
│  ├─mall4cloud-api-rbac  -- 用户角色权限对内接口
│  ├─mall4cloud-api-search  -- 搜索对内接口
│  └─mall4cloud-api-user  -- 用户对内接口
├─mall4cloud-auth  -- 授权校验模块
├─mall4cloud-biz  -- mall4cloud 业务代码。如图片上传/短信等
├─mall4cloud-common -- 一些公共的方法
│  ├─mall4cloud-common-cache  -- 缓存相关公共代码
│  ├─mall4cloud-common-core  -- 公共模块核心（公共中的公共代码）
│  ├─mall4cloud-common-database  -- 数据库连接相关公共代码
│  ├─mall4cloud-common-order  -- 订单相关公共代码
│  ├─mall4cloud-common-product  -- 商品相关公共代码
│  ├─mall4cloud-common-rocketmq  -- rocketmq相关公共代码
│  └─mall4cloud-common-security  -- 安全相关公共代码
├─mall4cloud-gateway  -- 网关
├─mall4cloud-leaf  -- 基于美团leaf的生成id服务
├─mall4cloud-multishop  -- 商家端
├─mall4cloud-order  -- 订单服务
├─mall4cloud-payment  -- 支付服务
├─mall4cloud-platform  -- 平台端
├─mall4cloud-product  -- 商品服务
├─mall4cloud-rbac  -- 用户角色权限模块
├─mall4cloud-search  -- 搜索模块
└─mall4cloud-user  -- 用户服务
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="相关截图-1" tabindex="-1"><a class="header-anchor" href="#相关截图-1" aria-hidden="true">#</a> 相关截图</h3><p>1、后台管理</p><img src="https://gitee.com/gz-yami/mall4cloud/raw/master/doc/img/readme/image-20210705151729559.png"><p><img src="https://gitee.com/gz-yami/mall4cloud/raw/master/doc/img/readme/image-20210705152109738.png" alt=""></p><p>2、小程序截图</p><p><img src="https://gitee.com/gz-yami/mall4cloud/raw/master/doc/img/readme/小程序.png" alt=""></p><h3 id="二、-微同商城" tabindex="-1"><a class="header-anchor" href="#二、-微同商城" aria-hidden="true">#</a> 二、 微同商城</h3><p>开源微信小程序商城（前后端开源：uniapp+Java），秒杀、优惠券、多商户、直播卖货、分销等功能。快速搭建一个属于自己的微信小程序商城。</p><h3 id="项目结构" tabindex="-1"><a class="header-anchor" href="#项目结构" aria-hidden="true">#</a> 项目结构</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>platform
|--platform-admin 后台管理
|--platform-api 微信小程序商城api接口
|--platform-common 公共模块
|--platform-framework 系统WEB合并，请打包发布此项目
|--platform-gen 代码生成
|--platform-mp 微信公众号模块
|--platform-schedule 定时任务
|--platform-shop 商城后台管理
|--uni-mall uniapp版商城
|--wx-mall 微信小程序原生商城
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="技术选型-2" tabindex="-1"><a class="header-anchor" href="#技术选型-2" aria-hidden="true">#</a> 技术选型</h2><ul><li>后端：spring、mybatis、shiro、Redis、mysql、weixin-java-mp</li><li>前端：Vue、iview、layer、bootstrap、froala_editor</li></ul><h3 id="功能列表" tabindex="-1"><a class="header-anchor" href="#功能列表" aria-hidden="true">#</a> 功能列表</h3><p><img src="https://pic1.zhimg.com/80/v2-96e8aaf97c9cd36dd03e998f07f78a1f_720w.png" alt=""></p><h3 id="页面展示" tabindex="-1"><a class="header-anchor" href="#页面展示" aria-hidden="true">#</a> 页面展示</h3><p><img src="https://pic4.zhimg.com/80/v2-22c3bf24b94a4b305cd5bc1794c49a87_720w.png" alt=""></p><p><img src="https://pic1.zhimg.com/80/v2-2d2c28cded48a96298a1a993810e35f1_720w.png" alt=""></p>`,47),r=[t];function n(s,c){return d(),i("div",null,r)}const o=a(l,[["render",n],["__file","开源商城系统.html.vue"]]);export{o as default};
