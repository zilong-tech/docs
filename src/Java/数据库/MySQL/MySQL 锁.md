---
title: MySQL 锁详解
author: 程序员子龙
index: true
icon: discover
category:
- MySQL

---
**锁详解**

锁是计算机协调多个进程或线程并发访问某一资源的机制。

在数据库中，除了传统的计算资源（如CPU、RAM、I/O等）的争用以外，数据也是一种供需要用户共享的资源。如何保证数据并发访问的一致性、有效性是所有数据库必须解决的一个问题，锁冲突也是影响数据库并发访问性能的一个重要因素。

**锁分类**

- 从性能上分为乐观锁(用版本对比来实现)和悲观锁
- 从对数据库操作的类型分，分为读锁和写锁(都属于悲观锁)

读锁（共享锁，S锁(**S**hared)）：针对同一份数据，多个读操作可以同时进行而不会互相影响

写锁（排它锁，X锁(e**X**clusive)）：当前写操作没有完成前，它会阻断其他写锁和读锁

- 从对数据操作的粒度分，分为表锁和行锁

**表锁**

每次操作锁住整张表。开销小，加锁快；不会出现死锁；锁定粒度大，发生锁冲突的概率最高，并发度最低；一般用在整表数据迁移的场景。

- 手动增加表锁

lock table 表名称 read(write),表名称2 read(write);

- 查看表上加过的锁

show open tables;

- 删除表锁

unlock tables;

**行锁**

每次操作锁住一行数据。开销大，加锁慢；会出现死锁；锁定粒度最小，发生锁冲突的概率最低，并发度最高。

InnoDB与MYISAM的最大不同有两点：

- **InnoDB支持事务（TRANSACTION）**
- **InnoDB支持行级锁**

InnoDB在执行查询语句SELECT时(非串行隔离级别)，不会加锁。但是update、insert、delete操作会加行锁。

简而言之，就是**读锁会阻塞写，但是不会阻塞读。而写锁则会把读和写都阻塞**。

**间隙锁(Gap Lock)**

间隙锁，锁的就是两个值之间的空隙。Mysql默认级别是repeatable-read，有办法解决幻读问题吗？间隙锁在某些情况下可以解决幻读问题。

假设account表里数据如下：

![image-20211212221026948](http://img.xxfxpt.top/202112122210376.png)

那么间隙就有 id 为 (3,10)，(10,20)，(20,正无穷) 这三个区间，

在Session_1下面执行 update account set name = 'zhuge' where id > 8 and id <18;，则其他Session没法在这个**范围所包含的所有行记录(包括间隙行记录)以及行记录所在的间隙**里插入或修改任何数据，即id在(3,20]区间都无法修改数据，注意最后那个20也是包含在内的。

**间隙锁是在可重复读隔离级别下才会生效。**

事务A：

![image-20211212221456600](http://img.xxfxpt.top/202112122214934.png)

事务B：

![image-20211212221542369](http://img.xxfxpt.top/202112122215601.png)

事务A：

![image-20211212221911685](http://img.xxfxpt.top/202112122219782.png)

事务B：

![image-20211212222001149](http://img.xxfxpt.top/202112122220278.png)



**临键锁(Next-key Locks)**

Next-Key Locks是行锁与间隙锁的组合。像上面那个例子里的这个(3,20]的整个区间可以叫做临键锁。

**无索引行锁会升级为表锁(RR级别会升级为表锁，RC级别不会升级为表锁)**

锁主要是加在索引上，如果对非索引字段更新，行锁可能会变表锁

session1 执行：update account set balance = 800 where name = 'lilei';

session2 对该表任一行操作都会阻塞住

**InnoDB的行锁是针对索引加的锁，不是针对记录加的锁。并且该索引不能失效，否则都会从行锁升级为表锁****。**

锁定某一行还可以用lock in share mode(共享锁) 和for update(排它锁)，例如：select * from test_innodb_lock where a = 2 for update; 这样其他session只能读这行数据，修改则会被阻塞，直到锁定行的session提交

**结论**

Innodb存储引擎由于实现了行级锁定，虽然在锁定机制的实现方面所带来的性能损耗可能比表级锁定会要更高一下，但是在整体并发处理能力方面要远远优于MYISAM的表级锁定的。当系统并发量高的时候，Innodb的整体性能和MYISAM相比就会有比较明显的优势了。

但是，Innodb的行级锁定同样也有其脆弱的一面，当我们使用不当的时候，可能会让Innodb的整体性能表现不仅不能比MYISAM高，甚至可能会更差。

**行锁分析**

通过检查InnoDB_row_lock状态变量来分析系统上的行锁的争夺情况

```mysql
show status like 'innodb_row_lock%';              
```

对各个状态量的说明如下：

Innodb_row_lock_current_waits: 当前正在等待锁定的数量

Innodb_row_lock_time: 从系统启动到现在锁定总时间长度

Innodb_row_lock_time_avg: 每次等待所花平均时间

Innodb_row_lock_time_max：从系统启动到现在等待最长的一次所花时间

Innodb_row_lock_waits: 系统启动后到现在总共等待的次数

对于这5个状态变量，比较重要的主要是：

Innodb_row_lock_time_avg （等待平均时长）

Innodb_row_lock_waits （等待总次数）

Innodb_row_lock_time（等待总时长）

尤其是当等待次数很高，而且每次等待时长也不小的时候，我们就需要分析系统中为什么会有如此多的等待，然后根据分析结果着手制定优化计划。

**查看INFORMATION_SCHEMA系统库锁相关数据表**

​         

```mysql
-- 查看事务 
select * from INFORMATION_SCHEMA.INNODB_TRX; 
-- 查看锁 
select * from INFORMATION_SCHEMA.INNODB_LOCKS; 
-- 查看锁等待 
select * from INFORMATION_SCHEMA.INNODB_LOCK_WAITS;
-- 释放锁，trx_mysql_thread_id可以从INNODB_TRX表里查看到 
kill trx_mysql_thread_id 
-- 查看锁等待详细信息 
show engine innodb status\G;       
```

​        

**死锁**

**set tx_isolation='**repeatable-read**';**

Session_1执行：select * from account where id=1 for update;

Session_2执行：select * from account where id=2 for update;

Session_1执行：select * from account where id=2 for update;

Session_2执行：select * from account where id=1 for update;

查看近期死锁日志信息：show engine innodb status\G; 

大多数情况mysql可以自动检测死锁并回滚产生死锁的那个事务，但是有些情况mysql没法自动检测死锁

**锁优化建议**

- 尽可能让所有数据检索都通过索引来完成，避免无索引行锁升级为表锁
- 合理设计索引，尽量缩小锁的范围
- 尽可能减少检索条件范围，避免间隙锁
- 尽量控制事务大小，减少锁定资源量和时间长度，涉及事务加锁的sql尽量放在事务最后执行
- 尽可能低级别事务隔离