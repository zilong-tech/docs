---
title: SpringCloud集成 报错 An attempt was made to call a method that does not exist
author: 程序员子龙
index: true
icon: discover
category:
- SpringCloud
---
SpringCloud集成 报错 An attempt was made to call a method that does not exist. The attempt was made from the following location:
详细报错结果如下：原因是SpringCloud和spring-boot-starter-parent的版本配置不搭配
![](https://img-blog.csdnimg.cn/2020061322360382.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3MjQ4NTA0,size_16,color_FFFFFF,t_70)

解决方法：参考官方推荐的版本

https://github.com/alibaba/spring-cloud-alibaba/wiki/%E7%89%88%E6%9C%AC%E8%AF%B4%E6%98%8E

![](https://gitee.com/zysspace/pic/raw/master/images/202205022046645.png)

例如我选用的spring cloud 版本是Greenwich.SR3，原来spring boot 版本是2.3.2.RELEASE，调整成2.1.7.RELEASE