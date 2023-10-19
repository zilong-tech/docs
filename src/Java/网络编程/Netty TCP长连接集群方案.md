---
title: Netty TCP长连接集群方案
author: 程序员子龙
index: true
icon: discover
category:
- Netty
---
使用 Netty 自定义协议连接物联网设备，业务增大之后，势必需要使用集群方案。

### nginx负载均衡

Nginx 1.9 已经支持 TCP 代理和负载均衡，并可以通过一致性哈希算法将连接均匀的分配到所有的服务器上。

修改配置文件

```
stream{
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
```

注意：stream和http是平级的。

```
#重启
./nginx -s reload
#检查配置文件语法是否正确
./nginx -t
#停止
./nginx -s stop
```

经过测试可以发现，设备上报的数据分配到不同服务器上。

**window 10,nginx配置后，本地可以访问，局域网机器其他访问不了**

1、防火墙问题

打开防火墙，允许[nginx](https://so.csdn.net/so/search?q=nginx&spm=1001.2101.3001.7020)，并且的专用和公用的网络都允许访问。

![](https://img-blog.csdnimg.cn/20191101134230890.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyNDQwOTE5,size_16,color_FFFFFF,t_70)

 

![](https://img-blog.csdnimg.cn/2019110113432489.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQyNDQwOTE5,size_16,color_FFFFFF,t_70)

### 长连接处理

在物联网中，设备和服务器之间是可以互相通信的，也就是说设备可以向服务器上报数据，服务器也可以向设备下发指令。由于设备和服务网之间是长连接，下发指令和接收设备上传数据的服务器只能是同一台服务器，因为只有它们之间建立了连接通道。

我们可以使用map保存设备和ChannelHandlerContext映射关系。

```java

	/**
	 * 用来保存对应的设备-channel
	 */
	private  static Map<String, ChannelHandlerContext> channelMap = new ConcurrentHashMap<>();

	/**
	 * 用来标记channel当连接断开时要清除channelMap中的记录
	 */
	private static Map<ChannelHandlerContext, String> mark = new ConcurrentHashMap<>();

```

在设备连接、断开时候更新channelMap。

```java
protected void channelRead0(ChannelHandlerContext ctx, Object msg) throws Exception {

	boolean containsKey = ServerHandler.channelMap.containsKey(deviceId);

			// 设备id和通道建立关系
			if (!containsKey) {
				ServerHandler.channelMap.put(deviceId, ctx);
				ServerHandler.mark.put(ctx, deviceId);
			}

}


	/**
	 * 客户端与服务端断开连接时调用
	 */
	@Override
	public void channelInactive(ChannelHandlerContext ctx) throws Exception {
		boolean containsKey = ServerHandler.mark.containsKey(ctx);
		if (containsKey) {
			String code = ServerHandler.mark.get(ctx);
			ServerHandler.channelMap.remove(code, ctx);
			ServerHandler.mark.remove(ctx);
		}
	}
```

### 指令下发消息处理

可以通过redis发布/订阅模式实现。将消息 pub 到 redis 集群中，而所有集群中的服务器都 sub 这个 redis 集群，一旦有消息，所有的服务器都会消费消息，保持连接的服务器会处理消息。

```java

	/**
	 * 向设备发送消息
	 *
	 * @param deviceId 设备id
	 * @param msg  信息
	 */
	public static void send(String deviceId, Object msg) {

		if (ServerHandler.channelMap.containsKey(deviceId)) {
			ChannelHandlerContext handlerContext = ServerHandler.channelMap.get(deviceId);
			if(handlerContext.channel().isActive()){
				ChannelFuture channelFuture = handlerContext.writeAndFlush(msg);
				//操作完成后通知注册一个 ChannelFutureListener
				channelFuture.addListener((future) -> {
					if (channelFuture.isSuccess()) {
						//发送消息操作成功
						log.info("指令下发成功");
					} else {
						//发送消息操作异常
						Throwable cause = channelFuture.cause();
						log.error("sendMSG "+msg+" err:",cause);
						throw new BaseException(cause.getMessage());
					}
				});
			}else {
				ServerHandler.channelMap.remove(deviceId);
			}

		} else {
			log.error("-------设备 {} 已经断开连接-------",deviceId);
			throw new BaseException(deviceId + "设备已经断开连接");
		}
	}
```





