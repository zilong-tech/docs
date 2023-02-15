---
title: MobaXterm详细使用教程
author: 程序员子龙
index: true
icon: discover
category:
- 工具
---
MobaXterm 又名 MobaXVT，是一款增强型终端、X 服务器和 Unix 命令集(GNU/ Cygwin)工具箱。

**MobaXterm主要功能：**

- 支持各种连接 SSH，X11，RDP，VNC，FTP，MOSH
- 支持 Unix 命令(bash，ls，cat，sed，grep，awk，rsync，…)
- 连接 SSH 终端后支持 SFTP 传输文件
- 各种丰富的插件(git/dig/aria2…)
- 可运行 Windows 或软件

**1. 软件的安装**

官网下载后解压文件，运行 MobaXterm_Personal_11.1.exe 即可开始安装。第一次打开会自解压，会比较慢，后续就正常了。

[下载软件](https://www.aliyundrive.com/s/qFgkPx5RKve)

**2. 创建SSH session**

安装完毕之后界面长这个样。



[![FobGavin: MobaXterm详细使用教程（一）](https://img-blog.csdnimg.cn/img_convert/63da948e098f1ffc644d5e9fad2cb6b8.png)](http://www.fobgavin.com/wp-content/uploads/2019/07/FobGavin.com_MobaXterm_1-.jpg)

当然你们刚安装完成是不会有任何session的。下面来创建第一个SSH session。

点击菜单栏 「sessions」 –> 「new session」，即可弹出 「session setting」 对话框。由上面那一大串的连接方式我们就可以知道Moba的强大之处。



[![FobGavin: MobaXterm详细使用教程（一）](https://img-blog.csdnimg.cn/img_convert/cc1e3d9a6e3c5a89a81183996a9ff7eb.png)](http://www.fobgavin.com/wp-content/uploads/2019/07/FobGavin.com_MobaXterm_2-.jpg)

我们点选第一个SSH图标，并填入相关信息，就可以完成session创建了。

点击确定后，输入密码(输入密码时并不会显示，只管输入后按确定即可，第一次登陆成功后会提示保存密码，一般选择同意)，就可以连接上虚拟机了。而且边上虚拟机之后，它会自动通过FTP也连接到虚拟机，直接拖拽就可以进行文件复制了。

登陆后界面主要分两块，左边的是主机的文件，右边是终端。勾选左下角的 “Follow terminal folder” 可以让两个的工作路径保持一致。



[![FobGavin: MobaXterm详细使用教程（一）](https://img-blog.csdnimg.cn/img_convert/6e09dfd908e9dd0d53b9cb73baef6e63.png)](http://www.fobgavin.com/wp-content/uploads/2019/07/FobGavin.com_MobaXterm_3-.jpg)

**3. 快速连接session**

创建一个session之后，就可以在左侧的session标签里留下它的信息，下次需要连接的时候直接双击即可。



[![FobGavin: MobaXterm详细使用教程（一）](https://img-blog.csdnimg.cn/img_convert/044804fb276bb8184c714f0f976cab55.png)](http://www.fobgavin.com/wp-content/uploads/2019/07/FobGavin.com_MobaXterm_3.jpg)

**4. 创建串口session**

下面介绍串口session的创建。

如同第2步，在「session setting」 对话框里选择serial，再选好串口号及波特率，点击OK就完成连接了。

同样session会保存在左侧的session标签页里，方便下次连接。



[![FobGavin: MobaXterm详细使用教程（一）](https://img-blog.csdnimg.cn/img_convert/35e2e7bfc357c005a48670e22f18a49d.png)](http://www.fobgavin.com/wp-content/uploads/2019/07/FobGavin.com_MobaXterm_4.jpg)

**5. 文件传输和下载**

可以采用直接拖拽的方式，或者采用鼠标右键选择相应功能。



[![FobGavin: MobaXterm详细使用教程（一）](https://img-blog.csdnimg.cn/img_convert/bda60241c059ed8796f09642fb153828.png)](http://www.fobgavin.com/wp-content/uploads/2019/07/FobGavin.com_MobaXterm_4-.jpg)

**6、个性化设置，设置终端字体，右键复制、文件保存路径等**



[![FobGavin: MobaXterm详细使用教程（一）](https://img-blog.csdnimg.cn/img_convert/7d348d894126673308e73bd4d265e8f8.png)](http://www.fobgavin.com/wp-content/uploads/2019/07/FobGavin.com_MobaXterm_5-.jpg)

**7、特色功能，Unix 命令集(GNU/ Cygwin)工具箱功能。**

(1) 直接命令登陆远程服务器，并且使用scp命令传输文件



[![FobGavin: MobaXterm详细使用教程（一）](https://img-blog.csdnimg.cn/img_convert/58f1c8571203567a718585516b3f1c90.png)](http://www.fobgavin.com/wp-content/uploads/2019/07/FobGavin.com_MobaXterm_7-.jpg)



[![FobGavin: MobaXterm详细使用教程（一）](https://img-blog.csdnimg.cn/img_convert/3b281d40bbe0b7a1fd96f33af3924288.png)](http://www.fobgavin.com/wp-content/uploads/2019/07/FobGavin.com_MobaXterm_7-1.jpg)



[![FobGavin: MobaXterm详细使用教程（一）](https://img-blog.csdnimg.cn/img_convert/cccca4f920dfcbf863f669f546bc5322.png)](http://www.fobgavin.com/wp-content/uploads/2019/07/FobGavin.com_MobaXterm_7-2.jpg)

(2) 我们可以直接apt-get安装vim等常用功能(或者官网下载插件)，实现在windows下模拟linux环境，这样就可以使用vi命令准备INCAR文件，也可以使用Gnuplot进行绘图。



[![FobGavin: MobaXterm详细使用教程（一）](https://img-blog.csdnimg.cn/img_convert/14d528f90d736cbf16e8e99302c58583.png)](http://www.fobgavin.com/wp-content/uploads/2019/07/FobGavin.com_MobaXterm_8.jpg)



[![FobGavin: MobaXterm详细使用教程（一）](https://img-blog.csdnimg.cn/img_convert/e5c9f22b31a27d0f0f6e9e912403b3f1.png)](http://www.fobgavin.com/wp-content/uploads/2019/07/FobGavin.com_MobaXterm_8-1.jpg)



[![FobGavin: MobaXterm详细使用教程（一）](https://img-blog.csdnimg.cn/img_convert/c41333acf74f10d0b48d12296168ae36.png)](http://www.fobgavin.com/wp-content/uploads/2019/07/FobGavin.com_MobaXterm_8-2-1.jpg)

(3) 通过for循环在windows下实现批量操作，以VESTA为例，首先找到在windows下解压的路径，然后设置环境变量。然后通过for循环可以批量打开POSCAR结构(注意只有关闭VESTA窗口第二个结构才会自动弹出)。



[![FobGavin: MobaXterm详细使用教程（一）](https://img-blog.csdnimg.cn/img_convert/5f3cdff52da2b32c0ecfbc8ccde7db30.png)](http://www.fobgavin.com/wp-content/uploads/2019/07/FobGavin.com_MobaXterm_9.jpg)

**8.右键粘贴**

在Moba及很多终端工具里，都有这样的功能：鼠标左键划选复制文件，右键粘贴文本。但在Moba中右键粘贴功能默认不打开，我们可以手动打开。

在菜单栏点击 「settings」 –> 「Configuration」，在弹出的对话框中选择 「terminal」，再将 「paste using right-click」 打上对勾即可。



[![FobGavin: MobaXterm详细使用教程（一）](https://img-blog.csdnimg.cn/img_convert/d8eca703db8cc2c22e8d3dabaa7a17e0.png)](http://www.fobgavin.com/wp-content/uploads/2019/07/FobGavin.com_MobaXterm_10.jpg)

本文介绍了三种连接方式：SSH，FTP，serial，以及几个有用的设置和命令。当然MobaXterm的功能远不止这些，但这些是最基本，最常用的，因此先拿出来讲。