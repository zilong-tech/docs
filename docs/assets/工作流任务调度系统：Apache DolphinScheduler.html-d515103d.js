import{_ as i,W as t,X as o,Y as s,Z as e,a0 as l,a1 as n,F as r}from"./framework-2afc6763.js";const d={},c=n('<h1 id="工作流任务调度系统-apache-dolphinscheduler" tabindex="-1"><a class="header-anchor" href="#工作流任务调度系统-apache-dolphinscheduler" aria-hidden="true">#</a> 工作流任务调度系统：Apache DolphinScheduler</h1><h3 id="一个分布式且易于扩展的可视化工作流调度器系统" tabindex="-1"><a class="header-anchor" href="#一个分布式且易于扩展的可视化工作流调度器系统" aria-hidden="true">#</a> 一个分布式且易于扩展的可视化工作流调度器系统</h3><h3 id="特点" tabindex="-1"><a class="header-anchor" href="#特点" aria-hidden="true">#</a> 特点</h3><p>DolphinScheduler提供了许多易于使用的功能，可加快数据ETL工作开发流程的效率。其主要特点如下：</p><ul><li>通过拖拽以DAG 图的方式将 Task 按照任务的依赖关系关联起来，可实时可视化监控任务的运行状态；</li><li>支持丰富的任务类型；</li><li>支持工作流定时调度、依赖调度、手动调度、手动暂停/停止/恢复，同时支持失败重试/告警、从指定节点恢复失败、Kill 任务等操作；</li><li>支持工作流全局参数及节点自定义参数设置；</li><li>支持集群HA，通过 Zookeeper实现 Master 集群和 Worker 集群去中心化；</li><li>支持工作流运行历史树形/甘特图展示、支持任务状态统计、流程状态统计；</li><li>支持补数，并行或串行回填数据。</li></ul><h3 id="系统架构" tabindex="-1"><a class="header-anchor" href="#系统架构" aria-hidden="true">#</a> 系统架构</h3><p><img src="https://dolphinscheduler.apache.org/img/archdiagram_es.svg" alt="">b</p><h3 id="系统部署" tabindex="-1"><a class="header-anchor" href="#系统部署" aria-hidden="true">#</a> 系统部署</h3>',8),p={href:"https://dolphinscheduler.apache.org/en-us/docs/latest/user_doc/cluster-deployment.html",target:"_blank",rel:"noopener noreferrer"},u=s("h1",{id:"_1、安装基础软件-需要的软件请自行安装",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#_1、安装基础软件-需要的软件请自行安装","aria-hidden":"true"},"#"),e(" 1、安装基础软件（需要的软件请自行安装）")],-1),v=s("li",null,"PostgreSQL (8.2.15+) 或 MySQL (5.7) : 选择一个，如果使用 MySQL，则需要 JDBC Driver 5.1.47+",-1),m={href:"https://www.oracle.com/technetwork/java/javase/downloads/index.html",target:"_blank",rel:"noopener noreferrer"},h=s("li",null,"ZooKeeper (3.4.6+)：必需",-1),b=s("li",null,"pstree 或 psmisc ：Mac OS 需要“pstree”，Fedora/Red/Hat/CentOS/Ubuntu/Debian 需要“psmisc”",-1),k=s("li",null,"Hadoop (2.6+) 或 MinIO：可选。如果需要资源功能，单机部署可以选择本地目录作为上传目的地（这里不需要部署Hadoop）。当然你也可以选择上传到Hadoop或者MinIO。",-1),g=n(`<div class="language-markdown line-numbers-mode" data-ext="md"><pre class="language-markdown"><code> Tips: DolphinScheduler itself does not rely on Hadoop, Hive, Spark, only use their clients to run corresponding task.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h1 id="_2、下载二进制tar-gz包。" tabindex="-1"><a class="header-anchor" href="#_2、下载二进制tar-gz包。" aria-hidden="true">#</a> 2、下载二进制tar.gz包。</h1>`,2),f={href:"https://dolphinscheduler.apache.org/en-us/download/download.html",target:"_blank",rel:"noopener noreferrer"},_=n(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># Create the deployment directory. Please do not choose a high-privilege directory such as /root or /home.</span>
<span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /opt/dolphinscheduler<span class="token punctuation">;</span>
<span class="token builtin class-name">cd</span> /opt/dolphinscheduler<span class="token punctuation">;</span>

<span class="token comment"># uncompress</span>
<span class="token function">tar</span> <span class="token parameter variable">-zxvf</span> apache-dolphinscheduler-1.3.8-bin.tar.gz <span class="token parameter variable">-C</span> /opt/dolphinscheduler<span class="token punctuation">;</span>

<span class="token comment"># rename</span>
<span class="token function">mv</span> apache-dolphinscheduler-1.3.8-bin  dolphinscheduler-bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="_3、创建部署用户并分配目录操作权限" tabindex="-1"><a class="header-anchor" href="#_3、创建部署用户并分配目录操作权限" aria-hidden="true">#</a> 3、创建部署用户并分配目录操作权限</h1><ul><li>创建部署用户，一定要配置sudo secret-free。这里以创建 dolphinscheduler 用户为例。</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># To create a user, you need to log in as root and set the deployment user name.</span>
<span class="token function">useradd</span> dolphinscheduler<span class="token punctuation">;</span>

<span class="token comment"># Set the user password, please modify it yourself.</span>
<span class="token builtin class-name">echo</span> <span class="token string">&quot;dolphinscheduler123&quot;</span> <span class="token operator">|</span> <span class="token function">passwd</span> <span class="token parameter variable">--stdin</span> dolphinscheduler

<span class="token comment"># Configure sudo secret-free</span>
<span class="token builtin class-name">echo</span> <span class="token string">&#39;dolphinscheduler  ALL=(ALL)  NOPASSWD: NOPASSWD: ALL&#39;</span> <span class="token operator">&gt;&gt;</span> /etc/sudoers
<span class="token function">sed</span> <span class="token parameter variable">-i</span> <span class="token string">&#39;s/Defaults    requirett/#Defaults    requirett/g&#39;</span> /etc/sudoers

<span class="token comment"># Modify the directory permissions so that the deployment user has operation permissions on the dolphinscheduler-bin directory</span>
<span class="token function">chown</span> <span class="token parameter variable">-R</span> dolphinscheduler:dolphinscheduler dolphinscheduler-bin
 Notes：
 - Because the task execution is based on <span class="token string">&#39;sudo -u {linux-user}&#39;</span> to switch among different Linux <span class="token function">users</span> to implement multi-tenant job running, so the deployment user must have <span class="token function">sudo</span> permissions and is secret-free. If beginner learners don’t understand, you can ignore this point <span class="token keyword">for</span> now.
 - Please comment out line <span class="token string">&quot;Defaults requirett&quot;</span>, <span class="token keyword">if</span> it present <span class="token keyword">in</span> <span class="token string">&quot;/etc/sudoers&quot;</span> file. 
 - If you need to use resource upload, you need to assign user the permission to operate the <span class="token builtin class-name">local</span> <span class="token function">file</span> system, HDFS or MinIO.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="_4、ssh免密配置" tabindex="-1"><a class="header-anchor" href="#_4、ssh免密配置" aria-hidden="true">#</a> 4、SSH免密配置</h1><ul><li><p>切换到部署用户，配置SSH本地免密登录</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">su</span> dolphinscheduler<span class="token punctuation">;</span>

ssh-keygen <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-P</span> <span class="token string">&#39;&#39;</span> <span class="token parameter variable">-f</span> ~/.ssh/id_rsa
<span class="token function">cat</span> ~/.ssh/id_rsa.pub <span class="token operator">&gt;&gt;</span> ~/.ssh/authorized_keys
<span class="token function">chmod</span> <span class="token number">600</span> ~/.ssh/authorized_keys
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><p>注意：<em>如果配置成功，dolphinscheduler 用户在执行命令时不需要输入密码<code>ssh localhost</code>。</em></p><h1 id="_5、数据库初始化" tabindex="-1"><a class="header-anchor" href="#_5、数据库初始化" aria-hidden="true">#</a> 5、数据库初始化</h1><ul><li>登录数据库，默认数据库类型为PostgreSQL。如果选择MySQL，需要将mysql-connector-java驱动包添加到DolphinScheduler的lib目录下。</li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>mysql -uroot -p
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>登录数据库命令行窗口后，执行数据库初始化命令并设置用户和密码。</li></ul><p><strong>注意：{user} 和 {password} 需要替换为特定的数据库用户名和密码。</strong></p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>   mysql&gt; CREATE DATABASE dolphinscheduler DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
   mysql&gt; GRANT ALL PRIVILEGES ON dolphinscheduler.* TO &#39;{user}&#39;@&#39;%&#39; IDENTIFIED BY &#39;{password}&#39;;
   mysql&gt; GRANT ALL PRIVILEGES ON dolphinscheduler.* TO &#39;{user}&#39;@&#39;localhost&#39; IDENTIFIED BY &#39;{password}&#39;;
   mysql&gt; flush privileges;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13),x=n(`<p>创建表并导入基本数据</p><ul><li>在conf目录下的datasource.properties中修改如下配置。</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>  <span class="token function">vi</span> conf/datasource.properties
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,3),q={href:"https://downloads.mysql.com/archives/c-j/",target:"_blank",rel:"noopener noreferrer"},y=n(`<div class="language-properties line-numbers-mode" data-ext="properties"><pre class="language-properties"><code><span class="token comment">  #postgre</span>
<span class="token comment">  #spring.datasource.driver-class-name=org.postgresql.Driver</span>
<span class="token comment">  #spring.datasource.url=jdbc:postgresql://localhost:5432/dolphinscheduler</span>
<span class="token comment">  # mysql</span>
<span class="token key attr-name">  spring.datasource.driver-class-name</span><span class="token punctuation">=</span><span class="token value attr-value">com.mysql.jdbc.Driver</span>
<span class="token key attr-name">  spring.datasource.url</span><span class="token punctuation">=</span><span class="token value attr-value">jdbc:mysql://xxx:3306/dolphinscheduler?useUnicode=true&amp;characterEncoding=UTF-8&amp;allowMultiQueries=true     # Replace the correct IP address</span>
<span class="token key attr-name">  spring.datasource.username</span><span class="token punctuation">=</span><span class="token value attr-value">xxx						# replace the correct {username} value</span>
<span class="token key attr-name">  spring.datasource.password</span><span class="token punctuation">=</span><span class="token value attr-value">xxx						# replace the correct {password} value</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),S={href:"http://create-dolphinscheduler.sh/",target:"_blank",rel:"noopener noreferrer"},A=n(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">sh</span> script/create-dolphinscheduler.sh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,1),H=n(`<p><em>注意：如果你执行上面的脚本和报告“/斌/ java的：没有这样的文件或目录”的错误，请设置JAVA_HOME和/ etc / profile文件的PATH变量。</em></p><h1 id="_6、修改运行时参数。" tabindex="-1"><a class="header-anchor" href="#_6、修改运行时参数。" aria-hidden="true">#</a> 6、修改运行时参数。</h1><ul><li><p>修改<code>dolphinscheduler_env.sh</code>&#39;conf/env&#39;目录下文件中的环境变量（以&#39;/opt/soft&#39;下安装的相关软件为例）</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>    <span class="token builtin class-name">export</span> <span class="token assign-left variable">HADOOP_HOME</span><span class="token operator">=</span>/opt/soft/hadoop
    <span class="token builtin class-name">export</span> <span class="token assign-left variable">HADOOP_CONF_DIR</span><span class="token operator">=</span>/opt/soft/hadoop/etc/hadoop
    <span class="token comment">#export SPARK_HOME1=/opt/soft/spark1</span>
    <span class="token builtin class-name">export</span> <span class="token assign-left variable">SPARK_HOME2</span><span class="token operator">=</span>/opt/soft/spark2
    <span class="token builtin class-name">export</span> <span class="token assign-left variable">PYTHON_HOME</span><span class="token operator">=</span>/opt/soft/python
    <span class="token builtin class-name">export</span> <span class="token assign-left variable">JAVA_HOME</span><span class="token operator">=</span>/opt/soft/java
    <span class="token builtin class-name">export</span> <span class="token assign-left variable">HIVE_HOME</span><span class="token operator">=</span>/opt/soft/hive
    <span class="token builtin class-name">export</span> <span class="token assign-left variable">FLINK_HOME</span><span class="token operator">=</span>/opt/soft/flink
    <span class="token builtin class-name">export</span> <span class="token assign-left variable">DATAX_HOME</span><span class="token operator">=</span>/opt/soft/datax/bin/datax.py
    <span class="token builtin class-name">export</span> <span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span><span class="token variable">$HADOOP_HOME</span>/bin:<span class="token variable">$SPARK_HOME2</span>/bin:<span class="token variable">$PYTHON_HOME</span><span class="token builtin class-name">:</span><span class="token variable">$JAVA_HOME</span>/bin:<span class="token variable">$HIVE_HOME</span>/bin:<span class="token environment constant">$PATH</span><span class="token builtin class-name">:</span><span class="token variable">$FLINK_HOME</span>/bin:<span class="token variable">$DATAX_HOME</span><span class="token builtin class-name">:</span><span class="token environment constant">$PATH</span>

    \`\`<span class="token variable"><span class="token variable">\`</span>

 <span class="token variable">\`</span></span>Note: This step is very important. For example, JAVA_HOME and <span class="token environment constant">PATH</span> must be configured. Those that are not used can be ignored or commented out. If you can not <span class="token function">find</span> dolphinscheduler_env.sh, please run <span class="token function">ls</span> -a.\`
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>创建JDK软链接到/usr/bin/java（仍以JAVA_HOME=/opt/soft/java为例）</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">sudo</span> <span class="token function">ln</span> <span class="token parameter variable">-s</span> /opt/soft/java/bin/java /usr/bin/java
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p>修改一键部署配置文件中的参数<code>conf/config/install_config.conf</code>，特别注意以下参数的配置。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># choose mysql or postgresql</span>
<span class="token assign-left variable">dbtype</span><span class="token operator">=</span><span class="token string">&quot;mysql&quot;</span>

<span class="token comment"># Database connection address and port</span>
<span class="token assign-left variable">dbhost</span><span class="token operator">=</span><span class="token string">&quot;localhost:3306&quot;</span>

<span class="token comment"># database name</span>
<span class="token assign-left variable">dbname</span><span class="token operator">=</span><span class="token string">&quot;dolphinscheduler&quot;</span>

<span class="token comment"># database username</span>
<span class="token assign-left variable">username</span><span class="token operator">=</span><span class="token string">&quot;xxx&quot;</span>

<span class="token comment"># database password</span>
<span class="token comment"># NOTICE: if there are special characters, please use the \\ to escape, for example, \`[\` escape to \`\\[\`</span>
<span class="token assign-left variable">password</span><span class="token operator">=</span><span class="token string">&quot;xxx&quot;</span>

<span class="token comment"># Zookeeper address, localhost:2181, remember port 2181</span>
<span class="token assign-left variable">zkQuorum</span><span class="token operator">=</span><span class="token string">&quot;localhost:2181&quot;</span>

<span class="token comment"># Note: the target installation path for dolphinscheduler, please do not use current path (pwd)</span>
<span class="token assign-left variable">installPath</span><span class="token operator">=</span><span class="token string">&quot;/opt/soft/dolphinscheduler&quot;</span>

<span class="token comment"># deployment user</span>
<span class="token comment"># Note: the deployment user needs to have sudo privileges and permissions to operate hdfs. If hdfs is enabled, the root directory needs to be created by itself</span>
<span class="token assign-left variable">deployUser</span><span class="token operator">=</span><span class="token string">&quot;dolphinscheduler&quot;</span>

<span class="token comment"># alert config，take QQ email for example</span>
<span class="token comment"># mail protocol</span>
<span class="token assign-left variable">mailProtocol</span><span class="token operator">=</span><span class="token string">&quot;SMTP&quot;</span>

<span class="token comment"># mail server host</span>
<span class="token assign-left variable">mailServerHost</span><span class="token operator">=</span><span class="token string">&quot;smtp.qq.com&quot;</span>

<span class="token comment"># mail server port</span>
<span class="token comment"># note: Different protocols and encryption methods correspond to different ports, when SSL/TLS is enabled, port may be different, make sure the port is correct.</span>
<span class="token assign-left variable">mailServerPort</span><span class="token operator">=</span><span class="token string">&quot;25&quot;</span>

<span class="token comment"># mail sender</span>
<span class="token assign-left variable">mailSender</span><span class="token operator">=</span><span class="token string">&quot;xxx@qq.com&quot;</span>

<span class="token comment"># mail user</span>
<span class="token assign-left variable">mailUser</span><span class="token operator">=</span><span class="token string">&quot;xxx@qq.com&quot;</span>

<span class="token comment"># mail sender password</span>
<span class="token comment"># note: The mail.passwd is email service authorization code, not the email login password.</span>
<span class="token assign-left variable">mailPassword</span><span class="token operator">=</span><span class="token string">&quot;xxx&quot;</span>

<span class="token comment"># Whether TLS mail protocol is supported,true is supported and false is not supported</span>
<span class="token assign-left variable">starttlsEnable</span><span class="token operator">=</span><span class="token string">&quot;true&quot;</span>

<span class="token comment"># Whether TLS mail protocol is supported,true is supported and false is not supported。</span>
<span class="token comment"># note: only one of TLS and SSL can be in the true state.</span>
<span class="token assign-left variable">sslEnable</span><span class="token operator">=</span><span class="token string">&quot;false&quot;</span>

<span class="token comment"># note: sslTrust is the same as mailServerHost</span>
<span class="token assign-left variable">sslTrust</span><span class="token operator">=</span><span class="token string">&quot;smtp.qq.com&quot;</span>

<span class="token comment"># resource storage type：HDFS,S3,NONE</span>
<span class="token assign-left variable">resourceStorageType</span><span class="token operator">=</span><span class="token string">&quot;HDFS&quot;</span>

<span class="token comment"># here is an example of saving to a local file system</span>
<span class="token comment"># Note: If you want to upload resource file(jar file and so on)to HDFS and the NameNode has HA enabled, you need to put core-site.xml and hdfs-site.xml of hadoop cluster in the installPath/conf directory. In this example, it is placed under /opt/soft/dolphinscheduler/conf, and Configure the namenode cluster name; if the NameNode is not HA, modify it to a specific IP or host name.</span>
<span class="token assign-left variable">defaultFS</span><span class="token operator">=</span><span class="token string">&quot;file:///data/dolphinscheduler&quot;</span>

<span class="token comment"># if not use hadoop resourcemanager, please keep default value; if resourcemanager HA enable, please type the HA ips ; if resourcemanager is single, make this value empty</span>
<span class="token comment"># Note: For tasks that depend on YARN to execute, you need to ensure that YARN information is configured correctly in order to ensure successful execution results.</span>
<span class="token assign-left variable">yarnHaIps</span><span class="token operator">=</span><span class="token string">&quot;192.168.xx.xx,192.168.xx.xx&quot;</span>

<span class="token comment"># if resourcemanager HA enable or not use resourcemanager, please skip this value setting; If resourcemanager is single, you only need to replace yarnIp1 to actual resourcemanager hostname.</span>
<span class="token assign-left variable">singleYarnIp</span><span class="token operator">=</span><span class="token string">&quot;yarnIp1&quot;</span>

<span class="token comment"># resource store on HDFS/S3 path, resource file will store to this hadoop hdfs path, self configuration, please make sure the directory exists on hdfs and have read write permissions。/dolphinscheduler is recommended</span>
<span class="token assign-left variable">resourceUploadPath</span><span class="token operator">=</span><span class="token string">&quot;/data/dolphinscheduler&quot;</span>

<span class="token comment"># specify the user who have permissions to create directory under HDFS/S3 root path</span>
<span class="token assign-left variable">hdfsRootUser</span><span class="token operator">=</span><span class="token string">&quot;hdfs&quot;</span>

<span class="token comment"># api server port</span>
<span class="token assign-left variable">apiServerPort</span><span class="token operator">=</span><span class="token string">&quot;12345&quot;</span>

<span class="token comment"># On which machines to deploy the DS service, choose localhost for this machine</span>
<span class="token assign-left variable">ips</span><span class="token operator">=</span><span class="token string">&quot;localhost&quot;</span>

<span class="token comment"># ssh port, default 22</span>
<span class="token comment"># Note: if ssh port is not default, modify here</span>
<span class="token assign-left variable">sshPort</span><span class="token operator">=</span><span class="token string">&quot;22&quot;</span>

<span class="token comment"># run master machine</span>
<span class="token assign-left variable">masters</span><span class="token operator">=</span><span class="token string">&quot;localhost&quot;</span>

<span class="token comment"># run worker machine</span>
<span class="token assign-left variable">workers</span><span class="token operator">=</span><span class="token string">&quot;localhost&quot;</span>

<span class="token comment"># run alert machine</span>
<span class="token assign-left variable">alertServer</span><span class="token operator">=</span><span class="token string">&quot;localhost&quot;</span>

<span class="token comment"># run api machine</span>
<span class="token assign-left variable">apiServers</span><span class="token operator">=</span><span class="token string">&quot;localhost&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>*注意：*如果您需要上传资源功能，请执行以下命令：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>sudo mkdir /data/dolphinscheduler
sudo chown -R dolphinscheduler:dolphinscheduler /data/dolphinscheduler 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h1 id="_7、自动化部署" tabindex="-1"><a class="header-anchor" href="#_7、自动化部署" aria-hidden="true">#</a> 7、自动化部署</h1><ul><li><p>切换到部署用户，执行一键部署脚本</p><p><code>sh install.sh</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Note:
For the first deployment, the following message appears in step 3 of \`3, stop server\` during operation. This message can be ignored.
sh: bin/dolphinscheduler-daemon.sh: No such file or directory
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p>脚本完成后，将启动以下 5 个服务。使用<code>jps</code>命令检查服务是否启动（<code>jps</code>自带<code>java JDK</code>）</p></li></ul><div class="language-aidl line-numbers-mode" data-ext="aidl"><pre class="language-aidl"><code>    MasterServer         ----- master service
    WorkerServer         ----- worker service
    LoggerServer         ----- logger service
    ApiApplicationServer ----- api service
    AlertServer          ----- alert service
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果以上服务正常启动，则自动部署成功。</p><p>部署成功后，可以查看日志。日志存储在日志文件夹中。</p><div class="language-log line-numbers-mode" data-ext="log"><pre class="language-log"><code> logs<span class="token operator">/</span>
    ├── <span class="token domain constant">dolphinscheduler-alert-server.log</span>
    ├── <span class="token domain constant">dolphinscheduler-master-server.log</span>
    <span class="token operator">|</span>—— <span class="token domain constant">dolphinscheduler-worker-server.log</span>
    <span class="token operator">|</span>—— <span class="token domain constant">dolphinscheduler-api-server.log</span>
    <span class="token operator">|</span>—— <span class="token domain constant">dolphinscheduler-logger-server.log</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="_8、登录" tabindex="-1"><a class="header-anchor" href="#_8、登录" aria-hidden="true">#</a> 8、登录</h1><ul><li><p>访问首页地址，接口IP（自行修改） http://ip:12345/dolphinscheduler</p><p><img src="https://dolphinscheduler.apache.org/img/login.png" alt="img"></p></li></ul><h1 id="_9、启动和停止服务" tabindex="-1"><a class="header-anchor" href="#_9、启动和停止服务" aria-hidden="true">#</a> 9、启动和停止服务</h1><ul><li><p>停止所有服务</p><p><code>sh ./bin/stop-all.sh</code></p></li><li><p>启动所有服务</p><p><code>sh ./bin/start-all.sh</code></p></li><li><p>启动和停止主服务</p></li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">sh</span> ./bin/dolphinscheduler-daemon.sh start master-server
<span class="token function">sh</span> ./bin/dolphinscheduler-daemon.sh stop master-server
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>启动和停止工作服务</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">sh</span> ./bin/dolphinscheduler-daemon.sh start worker-server
<span class="token function">sh</span> ./bin/dolphinscheduler-daemon.sh stop worker-server
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>启动和停止api服务</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">sh</span> ./bin/dolphinscheduler-daemon.sh start api-server
<span class="token function">sh</span> ./bin/dolphinscheduler-daemon.sh stop api-server
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>启动和停止记录器服务</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">sh</span> ./bin/dolphinscheduler-daemon.sh start logger-server
<span class="token function">sh</span> ./bin/dolphinscheduler-daemon.sh stop logger-server
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>启动和停止警报服务</li></ul><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">sh</span> ./bin/dolphinscheduler-daemon.sh start alert-server
<span class="token function">sh</span> ./bin/dolphinscheduler-daemon.sh stop alert-server
Note: Please refer to the <span class="token string">&quot;Architecture Design&quot;</span> section <span class="token keyword">for</span> <span class="token function">service</span> usage
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>项目地址：https://github.com/apache/dolphinscheduler</p>`,23);function w(E,D){const a=r("ExternalLinkIcon");return t(),o("div",null,[c,s("p",null,[e("本文介绍的是独立部署方式，更多部署方式请参考官网："),s("a",p,[e("https://dolphinscheduler.apache.org/en-us/docs/latest/user_doc/cluster-deployment.html"),l(a)])]),u,s("ul",null,[v,s("li",null,[s("a",m,[e("JDK"),l(a)]),e(" (1.8+) ：必需。仔细检查在 /etc/profile 中配置 JAVA_HOME 和 PATH 环境变量")]),h,b,k]),g,s("ul",null,[s("li",null,[e("请下载最新版本安装包到服务器部署目录。例如，使用/opt/dolphinscheduler 作为安装和部署目录。下载地址："),s("a",f,[e("下载"),l(a)]),e("，下载包，移动到部署目录解压。")])]),_,s("ul",null,[s("li",null,[x,s("ul",null,[s("li",null,[e("如果选择Mysql，请注释掉PostgreSQL的相关配置（反之亦然），还需要手动添加【[mysql-connector-java驱动jar]（"),s("a",q,[e("https://downloads.mysql.com/archives/cj/"),l(a)]),e(" )] 打包到lib目录，然后正确配置数据库连接信息。")])]),y,s("ul",null,[s("li",null,[e("修改保存后，在脚本目录下执行**"),s("a",S,[e("create-dolphinscheduler.sh"),l(a)]),e("**。")])]),A])]),H])}const T=i(d,[["render",w],["__file","工作流任务调度系统：Apache DolphinScheduler.html.vue"]]);export{T as default};
