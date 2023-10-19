---
title: ELK处理 SpringBoot 日志，太优雅了!

index: true
icon: discover
category:
- 微服务
---

在排查线上异常的过程中，查询日志总是必不可缺的一部分。现今大多采用的微服务架构，日志被分散在不同的机器上，使得日志的查询变得异常困难。如果此时有一个统一的实时日志分析平台，那可谓是雪中送碳，必定能够提高我们排查线上问题的效率。本文带您了解一下开源的实时日志分析平台 ELK 的搭建及使用。

## ELK 简介

ELK 是一个开源的实时日志分析平台，它主要由 Elasticsearch、Logstash 和 Kiabana 三部分组成。

### Logstash

Logstash 主要用于收集服务器日志，它是一个开源数据收集引擎，具有实时管道功能。Logstash 可以动态地将来自不同数据源的数据统一起来，并将数据标准化到您所选择的目的地。

Logstash 收集数据的过程主要分为以下三个部分：

输入：数据（包含但不限于日志）往往都是以不同的形式、格式存储在不同的系统中，而 Logstash 支持从多种数据源中收集数据（File、Syslog、MySQL、消息中间件等等）。

过滤器：实时解析和转换数据，识别已命名的字段以构建结构，并将它们转换成通用格式。

输出：Elasticsearch 并非存储的唯一选择，Logstash 提供很多输出选择。

### Elasticsearch

Elasticsearch （ES）是一个分布式的 Restful 风格的搜索和数据分析引擎，它具有以下特点：

查询：允许执行和合并多种类型的搜索 — 结构化、非结构化、地理位置、度量指标 — 搜索方式随心而变。

分析：Elasticsearch 聚合让您能够从大处着眼，探索数据的趋势和模式。

速度：很快，可以做到亿万级的数据，毫秒级返回。

可扩展性：可以在笔记本电脑上运行，也可以在承载了 PB 级数据的成百上千台服务器上运行。

弹性：运行在一个分布式的环境中，从设计之初就考虑到了这一点。

灵活性：具备多个案例场景。支持数字、文本、地理位置、结构化、非结构化，所有的数据类型都欢迎。

### Kibana

Kibana 可以使海量数据通俗易懂。它很简单，基于浏览器的界面便于您快速创建和分享动态数据仪表板来追踪 Elasticsearch 的实时数据变化。其搭建过程也十分简单，您可以分分钟完成 Kibana 的安装并开始探索 Elasticsearch 的索引数据 — 没有代码、不需要额外的基础设施。

在 ELK 中，三大组件的大概工作流程如下图所示，由 Logstash 从各个服务中采集日志并存放至 Elasticsearch 中，然后再由 Kiabana 从 Elasticsearch 中查询日志并展示给终端用户。

![](https://img-blog.csdnimg.cn/img_convert/83dfe62759cb25bb48e056e5283524ae.png)



## ELK 实现方案

filebeat,logstash和es都是ELK组件中的标准处理组件。其中，ES是一个高度可扩展的全文搜索和分析引擎，能够对大容量的数据进行接近实时的存储、搜索和分析操作，通常会跟Kibana部署在一起，由Kibana提供图形化的操作功能。LogStash是一个数据收集引擎，他可以动态的从各种数据源搜集数据，并对数据进行过滤、分析和统一格式等简单操作，并将输出结果存储到指定位置上。但是LogStash服务过重，如果在每个应用上都部署一个logStash，会给应用服务器增加很大的负担。因此，通常会在应用服务器上，部署轻量级的filebeat组件。filebeat可以持续稳定的收集简单数据，比如Log日志，统一发给logstash进行收集后，再经过处理存到ES。本篇文章中提供的解决方案如下图所示：

![](http://img.xxfxpt.top/202310131050973.png)



## ELK 平台搭建

本节主要介绍搭建 ELK 日志平台，包括安装  Logstash，filebeat,Elasticsearch 以及 Kibana 组件。完成本小节，您需要做如下准备：

1、一台 centos机器或虚拟机，此处省略了 Elasticsearch 集群的搭建，且将 Logstash、filebeat、Elasticsearch 以及 Kibana 安装在同一机器上。

2、在 centos上安装 JDK，注意 Logstash 要求 JDK 在 1.7 版本以上。

### 安装Logstash

下载地址：https://www.elastic.co/cn/downloads/past-releases#logstash

```shell
wget https://artifacts.elastic.co/downloads/logstash/logstash-7.17.3-linux-x86_64.tar.gz
```

解压压缩包：

```
tar -xzvf logstash-7.17.3-linux-x86_64.tar.gz
```

显示更多简单用例测试，进入到解压目录，并启动一个将控制台输入输出到控制台的管道。

```shell
cd logstash-7.17.3
elk@elk:~/elk/logstash-7.3.0$ bin/logstash -e 'input { stdin {} } output { { stdout {} } }'
```

显示更多看到如下日志就意味着 Logstash 启动成功。

![Logstash 启动成功日志](https://img-blog.csdnimg.cn/img_convert/ef371c95efa75c47173188f40da9da88.png)



在控制台输入 Hello Logstash ，看到如下效果代表 Logstash 安装成功。

清单 1. 验证 Logstash 是否启动成功Hello Logstash

```
{
    "@timestamp" =&gt; 2019-08-10T16:11:10.040Z,
          "host" =&gt; "elk",
      "@version" =&gt; "1",
       "message" =&gt; "Hello Logstash"
}
```

**配置logstash**

进入config目录，在目录下直接修改logstash-sample.conf文件即可。

配置文件名字可以随便取，后续启动时需要指定配置文件。

```
# Sample Logstash configuration for creating a simple
# Beats -> Logstash -> Elasticsearch pipeline.
input {
    beats {
   	 	port => 5044
    }
}
filter {
    grok {
    	match => { "message" => "%{COMBINEDAPACHELOG}"}
    }
}

output {
    elasticsearch {
        hosts => ["http://localhost:9200"]
        #index => "%{[@metadata][beat]}-%{[@metadata][version]}-%{+YYYY.MM.dd}"
        index => nginxlog
        user => "elastic"
        password => "123456"
	}
}
```

input表示输入，这里表示从filebeat输入消息，接收的端口是5044。

output表示数据的输出，这里表示将结果输出到本机的elasticsearch中，索引是nginxlog。

filer表示对输入的内容进行格式化处理。这里指定的grok是logstash内置提供的一个处理非结构化数据的过滤器。他可以以一种类似于正则表达式的方式来解析文本。简单的配置规则比如：%{NUMBER:duration} %{IP:client} 就是从文本中按空格，解析出一个数字型内容，转化成duration字段。然后解析出一个IP格式的文本，转换成client字段。而示例中使用的COMBINEDAPACHELOG则是针对APACHE服务器提供的一种通用的解析格式，对于解析Nginx日志同样适用。

**启动logstash**

```shell
nohup bin/logstash -f config/logstash-sample.conf --config.reload.automatic &
```

config.reload.automatic表示配置自动更新，也就是说以后只要改动了配置文件，就会及时生效，不需要重启logstash

nohup指令只是表示不要占据当前控制台，将控制台日志打印到nohup.out文件中。

### 安装filebeat

logstash服务，通过5044端口监听filebeat服务。接下来就需要在各个应用服务器上部署filebeat，往logstash发送日志消息即可。

filebeat的下载地址： https://www.elastic.co/cn/downloads/past-releases#filebeat

选择7.17.3版本filebeat-7.17.3-linux-x86_64.tar.gz。并使用指令解压

```
tar -zxvf filebeat-7.17.3-linuxx86_64.tar.gz
```

修改filebeat.yml配置文件

```xml
# ============================== Filebeat inputs ===============================
filebeat.inputs:
- type: filestream
# Change to true to enable this input configuration.
enabled: true
# Paths that should be crawled and fetched. Glob based paths.
paths:
- /www/wwwlogs/access.log
#- c:\programdata\elasticsearch\logs\*

# ------------------------------ Logstash Output -------------------------------
output.logstash:
# The Logstash hosts
hosts: ["192.168.65.114:5044"]
```

默认打开的是output.elasticsearch，输入到es，这部分配置要注释掉。

**启动filebeat**

```
nohup ./filebeat -e -c filebeat.yml -d "publish" &
```

filebeat任务启动后，就会读取nginx的日志，一旦有新的日志记录，就会将日志转发到logstash，然后经由logstash再转发到ES中。并且filebeat对于读取过的文件，都是有记录的，即便文件改了名字也不会影响读取的进度。比如对log日志，当前记录的log文件，即便经过日志轮换改成了其他的名字，读取进度也不会有变化。而新生成的log日志也可以继续从头读取内容。如果需要清空filebeat的文件记录，只需要删除安装目录下的data/registry目录即可。

### 安装 Elasticsearch

安装es

```shell
# windows
https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.17.3-windows-x86_64.zip

# centos7 
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.17.3-linux-x86_64.tar.gz
```

解压安装包：

```
tar -xzvf elasticsearch-7.3.0-linux-x86_64.tar.gz
```

启动 Elasticsearch：

```
cd elasticsearch-7.3.0/
bin/elasticsearch -d 
```

在启动 Elasticsearch 的过程中我遇到了两个问题在这里列举一下，方便大家排查。

问题一 ：内存过小，如果您的机器内存小于 Elasticsearch 设置的值，就会报下图所示的错误。解决方案是，修改 elasticsearch-7.3.0/config/jvm.options 文件中的如下配置为适合自己机器的内存大小，若修改后还是报这个错误，可重新连接服务器再试一次。

![内存过小导致 Elasticsearch 启动报错](https://img-blog.csdnimg.cn/img_convert/77a1a7857c367e70a440bbdbcb7b2b60.png)



问题二 ，如果您是以 root 用户启动的话，就会报下图所示的错误。解决方案自然就是添加一个新用户启动 Elasticsearch，至于添加新用户的方法网上有很多，这里就不再赘述。

![Root 用户启动 Elasticsearch 报错](https://img-blog.csdnimg.cn/img_convert/77a1a7857c367e70a440bbdbcb7b2b60.png)



启动成功后，另起一个会话窗口执行 curl http://localhost:9200 命令，如果出现如下结果，则代表 Elasticsearch 安装成功。

清单 2. 检查 Elasticsearch 是否启动成功

```
elk@elk:~$ curl http://localhost:9200
{
  "name" : "elk",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "hqp4Aad0T2Gcd4QyiHASmA",
  "version" : {
    "number" : "7.3.0",
    "build_flavor" : "default",
    "build_type" : "tar",
    "build_hash" : "de777fa",
    "build_date" : "2019-07-24T18:30:11.767338Z",
    "build_snapshot" : false,
    "lucene_version" : "8.1.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

### 安装 Kibana

```shell
#windows
https://artifacts.elastic.co/downloads/kibana/kibana-7.17.3-windows-x86_64.zip

#linux
wget https://artifacts.elastic.co/downloads/kibana/kibana-7.17.3-linux-x86_64.tar.gz
```

解压安装包：

```
tar -xzvf kibana-7.3.0-linux-x86_64.tar.gz
```

修改配置文件 config/kibana.yml ，主要指定 Elasticsearch 的信息。

清单 3. Kibana 配置信息#Elasticsearch主机地址

```
elasticsearch.hosts: "http://ip:9200"
# 允许远程访问
server.host: "0.0.0.0"
# Elasticsearch用户名 这里其实就是我在服务器启动Elasticsearch的用户名
elasticsearch.username: "es"
# Elasticsearch鉴权密码 这里其实就是我在服务器启动Elasticsearch的密码
elasticsearch.password: "es"
```

启动 Kibana：

```
cd kibana-7.3.0-linux-x86_64/bin
./kibana
```

在浏览器中访问 http://ip:5601 ，若出现以下界面，则表示 Kibana 安装成功。

![ Kibana 启动成功界面](https://img-blog.csdnimg.cn/img_convert/710adf2450ec5a06ed0ace9263d3c256.png)



ELK 日志平台安装完成后，下面我们就将通过具体的例子来看下如何使用 ELK，下文将分别介绍如何将 Spring Boot 日志和 Nginx 日志交由 ELK 分析。

## 在 Spring Boot 中使用 ELK

首先我们需要创建一个 Spring Boot 的项目，之前我写过一篇文章介绍 如何使用 AOP 来统一处理 Spring Boot 的 Web 日志 ，本文的 Spring Boot 项目就建立在这篇文章的基础之上。

修改并部署 Spring Boot 项目
在项目 resources 目录下创建 spring-logback.xml 配置文件。

清单 4. Spring Boot 项目 Logback 的配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration debug="false">
    <contextName>Logback For demo Mobile</contextName>
    <property name="LOG_HOME" value="/log" />
    <springProperty scope="context" name="appName" source="spring.application.name"
                    defaultValue="localhost" />
    ...
 
     <appender name="FILE" class="ch.qos.logback.core.FileAppender">
        <file>${LOG_HOME}/log.log</file>
        <append>true</append>
        <encoder>
            <pattern>[${PID:- }] %d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger#%method:%L -%msg%n</pattern>

            <charset>UTF-8</charset>
        </encoder>
    </appender>
    ...
</configuration>
```

以上内容省略了很多内容。在上面的配置中我们定义了一个名为 ROLLING_FILE 的 Appender 往日志文件中输出指定格式的日志。而上面的 pattern 标签正是具体日志格式的配置，通过上面的配置，我们指定输出了时间、线程、日志级别、logger（通常为日志打印所在类的全路径）以及服务名称等信息。

将项目打包，并部署到服务器上。

清单 5. 打包并部署 Spring Boot 项目

```
# 打包命令
mvn package -Dmaven.test.skip=true
# 部署命令
java -jar sb-elk-start-0.0.1-SNAPSHOT.jar
```

配置**Logstash**

```
input {
   beats {
   		 port => 5044
    }
}
 
filter {
     #定义数据的格式
     grok {
       match => { 
         "message" => "(?m)^\[%{INT:pid}\]%{SPACE}%{TIMESTAMP_ISO8601:createTime}%{SPACE}\[%{DATA:threadName}\]%{SPACE}%{LOGLEVEL:LEVEL}%{SPACE}%{JAVACLASS:javaClass}#(?<methodName>[a-zA-Z_]+):%{INT:linenumber}%{SPACE}-%{GREEDYDATA:msg}"

     }
}
 
output {
    stdout {}
    elasticsearch {
        hosts => "localhost:9200"
        index => "logback"
   }
}
```

**查看效果**

经过上面的步骤，我们已经完成了整个 ELK 平台的搭建以及 Spring Boot 项目的接入。下面我们按照以下步骤执行一些操作来看下效果。

调用 Spring Boot 接口，此时应该已经有数据写入到 ES 中了。

在浏览器中访问 http://ip:5601 ，打开 Kibana 的 Web 界面，并且如下图所示添加 logback 索引。

![在 Kibana 中添加 Elasticsearch 索引](https://img-blog.csdnimg.cn/img_convert/3dbb00f2fdfadb3dcb0dd4f1cdfb22f7.png)



进入 Discover 界面，选择 logback 索引，就可以看到日志数据了，如下图所示。

![ ELK 日志查看](https://img-blog.csdnimg.cn/img_convert/46d601dcd0288f876589bff8de67ed66.png)



## 在 Nginx 中使用 ELK

相信通过上面的步骤您已经成功的搭建起了自己的 ELK 实时日志平台，并且接入了 Logback 类型的日志。但是实际场景下，几乎不可能只有一种类型的日志，下面我们就再在上面步骤的基础之上接入 Nginx 的日志。当然这一步的前提是我们需要在服务器上安装 Nginx，具体的安装过程网上有很多介绍，这里不再赘述。查看 Nginx 的日志如下（Nginx 的访问日志默认在 /var/log/nginx/access.log 文件中）。

清单 9. Nginx 的访问日志

```
192.168.142.1 - - [17/Aug/2019:21:31:43 +0800] "GET /weblog/get-test?name=elk HTTP/1.1"
200 3 "http://192.168.142.131/swagger-ui.html" "Mozilla/5.0 (Windows NT 10.0; Win64; x64)
AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36"
```

解析出来的是一个json格式的数据，包含以下字段：

| **Information**     | **Field Name** |
| ------------------- | -------------- |
| IP Address          | clientip       |
| User ID             | ident          |
| User Authentication | auth           |
| timestamp           | timestamp      |
| HTTP Verb           | verb           |
| Request body        | request        |
| HTTP Version        | httpversion    |
| HTTP Status Code    | response       |
| Bytes served        | bytes          |
| User agent          | agent          |

同样，我们需要为此日志编写一个 Grok 解析规则，如下所示：

清单 10. 针对 Nginx 访问日志的 Grok 解析规则

```
%{IPV4:ip} \- \- \[%{HTTPDATE:time}\] "%{NOTSPACE:method} %{DATA:requestUrl}
HTTP/%{NUMBER:httpVersion}" %{NUMBER:httpStatus} %{NUMBER:bytes}
"%{DATA:referer}" "%{DATA:agent}"
```



