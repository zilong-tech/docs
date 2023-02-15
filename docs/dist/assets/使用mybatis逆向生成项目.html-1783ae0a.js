import{_ as l,W as r,X as s,Y as t,Z as e,a0 as i,a1 as a,F as o}from"./framework-2afc6763.js";const u={},d=a(`<h3 id="添加依赖" tabindex="-1"><a class="header-anchor" href="#添加依赖" aria-hidden="true">#</a> 添加依赖</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;!--mybatis代码自动生成插件--&gt;
&lt;plugin&gt;
    &lt;groupId&gt;org.mybatis.generator&lt;/groupId&gt;
    &lt;artifactId&gt;mybatis-generator-maven-plugin&lt;/artifactId&gt;
    &lt;version&gt;1.3.6&lt;/version&gt;

&lt;/plugin&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="在resources目录下添加generatorconfig-xml" tabindex="-1"><a class="header-anchor" href="#在resources目录下添加generatorconfig-xml" aria-hidden="true">#</a> 在resources目录下添加generatorConfig.xml</h3><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;!DOCTYPE generatorConfiguration
        PUBLIC &quot;-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN&quot;
        &quot;http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd&quot;&gt;
&lt;generatorConfiguration&gt;

    &lt;!-- 指定连接数据库的JDBC驱动包所在位置，指定到你本机的完整路径 --&gt;
    &lt;classPathEntry location=&quot;D:\\.m2\\repository\\mysql\\mysql-connector-java\\5.1.46\\mysql-connector-java-5.1.46.jar&quot;/&gt;

    &lt;context id=&quot;tables&quot; targetRuntime=&quot;MyBatis3&quot;&gt;


        &lt;plugin type=&quot;org.mybatis.generator.plugins.EqualsHashCodePlugin&quot;&gt;&lt;/plugin&gt;

        &lt;plugin type=&quot;org.mybatis.generator.plugins.SerializablePlugin&quot;&gt;&lt;/plugin&gt;

        &lt;plugin type=&quot;org.mybatis.generator.plugins.ToStringPlugin&quot;&gt;&lt;/plugin&gt;

        &lt;commentGenerator&gt;
            &lt;!-- 这个元素用来去除指定生成的注释中是否包含生成的日期 false:表示保护 --&gt;
            &lt;!-- 如果生成日期，会造成即使修改一个字段，整个实体类所有属性都会发生变化，不利于版本控制，所以设置为true --&gt;
            &lt;property name=&quot;suppressDate&quot; value=&quot;true&quot; /&gt;
            &lt;!-- 是否去除自动生成的注释 true：是 ： false:否 --&gt;
            &lt;property name=&quot;suppressAllComments&quot; value=&quot;true&quot; /&gt;
        &lt;/commentGenerator&gt;


        &lt;!--数据库链接URL，用户名、密码 --&gt;
        &lt;jdbcConnection driverClass=&quot;com.mysql.jdbc.Driver&quot;
                        connectionURL=&quot;jdbc:mysql://xxxx&quot; userId=&quot;xxx&quot; password=&quot;xxx&quot;&gt;
            &lt;!-- 解决table schema中有多个重名的表生成表结构不一致问题 --&gt;
            &lt;property name=&quot;nullCatalogMeansCurrent&quot; value=&quot;true&quot;/&gt;
        &lt;/jdbcConnection&gt;

        &lt;javaTypeResolver&gt;
            &lt;!-- This property is used to specify whether MyBatis Generator should
                force the use of java.math.BigDecimal for DECIMAL and NUMERIC fields, --&gt;
            &lt;property name=&quot;forceBigDecimals&quot; value=&quot;false&quot; /&gt;
        &lt;/javaTypeResolver&gt;

        &lt;!-- 生成模型的包名和位置 --&gt;
        &lt;javaModelGenerator targetPackage=&quot;com.test.model&quot;
                            targetProject=&quot;src/main/java&quot;&gt;
            &lt;property name=&quot;enableSubPackages&quot; value=&quot;true&quot; /&gt;
            &lt;property name=&quot;trimStrings&quot; value=&quot;true&quot; /&gt;
        &lt;/javaModelGenerator&gt;

        &lt;!-- 生成映射文件的包名和位置 --&gt;
        &lt;sqlMapGenerator targetPackage=&quot;/mybatis/mappers&quot;
                         targetProject=&quot;src/main/resources&quot;&gt;
            &lt;property name=&quot;enableSubPackages&quot; value=&quot;true&quot; /&gt;
        &lt;/sqlMapGenerator&gt;

        &lt;!-- 生成DAO的包名和位置 --&gt;
        &lt;javaClientGenerator type=&quot;XMLMAPPER&quot;
                             targetPackage=&quot;com.test.dao.mapper&quot; implementationPackage=&quot;com.test.dao.mapper&quot;  targetProject=&quot;src/main/java&quot;&gt;
            &lt;property name=&quot;enableSubPackages&quot; value=&quot;true&quot; /&gt;
        &lt;/javaClientGenerator&gt;

        &lt;table tableName=&quot;t_core_cold_chain_demand&quot; domainObjectName=&quot;ColdChainDemand&quot;
               enableCountByExample=&quot;true&quot; enableUpdateByExample=&quot;true&quot;
               enableDeleteByExample=&quot;true&quot; enableSelectByExample=&quot;true&quot;
               selectByExampleQueryId=&quot;true&quot;&gt;
        &lt;/table&gt;




    &lt;/context&gt;
&lt;/generatorConfiguration&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="双击mybatis-generator-generate即可逆向生成" tabindex="-1"><a class="header-anchor" href="#双击mybatis-generator-generate即可逆向生成" aria-hidden="true">#</a> 双击mybatis-generator:generate即可逆向生成</h3><h3 id="使用mybatis-generator逆向工程报错-元素类型为-context-的内容必须匹配" tabindex="-1"><a class="header-anchor" href="#使用mybatis-generator逆向工程报错-元素类型为-context-的内容必须匹配" aria-hidden="true">#</a> 使用MyBatis Generator逆向工程报错：元素类型为 “context“ 的内容必须匹配</h3>`,6),c={href:"https://so.csdn.net/so/search?q=mybatis&spm=1001.2101.3001.7020",target:"_blank",rel:"noopener noreferrer"},v={href:"https://so.csdn.net/so/search?q=XML&spm=1001.2101.3001.7020",target:"_blank",rel:"noopener noreferrer"},m=a("<ul><li>缘由 配置文件 generatorConfig.xml 里面的context的子元素<strong>必须按照它给出的顺序</strong>，如错误提示的match“……”部分。 固然也多是你xml文件有错（这个容易检查出来）</li><li>解决方案 <ul><li>将 <strong>property</strong> 标签放在 <strong>context</strong> 内的首位，将 <strong>commentGenerator</strong> 放在<strong>property</strong>后边</li></ul></li><li>标准顺序 (property*,plugin*,commentGenerator?,(connectionFactory|jdbcConnection),javaTypeResolver?,javaModelGenerator,sqlMapGenerator?,javaClientGenerator?,table+)</li></ul>",1);function g(b,q){const n=o("ExternalLinkIcon");return r(),s("div",null,[d,t("p",null,[e("利用"),t("a",c,[e("mybatis"),i(n)]),e(" generator反向生成数据库对应model和mapper时，配置文件出现如下错误java")]),t("blockquote",null,[t("p",null,[e("[ERROR] Failed to execute goal org.mybatis.generator:mybatis-generator-maven-plugin:1.3.5:generate (default-cli) on project SSM-CRUD: "),t("a",v,[e("XML"),i(n)]),e(" Parser Error on line 57: 元素类型为 “context” 的内容必须匹配 “(property*,plugin*,commentGenerator?,(connectionFactory|jdbcConnection),javaTypeResolver?,javaModelGenerator,sqlMapGenerator?,javaClientGenerator?,table+)”。 -> [Help 1]mysql")])]),m])}const y=l(u,[["render",g],["__file","使用mybatis逆向生成项目.html.vue"]]);export{y as default};
