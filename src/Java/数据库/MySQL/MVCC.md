---
title: MVCC
author: 程序员子龙
index: true
icon: discover
category:
- MySQL

---
MVCC(Mutil-Version Concurrency Control)，就是多版本并发控制。MVCC 是一种并发控制的方法，一般在数据库管理系统中，实现对数据库的并发访问。

在Mysql的InnoDB引擎中就是指在已提交读(READ COMMITTD)和可重复读(REPEATABLE READ)这两种隔离级别下的事务对于SELECT操作会访问版本链中的记录的过程。

这就使得别的事务可以修改这条记录，反正每次修改都会在版本链中记录。SELECT可以去版本链中拿记录，这就实现了读-写，写-读的并发执行，提升了系统的性能。

准备表

```mysql
CREATE TABLE `user` (
	`id` INT(11) NOT NULL,
	`name` VARCHAR(20) NULL DEFAULT NULL
)
ENGINE=InnoDB
;
```

## InnoDB 对 MVCC 的实现

`MVCC` 的实现依赖于：**隐藏字段、Read View、undo log**。在内部实现中，`InnoDB` 通过数据行的 `DB_TRX_ID` 和 `Read View` 来判断数据的可见性，如不可见，则通过数据行的 `DB_ROLL_PTR` 找到 `undo log` 中的历史版本。每个事务读到的数据版本可能是不一样的，在同一个事务中，用户只能看到该事务创建 `Read View` 之前已经提交的修改和该事务本身做的修改

## 隐藏列

`InnoDB` 存储引擎为每行数据添加了三个隐藏字段

[]: https://dev.mysql.com/doc/refman/5.7/en/innodb-multi-versioning.html

**事务ID（DB_TRX_ID）**：表示最后一次插入或更新该行的事务 id。

**回滚指针（DB_ROLL_PTR）**：指向该行的 `undo log` 。如果该行未被更新，则为空。

**DB_ROW_ID**：如果没有设置主键且该表没有唯一非空索引时，`InnoDB` 会使用该 id 来生成聚簇索引

每开始一个新的事务（新增、修改、删除），都会自动递增产生一个新的事务id。

![img](https://pic3.zhimg.com/v2-a3c571ad033a90427a2d3f5cae56636e_b.png)

InnoDB的MVCC是通过DATA_TRX_ID和DATA_ROLL_PTR这两个隐藏列来实现的。

## **undo log**

`undo log` 主要有两个作用：

- 当事务回滚时用于将数据恢复到修改前的样子
- 另一个作用是 `MVCC` ，当读取记录时，若该记录被其他事务占用或当前版本对该事务不可见，则可以通过 `undo log` 读取之前的版本数据，以此实现非锁定读。

根据行为的不同，undo log分为两种：**insert undo log** 和 **update undo log**

- **insert undo log：**

insert 操作中产生的undo log，因为insert操作记录只对当前事务本身，对于其他事务此记录不可见，所以 insert undo log 可以在事务提交后直接删除而不需要进行purge操作。

purge的主要任务是将数据库中已经 mark del 的数据删除，另外也会批量回收undo pages

![img](https://pic3.zhimg.com/v2-9f535b6b71782f54f36c9722e6ab1aae_b.png)

**update undo log：**

update 或 delete 操作中产生的 undo log。

![img](https://pic3.zhimg.com/v2-2be593a116df5e6166a4ecbcc3c6e6ea_b.png)

## 事务链表

MySQL中的事务在开始到提交这段过程中，都会被保存到一个叫trx_sys的事务链表中，这是一个基本的链表结构：

## Read View(快照)

在 `InnoDB` 存储引擎中，创建一个新事务后，执行每个 `select` 语句前，都会创建一个快照（Read View），**快照中保存了当前数据库系统中正处于活跃（没有 commit）的事务的 ID 号**。

**ReadView**中主要包含当前系统中还有哪些活跃的事务（未提交的事务），把它们的事务id放到一个列表中，我们把这个列表命名为为**m_ids**。

当用户在这个事务中要读取某个记录行的时候，`InnoDB` 会将该记录行的 `DB_TRX_ID` 与 `Read View` 中的一些变量及当前事务 ID 进行比较，判断是否满足可见性条件。

```c
class ReadView {
  /* ... */
private:
  trx_id_t m_low_limit_id;      /* 大于等于这个 ID 的事务均不可见 */

  trx_id_t m_up_limit_id;       /* 小于这个 ID 的事务均可见 */

  trx_id_t m_creator_trx_id;    /* 创建该 Read View 的事务ID */

  trx_id_t m_low_limit_no;      /* 事务 Number, 小于该 Number 的 Undo Logs 均可以被 Purge */

  ids_t m_ids;                  /* 创建 Read View 时的活跃事务列表 */

  m_closed;                     /* 标记 Read View 是否 close */
}

```

主要有以下字段：

- `m_low_limit_id`：目前出现过的最大的事务 ID+1，即下一个将被分配的事务 ID。大于等于这个 ID 的数据版本均不可见
- `m_up_limit_id`：活跃事务列表 `m_ids` 中最小的事务 ID，如果 `m_ids` 为空，则 `m_up_limit_id` 为 `m_low_limit_id`。小于这个 ID 的数据版本均可见
- `m_ids`：`Read View` 创建时其他未提交的活跃事务 ID 列表。创建 `Read View`时，将当前未提交事务 ID 记录下来，后续即使它们修改了记录行的值，对于当前事务也是不可见的。`m_ids` 不包括当前事务自己和已提交的事务（正在内存中）
- `m_creator_trx_id`：创建该 `Read View` 的事务 ID

![](http://img.xxfxpt.top/202203041012520.png)

对于RR隔离级别，版本链比对规则：

- 如果记录 DB_TRX_ID < m_up_limit_id，那么表明最新修改该行的事务（DB_TRX_ID）在当前事务创建快照之前就提交了，所以该版本可以被当前事务访问。
- 如果 DB_TRX_ID >= m_low_limit_id，那么表明最新修改该行的事务（DB_TRX_ID）在当前事务创建快照之后才修改该行，所以该版本不可以被当前事务访问。
- m_ids 为空，则表明在当前事务创建快照之前，修改该行的事务就已经提交了，所以该记录行的值对当前事务是可见的。
- 如果 m_up_limit_id <= DB_TRX_ID < m_low_limit_id，表明最新修改该行的事务（DB_TRX_ID）在当前事务创建快照的时候可能处于“活动状态”或者“已提交状态”；所以就要对活跃事务列表 m_ids 进行查找 ：如果在，说明创建 ReadView 时生成该版本的事务还是活跃的，该版本不可以被访问；如果不在，说明创建 ReadView 时生成该版本的事务已经被提交，该版本可以被访问。
- 在该记录行的 DB_ROLL_PTR 指针所指向的 `undo log` 取出快照记录，用快照记录的 DB_TRX_ID 跳到步骤 1 重新开始判断，直到找到满足的快照版本或返回空。

![img](https://pic1.zhimg.com/v2-a0a3bad1a420def139f85f6fdd521408_b.png)

![img](https://pic4.zhimg.com/v2-0a3d5d1e4163e93542356a2a1c958e7b_b.png)

## 在 RR 下 ReadView 生成情况

**在可重复读级别下，只会在事务开始后第一次读取数据时生成一个 Read View（m_ids 列表）**

原始数据：

| id   | name |
| ---- | ---- |
| 1    | 菜花 |

![img](https://ddmcc-1255635056.file.myqcloud.com/6fb2b9a1-5f14-4dec-a797-e4cf388ed413.png)

**1、在 T4 情况下的版本链为：**

![](https://ddmcc-1255635056.file.myqcloud.com/0e906b95-c916-4f30-beda-9cb3e49746bf.png)

在当前执行 `select` 语句时生成一个 `Read View`，此时 **`m_ids`：[101,102]** ，`m_low_limit_id`为：104，`m_up_limit_id`为：101，`m_creator_trx_id` 为：103 。

最新记录的 `DB_TRX_ID` 为 101，m_up_limit_id <= 101 < m_low_limit_id，所以要在 `m_ids` 列表中查找，发现 `DB_TRX_ID` 存在列表中，那么这个记录不可见

根据 `DB_ROLL_PTR` 找到 `undo log` 中的上一版本记录，上一条记录的 `DB_TRX_ID` 还是 101，不可见

继续找上一条 `DB_TRX_ID`为 1，满足 1 < m_up_limit_id，可见，所以事务 103 查询到数据为 `name = 菜花`

**2、时间点 T6 情况下：**

![](https://ddmcc-1255635056.file.myqcloud.com/79ed6142-7664-4e0b-9023-cf546586aa39.png)

1. 在 RR 级别下只会生成一次`Read View`，所以此时依然沿用 **`m_ids` ：[101,102]** ，`m_low_limit_id`为：104，`m_up_limit_id`为：101，`m_creator_trx_id` 为：103

- 最新记录的 `DB_TRX_ID` 为 102，m_up_limit_id <= 102 < m_low_limit_id，所以要在 `m_ids` 列表中查找，发现 `DB_TRX_ID` 存在列表中，那么这个记录不可见
- 根据 `DB_ROLL_PTR` 找到 `undo log` 中的上一版本记录，上一条记录的 `DB_TRX_ID` 为 101，不可见
- 继续根据 `DB_ROLL_PTR` 找到 `undo log` 中的上一版本记录，上一条记录的 `DB_TRX_ID` 还是 101，不可见
- 继续找上一条 `DB_TRX_ID`为 1，满足 1 < m_up_limit_id，可见，所以事务 103 查询到数据为 `name = 菜花`

**3、时间点 T9 情况下：**

![](https://ddmcc-1255635056.file.myqcloud.com/cbbedbc5-0e3c-4711-aafd-7f3d68a4ed4e.png)



## RC 和 RR 隔离级别下 MVCC 的差异

在事务隔离级别 `RC` 和 `RR` （InnoDB 存储引擎的默认事务隔离级别）下，`InnoDB` 存储引擎使用 `MVCC`（非锁定一致性读），但它们生成 `Read View` 的时机却不同

- 在 RC 隔离级别下的 **`每次select`** 查询前都生成一个`Read View` (m_ids 列表)
- 在 RR 隔离级别下只在事务开始后 **`第一次select`** 数据前生成一个`Read View`（m_ids 列表）

## MVCC+Next-key-Lock 防止幻读

`InnoDB`存储引擎在 RR 级别下通过 `MVCC`和 `Next-key Lock` 来解决幻读问题：

**1、执行普通 `select`，此时会以 `MVCC` 快照读的方式读取数据**

在快照读的情况下，RR 隔离级别只会在事务开启后的第一次查询生成 `Read View` ，并使用至事务提交。所以在生成 `Read View` 之后其它事务所做的更新、插入记录版本对当前事务并不可见，实现了可重复读和防止快照读下的 “幻读”

**2、执行 select...for update/lock in share mode、insert、update、delete 等当前读**

在当前读下，读取的都是最新的数据，如果其它事务有插入新的记录，并且刚好在当前事务查询范围内，就会产生幻读！`InnoDB` 使用 [Next-key Lock](https://dev.mysql.com/doc/refman/5.7/en/innodb-locking.html#innodb-next-key-locks)



## **MVCC总结**

所谓的MVCC（Multi-Version Concurrency Control ，多版本并发控制）指的就是在使用 **READ COMMITTD** 、**REPEATABLE READ** 这两种隔离级别的事务在执行普通的 SEELCT 操作时访问记录的版本链的过程，这样子可以使不同事务的 读-写 、 写-读 操作并发执行，从而提升系统性能。

在 MySQL 中， READ COMMITTED 和 REPEATABLE READ 隔离级别的的一个非常大的区别就是它们生成 ReadView 的时机不同。在 READ COMMITTED 中每次查询都会生成一个实时的 ReadView，做到保证每次提交后的数据是处于当前的可见状态。而 REPEATABLE READ 中，在当前事务第一次查询时生成当前的 ReadView，并且当前的 ReadView 会一直沿用到当前事务提交，以此来保证可重复读（REPEATABLE READ）。

## 参考

**《MySQL 技术内幕 InnoDB 存储引擎第 2 版》**

[Innodb 中的事务隔离级别和锁的关系](https://tech.meituan.com/2014/08/20/innodb-lock.html)[ ](https://tech.meituan.com/2014/08/20/innodb-lock.html)[ (opens new window)](https://tech.meituan.com/2014/08/20/innodb-lock.html)

[MySQL 事务与 MVCC 如何实现的隔离级别](https://blog.csdn.net/qq_35190492/article/details/109044141)[ ](https://blog.csdn.net/qq_35190492/article/details/109044141)[ (opens new window)](https://blog.csdn.net/qq_35190492/article/details/109044141)

[InnoDB 事务分析-MVCC](https://leviathan.vip/2019/03/20/InnoDB的事务分析-MVCC/)[ ](https://leviathan.vip/2019/03/20/InnoDB的事务分析-MVCC/)