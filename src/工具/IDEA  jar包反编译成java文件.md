---
title: IDEA  jar包反编译成java文件

index: true
icon: discover
category:
- 工具
---


1.根据安装的idea找到如下路径

![](http://www.itmind.net/wp-content/uploads/2023/09/1695285638-ac9ee7fb73e27a7.png)

2.将所需的jar包放到同目录下，并创建与jar包名称相同的空文件夹 

3.在java-decompiler.jar包中在导航栏输入cmd进入命令提示符中

4。在命令提示符中输入如下代码：

        java -cp "D:\software\IntelliJ IDEA 2021.1.1\plugins\java-decompiler\lib\java-decompiler.jar" org.jetbrains.java.decompiler.main.decompiler.ConsoleDecompiler -dgs=true XXX.jar aaa 

xxx:jar名称  aaa是文件夹名称

5.程序编译完成之后会在你创建的文件夹中生成编译之后的jar包，直接解压就可以了