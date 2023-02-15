---
title: 使用mybatis逆向生成项目
author: 程序员子龙
index: true
icon: discover
category:
- Mybatis
---
### 添加依赖

```
<!--mybatis代码自动生成插件-->
<plugin>
    <groupId>org.mybatis.generator</groupId>
    <artifactId>mybatis-generator-maven-plugin</artifactId>
    <version>1.3.6</version>

</plugin>
```

### 在resources目录下添加generatorConfig.xml

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">
<generatorConfiguration>

    <!-- 指定连接数据库的JDBC驱动包所在位置，指定到你本机的完整路径 -->
    <classPathEntry location="D:\.m2\repository\mysql\mysql-connector-java\5.1.46\mysql-connector-java-5.1.46.jar"/>

    <context id="tables" targetRuntime="MyBatis3">


        <plugin type="org.mybatis.generator.plugins.EqualsHashCodePlugin"></plugin>

        <plugin type="org.mybatis.generator.plugins.SerializablePlugin"></plugin>

        <plugin type="org.mybatis.generator.plugins.ToStringPlugin"></plugin>

        <commentGenerator>
            <!-- 这个元素用来去除指定生成的注释中是否包含生成的日期 false:表示保护 -->
            <!-- 如果生成日期，会造成即使修改一个字段，整个实体类所有属性都会发生变化，不利于版本控制，所以设置为true -->
            <property name="suppressDate" value="true" />
            <!-- 是否去除自动生成的注释 true：是 ： false:否 -->
            <property name="suppressAllComments" value="true" />
        </commentGenerator>


        <!--数据库链接URL，用户名、密码 -->
        <jdbcConnection driverClass="com.mysql.jdbc.Driver"
                        connectionURL="jdbc:mysql://xxxx" userId="xxx" password="xxx">
            <!-- 解决table schema中有多个重名的表生成表结构不一致问题 -->
            <property name="nullCatalogMeansCurrent" value="true"/>
        </jdbcConnection>

        <javaTypeResolver>
            <!-- This property is used to specify whether MyBatis Generator should
                force the use of java.math.BigDecimal for DECIMAL and NUMERIC fields, -->
            <property name="forceBigDecimals" value="false" />
        </javaTypeResolver>

        <!-- 生成模型的包名和位置 -->
        <javaModelGenerator targetPackage="com.test.model"
                            targetProject="src/main/java">
            <property name="enableSubPackages" value="true" />
            <property name="trimStrings" value="true" />
        </javaModelGenerator>

        <!-- 生成映射文件的包名和位置 -->
        <sqlMapGenerator targetPackage="/mybatis/mappers"
                         targetProject="src/main/resources">
            <property name="enableSubPackages" value="true" />
        </sqlMapGenerator>

        <!-- 生成DAO的包名和位置 -->
        <javaClientGenerator type="XMLMAPPER"
                             targetPackage="com.test.dao.mapper" implementationPackage="com.test.dao.mapper"  targetProject="src/main/java">
            <property name="enableSubPackages" value="true" />
        </javaClientGenerator>

        <table tableName="t_core_cold_chain_demand" domainObjectName="ColdChainDemand"
               enableCountByExample="true" enableUpdateByExample="true"
               enableDeleteByExample="true" enableSelectByExample="true"
               selectByExampleQueryId="true">
        </table>




    </context>
</generatorConfiguration>
```

### 双击mybatis-generator:generate即可逆向生成

### 使用MyBatis Generator逆向工程报错：元素类型为 “context“ 的内容必须匹配

利用[mybatis](https://so.csdn.net/so/search?q=mybatis&spm=1001.2101.3001.7020) generator反向生成数据库对应model和mapper时，配置文件出现如下错误java

> [ERROR] Failed to execute goal org.mybatis.generator:mybatis-generator-maven-plugin:1.3.5:generate (default-cli) on project SSM-CRUD: [XML](https://so.csdn.net/so/search?q=XML&spm=1001.2101.3001.7020) Parser Error on line 57: 元素类型为 “context” 的内容必须匹配 “(property*,plugin*,commentGenerator?,(connectionFactory|jdbcConnection),javaTypeResolver?,javaModelGenerator,sqlMapGenerator?,javaClientGenerator?,table+)”。 -> [Help 1]mysql

- 缘由
  配置文件 generatorConfig.xml 里面的context的子元素**必须按照它给出的顺序**，如错误提示的match“……”部分。 固然也多是你xml文件有错（这个容易检查出来）
- 解决方案
  - 将 **property** 标签放在 **context** 内的首位，将 **commentGenerator** 放在**property**后边
- 标准顺序
  (property*,plugin*,commentGenerator?,(connectionFactory|jdbcConnection),javaTypeResolver?,javaModelGenerator,sqlMapGenerator?,javaClientGenerator?,table+)