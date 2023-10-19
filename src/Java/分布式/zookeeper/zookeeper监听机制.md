---
title: zookeeper监听机制
author: 程序员子龙
index: true
icon: discover
category:
- Zookeeper
---
## 原生的监听方式

ZooKeeper的Watcher监测是一次性的，每次触发之后都需要重新进行注册。∙

```java
client.create().orSetData().withMode(CreateMode.PERSISTENT).forPath("/test","hello world".getBytes());

// 注册观察者，当节点变动时触发
byte[] data = client.getData().usingWatcher(new Watcher() {
    @Override
    public void process(WatchedEvent event) {
        System.out.println("获取 test 节点 监听器 : " + event);
    }
}).forPath("/test");

client.create().orSetData().withMode(CreateMode.PERSISTENT).forPath("/test","hello".getBytes());
Thread.sleep(1000);
client.create().orSetData().withMode(CreateMode.PERSISTENT).forPath("/test","world".getBytes());
Thread.sleep(1000);
System.out.println("节点数据: "+ new String(data));
Thread.sleep(10000);
```

Curator 引入了 Cache 来实现对 Zookeeper 服务端事件监听，Cache 事件监听可以理解 为一个本地缓存视图与远程 Zookeeper 视图的对比过程。Cache 提供了反复注册的功能。 

## 缓存的监听模式

Curator引入了Cache来实现对Zookeeper服务端事件监听，Cache事件监听可以理解为一个本地缓存视图与远程Zookeeper视图的对比过程。Cache提供了反复注册的功能。Cache分为两类注册类型：节点监听和子节点监听。

Cache的监听模式，可以理解为利用了一个缓存的机制，同时Cache提供了反复注册的功能。简单来说Cache就是在客户端缓存了指定节点的状态，当感知到ZNode的节点变化的时候，就会触发event事件，注册的监听器就会处理这个事件。

Cache的事件有三种类型，Node Cache，Path Cache，Tree Cache。

- Node Cache是用于ZNode节点的监听
- Path Cache是用于ZNode子节点的监听
- Tree Cache 相当于前两者的组合。

## node cache

```java
//path 监听路径
public NodeCache(CuratorFramework client,String path)
```

通过注册监听器来实现，对当前节点数据变化的处理

```java

public void addListener(NodeCacheListener listener)

```

代码示例：

```java
     String nodePath = "/watch";

        //1.初始化一个nodeCache
        NodeCache nodeCache = new NodeCache(curatorFramework, nodePath, false);

        //2.初始化一个NodeCacheListener
        NodeCacheListener nodeCacheListener = new NodeCacheListener() {
            @Override
            public void nodeChanged() throws Exception {
                ChildData childData = nodeCache.getCurrentData();
                System.out.println("ZNode 节点的状态变化,path=" + childData.getPath());
                System.out.println("ZNode 节点的状态变化,data=" + new String(childData.getData(), "utf-8"));
                System.out.println("ZNode 节点的状态变化,stat=" + childData.getStat());
            }
        };

        nodeCache.getListenable().addListener(nodeCacheListener);
        /**
         * 唯一的一个参数buildInitial代表着是否将该节点的数据立即进行缓存。
         * 如果设置为true的话，在start启动时立即调用NodeCache的getCurrentData方法就能够得到对应节点的信息ChildData类，
         * 如果设置为false的就得不到对应的信息。
         *
         * 使用NodeCache来监听节点的事件
         */
        nodeCache.start();//start

        curatorFramework.create().forPath(nodePath);
        // 第1次变更节点数据
        curatorFramework.setData().forPath(nodePath, "hello".getBytes());
        Thread.sleep(1000);

        // 第2次变更节点数据
        curatorFramework.setData().forPath(nodePath, "world".getBytes());

        Thread.sleep(1000);

        // 第3次变更节点数据
        curatorFramework.setData().forPath(nodePath, "hello world".getBytes());
        Thread.sleep(1000);

        //目的是阻塞客户端关闭
        System.in.read();
```

> ZNode 节点的状态变化,path=/watch
> ZNode 节点的状态变化,data=hello
> ZNode 节点的状态变化,stat=415,416,1657780730498,1657780730505,1,0,0,0,5,0,415
>
> ZNode 节点的状态变化,path=/watch
> ZNode 节点的状态变化,data=world
> ZNode 节点的状态变化,stat=415,417,1657780730498,1657780731524,2,0,0,0,5,0,415
>
> ZNode 节点的状态变化,path=/watch
> ZNode 节点的状态变化,data=hello world
> ZNode 节点的状态变化,stat=415,418,1657780730498,1657780732534,3,0,0,0,11,0,415

 可以看到，这里多次修改数据，能够实现多次监听。

## path cache

PathChildrenCache会对子节点进行监听，但是不会对二级子节点进行监听。

```java
public PathChildrenCache(CuratorFramework client,String path,boolean cacheData)
```

通过注册监听器来实现，对当前节点的子节点数据变化的处理

```java
public void addListener(PathChildrenCacheListener listener)
```

代码示例：

```java

        String nodePath = "/watchNode";

        curatorFramework.create().forPath(nodePath);

        PathChildrenCache pathChildrenCache = new PathChildrenCache(curatorFramework, nodePath, true);
        PathChildrenCacheListener pathChildrenCacheListener = new PathChildrenCacheListener() {
            @Override
            public void childEvent(CuratorFramework curatorFramework, PathChildrenCacheEvent pathChildrenCacheEvent) throws Exception {
                ChildData childData = pathChildrenCacheEvent.getData();
                switch (pathChildrenCacheEvent.getType()) {
                    case CHILD_ADDED:
                        System.out.println("子节点增加，path=" + childData.getPath() + ",data=" + new String(childData.getData(), "utf-8"));
                        break;
                    case CHILD_UPDATED:
                        System.out.println("子节点更新，path=" + childData.getPath() + ",data=" + new String(childData.getData(), "utf-8"));
                        break;
                    case CHILD_REMOVED:
                        System.out.println("子节点删除，path=" + childData.getPath() + ",data=" + new String(childData.getData(), "utf-8"));
                        break;
                    default:
                        break;
                }
            }
        };

        pathChildrenCache.getListenable().addListener(pathChildrenCacheListener);
        pathChildrenCache.start(PathChildrenCache.StartMode.BUILD_INITIAL_CACHE);

        Thread.sleep(1000);
        for (int i = 0; i < 3; i++) {
            String childPath = nodePath + "/" + i;
            byte[] data = childPath.getBytes();
            curatorFramework.create().forPath(childPath, data);
        }

        //主线程睡眠，然后再删除子节点，这里依旧会触发子节点变更事件
        Thread.sleep(5000);
        for (int i = 0; i < 3; i++) {
            String childPath = nodePath + "/" + i;
            curatorFramework.delete().forPath(childPath);
        }
```

> 子节点增加，path=/watchNode/0,data=/watchNode/0
> 子节点增加，path=/watchNode/1,data=/watchNode/1
> 子节点增加，path=/watchNode/2,data=/watchNode/2
> 子节点删除，path=/watchNode/0,data=/watchNode/0
> 子节点删除，path=/watchNode/1,data=/watchNode/1
> 子节点删除，path=/watchNode/2,data=/watchNode/2

## tree cache

TreeCache使用一个内部类TreeNode来维护这个一个树结构。并将这个树结构与ZK节点进行了映射。所以TreeCache可以监听当前节点下所有节点的事件。

```java
public TreeCache(CuratorFramework client,String path,boolean cacheData)
```

通过注册监听器来实现，对当前节点的子节点，及递归子节点数据变化的处理。

```java
public void addListener(TreeCacheListener listener)
```

代码示例：

```java
String nodePath = "/watch";

TreeCache treeCache = new TreeCache(curatorFramework, nodePath);
TreeCacheListener treeCacheListener = new TreeCacheListener() {
    @Override
    public void childEvent(CuratorFramework curatorFramework, TreeCacheEvent treeCacheEvent) throws Exception {
        ChildData data = treeCacheEvent.getData();
        switch (treeCacheEvent.getType()) {
            case NODE_ADDED:
                System.out.println("[TreeNode]节点增加，path="+data.getPath()+",data="+new String(data.getData(),"utf-8"));
                break;
            case NODE_UPDATED:
                System.out.println("[TreeNode]节点更新，path="+data.getPath()+",data="+new String(data.getData(),"utf-8"));
                break;
            case NODE_REMOVED:
                System.out.println("[TreeNode]节点删除，path="+data.getPath()+",data="+new String(data.getData(),"utf-8"));
                break;
            default:
                break;
        }
    }
};

treeCache.getListenable().addListener(treeCacheListener);

treeCache.start();
Thread.sleep(1000);
for (int i = 0; i < 3; i++) {
    String childPath = nodePath + "/" + i;
    byte[] data = childPath.getBytes();
    curatorFramework.create().creatingParentsIfNeeded().forPath(childPath, data);
}

Thread.sleep(1000);
for (int i = 0; i < 3; i++) {
    String childPath = nodePath + "/" + i;
    curatorFramework.delete().forPath(childPath);
}

curatorFramework.setData().forPath(nodePath,"update parent".getBytes());
```

> [TreeNode]节点增加，path=/watch,data=update parent
> [TreeNode]节点增加，path=/watch/0,data=/watch/0
> [TreeNode]节点增加，path=/watch/1,data=/watch/1
> [TreeNode]节点增加，path=/watch/2,data=/watch/2
> [TreeNode]节点删除，path=/watch/0,data=/watch/0
> [TreeNode]节点删除，path=/watch/1,data=/watch/1
> [TreeNode]节点删除，path=/watch/2,data=/watch/2
> [TreeNode]节点更新，path=/watch,data=update parent