import{_ as e,W as a,X as n,a1 as s}from"./framework-2afc6763.js";const p={},i=s(`<h2 id="什么是索引" tabindex="-1"><a class="header-anchor" href="#什么是索引" aria-hidden="true">#</a> 什么是索引</h2><p><strong>索引是一种用于快速查询和检索数据的数据结构。常见的索引结构有: B 树， B+树和 Hash。</strong></p><p>索引的作用就相当于目录的作用。打个比方: 我们在查字典的时候，如果没有目录，那我们就只能一页一页的去找我们需要查的那个字，速度很慢。如果有目录了，我们只需要先去目录里查找字的位置，然后直接翻到那一页就行了。</p><h2 id="索引的优缺点" tabindex="-1"><a class="header-anchor" href="#索引的优缺点" aria-hidden="true">#</a> 索引的优缺点</h2><p><strong>优点</strong> ：</p><ul><li>使用索引可以大大加快 数据的检索速度（大大减少检索的数据量）, 这也是创建索引的最主要的原因。</li><li>通过创建唯一性索引，可以保证数据库表中每一行数据的唯一性。</li></ul><p><strong>缺点</strong> ：</p><ul><li>创建索引和维护索引需要耗费许多时间。当对表中的数据进行增删改的时候，如果数据有索引，那么索引也需要动态的修改，会降低 SQL 执行效率。</li><li>索引需要使用物理文件存储，也会耗费一定空间。</li></ul><p>但是，<strong>使用索引一定能提高查询性能吗?</strong></p><p>大多数情况下，索引查询都是比全表扫描要快的。但是如果数据库的数据量不大，那么使用索引也不一定能够带来很大提升。</p><h2 id="索引的底层数据结构" tabindex="-1"><a class="header-anchor" href="#索引的底层数据结构" aria-hidden="true">#</a> 索引的底层数据结构</h2><p><strong>树的相关概念</strong></p><p>**结点的度：**结点的子树个数</p><p>**树的度：**树中所有结点中最大的度</p><p><strong>叶结点</strong>：度为0的结点</p><p>**父结点：**有子树的结点是其子树的根结点的父结点</p><p>**子结点：**若A是B的父结点，B就是A的子结点</p><p><img src="https://pic1.zhimg.com/80/v2-6b1e36e0a9a259ef9a1f387a0a25031d_720w.png?source=d16d100b" alt=""></p><h3 id="二叉树-binary-tree" tabindex="-1"><a class="header-anchor" href="#二叉树-binary-tree" aria-hidden="true">#</a> <strong>二叉树（Binary Tree）</strong></h3><p>每个节点最多只有两个子节点， 左边的子节点都比当前节点小，右边的子节点都比当前节点大。</p><p>一棵深度为k，且有2^k-1个结点的二叉树，称为满二叉树。</p><p><img src="https://img2018.cnblogs.com/i-beta/1235429/201912/1235429-20191204143719149-1244325728.png" alt="img"><img src="https://img2018.cnblogs.com/i-beta/1235429/201912/1235429-20191204143927653-107624043.png" alt="img"></p><p>可能变成链表，查询效率低</p><h3 id="avl树-平衡二叉树" tabindex="-1"><a class="header-anchor" href="#avl树-平衡二叉树" aria-hidden="true">#</a> <strong>AVL树（平衡二叉树）</strong></h3><p>它是一种排序的二叉树。主要特征：左右子树的树高差绝对值不能超过1</p><p><img src="https://img2018.cnblogs.com/i-beta/1235429/201912/1235429-20191204144031967-759718656.png" alt="img"></p><p>如果在AVL树中进行插入或删除节点，可能导致AVL树失去平衡，这种失去平衡的二叉树可以概括为四种姿态：LL（左左）、RR（右右）、LR（左右）、RL（右左）。它们的示意图如下：</p><p><img src="https://pic4.zhimg.com/80/v2-2176f2d2f8037c1ec6abc13ff9826e87_720w.jpg" alt=""></p><p>这四种失去平衡的姿态都有各自的定义： LL：LeftLeft，也称“左左”。插入或删除一个节点后，根节点的左孩子（Left Child）的左孩子（Left Child）还有非空节点，导致根节点的左子树高度比右子树高度高2，AVL树失去平衡。</p><p>RR：RightRight，也称“右右”。插入或删除一个节点后，根节点的右孩子（Right Child）的右孩子（Right Child）还有非空节点，导致根节点的右子树高度比左子树高度高2，AVL树失去平衡。</p><p>LR：LeftRight，也称“左右”。插入或删除一个节点后，根节点的左孩子（Left Child）的右孩子（Right Child）还有非空节点，导致根节点的左子树高度比右子树高度高2，AVL树失去平衡。</p><p>RL：RightLeft，也称“右左”。插入或删除一个节点后，根节点的右孩子（Right Child）的左孩子（Left Child）还有非空节点，导致根节点的右子树高度比左子树高度高2，AVL树失去平衡。</p><p><strong>R-B Tree（Red/Black Tree）红黑树</strong></p><p>本质上也是一种二叉树。</p><p>特性：</p><p>1）每个结点要么是红的，要么是黑的。<br> 2）根结点是黑的。<br> 3）每个叶结点（叶结点即指树尾端NIL指针或NULL结点）是黑的。<br> 4）如果一个结点是红的，那么它的俩个儿子都是黑的。<br> 5）对于任一结点而言，其到叶结点树尾端NIL指针的每一条路径都包含相同数目的黑结点。</p><p>* 新添加节点，均为红色。</p><p><img src="https://img2018.cnblogs.com/i-beta/1235429/201912/1235429-20191204145550238-962547601.png" alt="img"><img src="https://img2018.cnblogs.com/i-beta/1235429/201912/1235429-20191204145754156-1477994769.png" alt="img"><img src="https://img2018.cnblogs.com/i-beta/1235429/201912/1235429-20191204151006842-1642316304.png" alt="img"></p><p>数据量大的情况下，树的高度很高，查询效率低。</p><h3 id="b-tree-b-树" tabindex="-1"><a class="header-anchor" href="#b-tree-b-树" aria-hidden="true">#</a> B-Tree（B 树）</h3><p>B 树也称 B-树,全称为 <strong>多路平衡查找树</strong> ，B+ 树是 B 树的一种变体。B 树和 B+树中的 B 是 <code>Balanced</code> （平衡）的意思。</p><p>目前大部分数据库系统及文件系统都采用**B-Tree(B树)<strong>或其变种</strong>B+Tree(B+树)**作为索引结构。</p><p>B 树是一种自平衡的树，能够保持数据有序。与二叉树的区别，可以有多个子节点，每个节点可以存储多个值。</p><ul><li>叶节点具有相同的深度，叶节点的指针为空</li><li>所有索引元素不重复</li><li>节点中的数据索引从左到右递增排列</li></ul><p>m 阶（根结点中关键字的个数为1~m-1）的B树具有特性：</p><p>1）每个节点最多有 m 个子节点，叶节点具有相同的深度，叶节点的指针为空</p><p>2）除根节点和叶子节点，其它每个节点至少有 [m/2] （向上取整的意思）个子节点</p><p>3）若根节点不是叶子节点，则其至少有2个子节点</p><p>4）所有NULL节点到根节点的高度都一样</p><p>5）除根节点外，其它节点都包含 n 个key，其中 [m/2] -1 &lt;= n &lt;= m-1</p><p>6）节点中的数据索引从左到右递增排列</p><p>每个节点由三部分组成：key，指针，数据data;</p><p>key和指针互相间隔，节点两端是指针。</p><p>每个叶子节点最少包含一个key和两个指针，最多包含2d-1个key和2d个指针，叶节点的指针均为null（d 大于1的正整数，表示B树的度）</p><p>比如每个节点最大深度=3。（3阶B树）</p><p><img src="https://img2018.cnblogs.com/i-beta/1235429/201912/1235429-20191204155725144-2053723733.png" alt="img"><img src="https://img2018.cnblogs.com/i-beta/1235429/201912/1235429-20191204155740564-2127857248.png" alt="img"><img src="https://img2018.cnblogs.com/i-beta/1235429/201912/1235429-20191204161000146-1637962240.png" alt="img"></p><h3 id="b-tree-b-树-1" tabindex="-1"><a class="header-anchor" href="#b-tree-b-树-1" aria-hidden="true">#</a> <strong>B+Tree（B+树）</strong></h3><p>是B-Tree的一种变种树。自然也会满足B树相关特性。主要区别：B+树的叶子会包含所有的节点数据，并产生链表结构。</p><p>B-Tree结构图中可以看到每个节点中不仅包含数据的key值，还有data值。而每一个页的存储空间是有限的，如果data数据较大时将会导致每个节点（即一个页）能存储的key的数量很小，当存储的数据量很大时同样会导致B-Tree的深度较大，增大查询时的磁盘I/O次数，进而影响查询效率，所以引入B+tree。</p><p>特征：</p><ul><li><p>非叶子节点不存储数据，只存储索引信息和下一层节点的指针信息</p></li><li><p>所有数据都存储在叶子节点当中，叶子节点包含所有索引字段</p></li><li><p>每个叶子节点都存有相邻叶子节点的指针，提高区间访问的性能</p></li><li><p>叶子节点按照本身关键字从小到大排序。</p></li><li><p>相同节点数量的情况下，B+tree高度远低于B-tree</p></li><li><p>索引节点指示该节点的左子树比这个 Flag 小， 而右子树大于等于这个 Flag</p></li><li><p>叶子节点中的数据在物理存储上是无序 的， 仅仅是在 逻辑上有序 （通过指针串在一起）</p></li></ul><p><img src="https://img2018.cnblogs.com/i-beta/1235429/201912/1235429-20191204162603989-1770224568.png" alt="img"></p><p>B树索引示例图</p><p><img src="https://pic1.zhimg.com/80/v2-8856d183b900ee32a99a62a06bee281c_720w.png" alt=""></p><p>B+树索引示例图</p><p><img src="https://pica.zhimg.com/80/v2-026163a78f8188d5ca921bf2daefbe12_720w.png" alt=""></p><p><img src="https://pic1.zhimg.com/80/v2-2183ed841d2d99ee950cc6ec1969ed03_720w.png?source=d16d100b" alt=""></p><p>浅蓝色的块我们称之为一个磁盘块，可以看到每个磁盘块包含几个数据项（深蓝色所示）和指针（黄色所示），如磁盘块1包含数据项17和35，包含指针P1、P2、P3，P1表示小于17的磁盘块，P2表示在17和35之间的磁盘块，P3表示大于35的磁盘块。真实的数据存在于叶子节点即3、5、9、10、13、15、28、29、36、60、75、79、90、99。非叶子节点不存储真实的数据，只存储指引搜索方向的数据项，如17、35并不真实存在于数据表中。</p><p><strong>B+tree的查找过程</strong></p><p>如图所示，如果要查找数据项29，那么首先会把磁盘块1由磁盘加载到内存，此时发生一次IO，在内存中用二分查找确定29在17和35之间，锁定磁盘块1的P2指针，内存时间因为非常短（相比磁盘的IO）可以忽略不计，通过磁盘块1的P2指针的磁盘地址把磁盘块3由磁盘加载到内存，发生第二次IO，29在26和30之间，锁定磁盘块3的P2指针，通过指针加载磁盘块8到内存，发生第三次IO，同时内存中做二分查找找到29，结束查询，总计三次IO。真实的情况是，3层的b+树可以表示上百万的数据，如果上百万的数据查找只需要三次IO，性能提高将是巨大的，如果没有索引，每个数据项都要发生一次IO，那么总共需要百万次的IO，显然成本非常非常高。</p><p><strong>B+tree性质</strong></p><p>1.通过上面的分析，我们知道IO次数取决于b+数的高度h，假设当前数据表的数据为N，每个磁盘块的数据项的数量是m，则有h=㏒(m+1)N，当数据量N一定的情况下，m越大，h越小；而m = 磁盘块的大小 / 数据项的大小，磁盘块的大小也就是一个数据页的大小，是固定的，如果数据项占的空间越小，数据项的数量越多，树的高度越低。这就是为什么每个数据项，即索引字段要尽量的小，比如int占4字节，要比bigint8字节少一半。这也是为什么b+树要求把真实的数据放到叶子节点而不是内层节点，一旦放到内层节点，磁盘块的数据项会大幅度下降，导致树增高。当数据项等于1时将会退化成线性表。</p><p>2.当b+树的数据项是复合的数据结构，比如(name,age,sex)的时候，b+数是按照从左到右的顺序来建立搜索树的，比如当(张三,20,F)这样的数据来检索的时候，b+树会优先比较name来确定下一步的所搜方向，如果name相同再依次比较age和sex，最后得到检索的数据；但当(20,F)这样的没有name的数据来的时候，b+树就不知道下一步该查哪个节点，因为建立搜索树的时候name就是第一个比较因子，必须要先根据name来搜索才能知道下一步去哪里查询。比如当(张三,F)这样的数据来检索时，b+树可以用name来指定搜索方向，但下一个字段age的缺失，所以只能把名字等于张三的数据都找到，然后再匹配性别是F的数据了， 这个是非常重要的性质，即索引的最左匹配特性。</p><p><img src="https://pica.zhimg.com/80/v2-d73f450131999de22f824e4b01cefcf3_720w.png?source=d16d100b" alt="img"></p><h4 id="磁盘和b-树" tabindex="-1"><a class="header-anchor" href="#磁盘和b-树" aria-hidden="true">#</a> <strong>磁盘和B+树</strong></h4><p>为什么关系型数据库都选择了B+树，这个和磁盘的特性有着非常大的关系。</p><p><img src="https://note.youdao.com/yws/public/resource/fd5eae820148eb4f7bd9ced08f48aab4/xmlnote/6E57645B52434E3BB33C350C92813857/2109" alt="https://note.youdao.com/yws/public/resource/fd5eae820148eb4f7bd9ced08f48aab4/xmlnote/6E57645B52434E3BB33C350C92813857/2109"></p><p>如果我们简化一下，可以这么看</p><p><img src="https://note.youdao.com/yws/public/resource/fd5eae820148eb4f7bd9ced08f48aab4/xmlnote/941F2A434F9749429F1FFEB1968D8752/2110" alt="https://note.youdao.com/yws/public/resource/fd5eae820148eb4f7bd9ced08f48aab4/xmlnote/941F2A434F9749429F1FFEB1968D8752/2110"></p><p>一个磁盘由大小相同且同轴的圆形盘片组成，磁盘可以转动（各个磁盘必须同步转动）。在磁盘的一侧有磁头支架，磁头支架固定了一组磁头，每个磁头负责存取一个磁盘的内容。磁头不能转动，但是可以沿磁盘半径方向运动。</p><p>盘片被划分成一系列同心环，圆心是盘片中心，每个同心环叫做一个磁道，所有半径相同的磁道组成一个柱面。磁道被沿半径线划分成一个个小的段，每个段叫做一个扇区，每个扇区是磁盘的最小存储单元也是最小读写单元。现在磁盘扇区一般是512个字节~4k个字节。</p><p>磁盘上数据必须用一个三维地址唯一标示：柱面号、盘面号、扇区号。</p><p>读/写磁盘上某一指定数据需要下面步骤：</p><p>(1) 首先移动臂根据柱面号使磁头移动到所需要的柱面上，这一过程被称为定位或查找。</p><p>(2)所有磁头都定位到磁道上后，这时根据盘面号来确定指定盘面上的具体磁道。</p><p>(3) 盘面确定以后，盘片开始旋转，将指定块号的磁道段移动至磁头下。</p><p>经过上面步骤，指定数据的存储位置就被找到。这时就可以开始读/写操作了。</p><p><img src="https://note.youdao.com/yws/public/resource/fd5eae820148eb4f7bd9ced08f48aab4/xmlnote/83551DD588CC4685A873AE9DED0113C8/2112" alt="https://note.youdao.com/yws/public/resource/fd5eae820148eb4f7bd9ced08f48aab4/xmlnote/83551DD588CC4685A873AE9DED0113C8/2112"></p><p><img src="https://note.youdao.com/yws/public/resource/fd5eae820148eb4f7bd9ced08f48aab4/xmlnote/C79029F02EC849D38815CD9DAD0416DE/2113" alt="https://note.youdao.com/yws/public/resource/fd5eae820148eb4f7bd9ced08f48aab4/xmlnote/C79029F02EC849D38815CD9DAD0416DE/2113"></p><p>可以看见，磁盘读取依靠的是机械运动，分为寻道时间、旋转延迟、传输时间三个部分，这三个部分耗时相加就是一次磁盘IO的时间，一般大概9ms左右。寻道时间（seek）是将读写磁头移动至正确的磁道上所需要的时间，这部分时间代价最高；旋转延迟时间（rotation）是磁盘旋转将目标扇区移动到读写磁头下方所需的时间，取决于磁盘转速；数据传输时间（transfer）是完成传输数据所需要的时间，取决于接口的数据传输率，在纳秒级，远小于前两部分消耗时间。磁盘读取时间成本是访问内存的几百倍到几万倍之间。</p><p>为了提高效率，要尽量减少磁盘I/O。为了达到这个目的，磁盘往往不是严格按需读取，而是每次都会预读，即使只需要一个字节，磁盘也会从这个位置开始，顺序向后读取一定长度的数据放入内存，这个称之为<strong>预读</strong>。这样做的理论依据是计算机科学中著名的局部性原理：</p><p><strong>当一个数据被用到时，其附近的数据也通常会马上被使用。</strong></p><p><strong>程序运行期间所需要的数据通常比较集中。</strong></p><p>由于磁盘顺序读取的效率很高（不需要寻道时间，只需很少的旋转时间），一般来说，磁盘的顺序读的效率是随机读的40到400倍都有可能，顺序写是随机写的10到100倍（SSD盘则差距要小的多，顺序读写的效率是随机读写的7到10倍，但是有评测表明机械硬盘的顺序写性能稍优于SSD。总的来说Mysql数据库如果由硬盘由机械的换成SSD的，性能会有很大的提升），因此对于具有局部性的程序来说，预读可以提高I/O效率。</p><p>预读的长度一般为页（page）的整倍数。页是计算机管理存储器的逻辑块，硬件及操作系统往往将主存和磁盘存储区分割为连续的大小相等的块，每个存储块称为一页，页大小通常为4k当然也有16K的，主存和磁盘以页为单位交换数据。当程序要读取的数据不在主存中时，会触发一个缺页异常，此时系统会向磁盘发出读盘信号，磁盘会找到数据的起始位置并向后连续读取一页或几页载入内存中，然后异常返回，程序继续运行。</p><p>按照磁盘的这种性质，如果是一个页存放一个B+树的节点，自然是可以存放很多的数据的，比如InnoDB里，默认定义的B+树的节点大小是16KB，这就是说，假如一个Key是8个字节，那么一个节点可以存放大约1000个Key，意味着B+数可以有1000个分叉。同时InnoDB每一次磁盘I/O，读取的都是 16KB的整数倍的数据。也就是说InnoDB在节点的读写上是可以充分利用磁盘顺序IO的高速读写特性。</p><p>同时按照B+树逻辑结构来说，在叶子节点一层，所有记录的主键按照从小到大的顺序排列，并且形成了一个双向链表。同一层的非叶子节点也互相串联，形成了一个双向链表。那么在实际读写的时候，很大的概率相邻的节点会放在相邻的页上，又可以充分利用磁盘顺序IO的高速读写特性。所以我们对MySQL优化的一大方向就是<strong>尽可能的多让数据顺序读写，少让数据随机读写</strong>。</p><p><img src="https://gitee.com/zysspace/pic/raw/master/images/202203242304316.png" alt=""></p><h4 id="b-树-b-树两者有何异同呢" tabindex="-1"><a class="header-anchor" href="#b-树-b-树两者有何异同呢" aria-hidden="true">#</a> <strong>B 树&amp; B+树两者有何异同呢？</strong></h4><ul><li>B 树的所有节点既存放键(key) 也存放 数据(data)，而 B+树只有叶子节点存放 key 和 data，非叶子只存放 key。</li><li>B 树的叶子节点都是独立的，不支持范围查找;B+树的叶子节点有一条引用链指向与它相邻的叶子节点。</li><li>B 树的检索的过程相当于对范围内的每个节点的关键字做二分查找，可能还没有到达叶子节点，检索就结束了。而 B+树的检索效率就很稳定了，任何查找都是从根节点到叶子节点的过程，叶子节点的顺序检索很明显。</li></ul><h4 id="mysql为什么使用了b-tree而不是b-tree" tabindex="-1"><a class="header-anchor" href="#mysql为什么使用了b-tree而不是b-tree" aria-hidden="true">#</a> mysql为什么使用了b+tree而不是b-tree</h4><ul><li>由于非叶子节点不存储 data，所以一个存储页可以存储更多的非叶子节点，也就是说使用 b+树单次磁盘 I/O拿到的相同大小存储页中包含的信息量相比 b-树更大，所以减少了同样数据量下每次查询的io次数。</li><li>MySQL 是关系型数据库，经常会按照区间来访问某个索引列，B+树的叶子节点间按顺序建立了链指针，加强了区间访问性，所以 B+树对索引列上的区间范围查询很友好。而 B 树每个节点的 key 和 data 在一起，无法进行区间查找。</li><li>B+Tree扫库和扫表能力更强。如果我们要根据索引去进行数据表的扫描，对B-TREE进行扫描，需要把整棵树遍历一遍，而B+TREE只需要遍历他的所有叶子节点即可（叶子节点之间有引用）。</li><li>B+TREE磁盘读写能力更强。他的根节点和支节点不保存数据区，所以根节点和支节点同样大小的情况下，保存的关键字要比B-TREE要多。而叶子节点不保存子节点引用，能用于保存更多的关键字和数据。所以，B+TREE读写一次磁盘加载的关键字比B-TREE更多。</li><li>B+Tree排序能力更强。B+Tree天然具有排序功能。</li><li>B+Tree查询性能稳定。B+Tree数据只保存在叶子节点，每次查询数据，查询IO次数一定是稳定的。当然这个每个人的理解都不同，因为在B-TREE如果根节点命中直接返回，确实效率更高。</li></ul><h4 id="innodb中3层b-树可以存多少行数据" tabindex="-1"><a class="header-anchor" href="#innodb中3层b-树可以存多少行数据" aria-hidden="true">#</a> InnoDB中3层B+树可以存多少行数据？</h4><p>在 MySQL 中我们的 <strong>InnoDB 页的大小默认是 16k</strong></p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>SHOW GLOBAL STATUS like &#39;Innodb_page_size&#39;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>我们假设主键 ID 为 bigint 类型，长度为 8 字节，而指针大小在 InnoDB 源码中设置为 6 字节，这样一共 14 字节，我们一个页中能存放多少这样的单元，其实就代表有多少指针，即 16384/（8+6）=1170。</p><p>假设一行数据是1k，每一个指针对应的子节点多存满也就是占16k，所以3阶b+tree可以存储 1170 X 1170 X 16 X 1 = 21902400 ，2千多万</p><p>对于B-tree,因为叶子节点也存储数据了，假设一行数据是1k，存储2千万数据，需要 16的n次方 ，n肯定大于3</p><p><strong>所以在 InnoDB 中 B+ 树高度一般为 1-3 层，它就能满足千万级的数据存储。</strong></p><h4 id="hash" tabindex="-1"><a class="header-anchor" href="#hash" aria-hidden="true">#</a> Hash</h4><p>对索引的key进行一次hash计算就可以定位出数据存储的位置 很多时候Hash索引要比B+ 树索引更高效 仅能满足 “=”，“IN”，不支持范围查询（这是最大的缺点） hash冲突问题</p><p><img src="https://gitee.com/zysspace/pic/raw/master/images/202203241849585.png" alt=""></p><h2 id="索引类型" tabindex="-1"><a class="header-anchor" href="#索引类型" aria-hidden="true">#</a> 索引类型</h2><h4 id="聚簇索引-聚集索引" tabindex="-1"><a class="header-anchor" href="#聚簇索引-聚集索引" aria-hidden="true">#</a> 聚簇索引（聚集索引）</h4><p>并不是一种单独的索引类型， 而是一种数据存储方式。 具体细节取决于不同的实现， InnoDB 的聚簇索引其实就是在同一个结构中保存了 B-Tree 索引和数据行。因为无法同时把数据行存放在两个不同的地方，所以一个表中只能有且只有有一个聚簇索引。</p><p>叶子节点包含了完整的数据记录，节点页（非叶子节点）只包含索引列。</p><p><strong>主键索引属于聚集索引。</strong></p><p>聚簇索引的表现形式：</p><p>（1）如果表定义了主键，则主键就是聚集索引；</p><p>（2）如果表没有定义主键，则第一个唯一非空索引列是聚集索引；</p><p>（3）如果以上两种都不存在，InnoDB会创建一个隐藏的row-id作为聚集索引；</p><p>表数据文件本身就是按B+Tree组织的一个索引结构文件。</p><p>在 Mysql 中，InnoDB 引擎的表的 <code>.ibd</code>文件就包含了该表的索引和数据，对于 InnoDB 引擎表来说，该表的索引(B+树)的每个非叶子节点存储索引，叶子节点存储索引和索引对应的数据。</p><p><strong>为什么建议InnoDB表必须建主键，并且推荐使用整型的自增主键？</strong></p><p>在 mysql 的数据存储中 idb 文件中，要使用一颗聚簇索引来维护一个 b+ 树保存数据，那么 mysql 在组织索引的时候，会依赖唯一id，有下列几种情况：</p><ol><li>如果有一个主键，可以直接使用主键建索引</li><li>如果没有主键，会从第一列开始选择一列所有值都不相同的，作为索引列</li><li>如果没有选到唯一值的索引列，mysql 会帮忙建立一个隐藏列，维护一个唯一id，以此来组织索引</li></ol><p>那么为了避免 mysql 选择索引列和建立隐藏列的性能损耗，建议手动建立一个主键。</p><p><strong>为什么推荐使用整形作为主键</strong></p><ol><li>使用整形作为主键相比字符型可以节省数据页的空间。</li><li>构建索引 b+ 树时，为了保证索引的有序性，使用整形可以避免页分裂。</li><li>在索引中查找数据时，减少比较的性能。</li></ol><p><strong>主键为什么要自增</strong></p><p>因为索引结构 b+ 树，具有有序的特性，如果主键不是自增的，在进行增删数据的时候，会判断数据应该存放的位置，进行插入和删除，为了保持平衡，会对数据页进行分裂等操作移动数据，严重影响性能，所以主键需要是自增的，插入时，插入在索引数据页最后。</p><p><strong>聚簇索引优点</strong></p><p>访问数据快，索引和数据保存在同一个树中，从聚簇索引获取数据比在非聚簇索引中获取数据更快</p><p>使用覆盖索引扫描的查询可以直接使用页节点中的主键值</p><p><strong>聚簇索引缺点</strong></p><ul><li>基于聚簇索引的表在插入新行，或者主键被更新导致需要移动行时，可能面临“页分裂”，当行的主键值要求必须将这行插入到某个已满的页中时，存储引擎会将该页分裂成两个页面来容纳该行，这就是页分裂</li><li>聚簇索引可能导致全表扫描变慢，尤其是行比较稀疏，或者由于页分裂导致数据存储不连续时候。</li></ul><h4 id="非聚集索引" tabindex="-1"><a class="header-anchor" href="#非聚集索引" aria-hidden="true">#</a> 非聚集索引</h4><p><strong>非聚集索引即索引结构和数据分开存放的索引。</strong></p><p>非聚集索引的优点</p><p><strong>更新代价比聚集索引要小</strong> 。非聚集索引的更新代价就没有聚集索引那么大了，非聚集索引的叶子节点是不存放数据的</p><p>非聚集索引的缺点</p><ol><li>跟聚集索引一样，非聚集索引也依赖于有序的数据</li><li><strong>可能会二次查询(回表)</strong> :这应该是非聚集索引最大的缺点了。 当查到索引对应的指针或主键后，可能还需要根据指针或主键再到数据文件或表中查询。</li></ol><p><img src="https://gitee.com/zysspace/pic/raw/master/images/202203011627409.png" alt=""></p><h4 id="辅助索引-二级索引" tabindex="-1"><a class="header-anchor" href="#辅助索引-二级索引" aria-hidden="true">#</a> <strong>辅助索引（二级索引）</strong></h4><p>二级索引的叶子节点包含了引用行的主键列，注意是包含，不是全部。</p><p><strong>二级索引又称为辅助索引，是因为二级索引的叶子节点存储的数据是主键。也就是说，通过二级索引，可以定位主键的位置。</strong></p><p><strong>二级索引访问需要两次索引查找，二级索引叶子节点保存的不是指向行的物理位置的指针，而是行的主键值，查找时存储引擎需要找到二级索引的叶子节点获得对应的主键值，然后根据这个值去聚簇索引中查找对应的行</strong></p><p>唯一索引，普通索引，前缀索引等索引属于二级索引。</p><p><strong>唯一索引(Unique Key)</strong> ：唯一索引也是一种约束。<strong>唯一索引的属性列不能出现重复的数据，但是允许数据为 NULL，一张表允许创建多个唯一索引。</strong> 建立唯一索引的目的大部分时候都是为了该属性列的数据的唯一性，而不是为了查询效率。</p><p><strong>普通索引(Index)</strong> ：<strong>普通索引的唯一作用就是为了快速查询数据，一张表允许创建多个普通索引，并允许数据重复和 NULL。</strong></p><p><strong>前缀索引(Prefix)</strong> ：前缀索引只适用于字符串类型的数据。前缀索引是对文本的前几个字符创建索引，相比普通索引建立的数据更小， 因为只取前几个字符。</p><p><strong>全文索引(Full Text)</strong> ：全文索引主要是为了检索大文本数据中的关键字的信息，是目前搜索引擎数据库使用的一种技术。Mysql5.6 之前只有 MYISAM 引擎支持全文索引，5.6 之后 InnoDB 也支持了全文索引。</p><p>t(id PK, name KEY, sex, flag);</p><p>id是聚集索引，name是普通索引。</p><p>表中有四条记录： 1, shenjian, m, A 3, zhangsan, m, A 5, lisi, m, A 9, wangwu, f, B</p><p><img src="https://pic1.zhimg.com/80/v2-b36e5b79f18ce77642f53f50e2317561_720w.png?source=d16d100b" alt="img"></p><p>两个B+树索引分别如上图：</p><p>（1）id为PK，聚集索引，叶子节点存储行记录；</p><p>（2）name为KEY，普通索引，叶子节点存储PK值，即id； 既然从普通索引无法直接定位行记录，那<strong>普通索引的查询过程是怎么样的呢？</strong> 通常情况下，需要扫码两遍索引树。 例如： <em>select * from t where name=&#39;lisi&#39;;</em></p><p><img src="https://pic1.zhimg.com/80/v2-c2f164de6327fe14f1a56e93c94fd82c_720w.png?source=d16d100b" alt="img"></p><p>辅助索引的存在并不影响数据在聚集索引中的组织，因此每张表上可以有多个辅助索引。当通过辅助索引来寻找数据时，InnoDB存储引擎会遍历辅助索引并通过叶级别的指针获得指向主键索引的主键，然后再通过主键索引（聚集索引）来找到一个完整的行记录。这个过程也被称为<strong>回表</strong>。也就是根据辅助索引的值查询一条完整的用户记录需要使用到2棵B+树----一次辅助索引，一次聚集索引。</p><p>为什么我们还需要一次回表操作呢?直接把完整的用户记录放到辅助索引d的叶子节点不就好了么？如果把完整的用户记录放到叶子节点是可以不用回表，但是太占地方了，相当于每建立一棵B+树都需要把所有的用户记录再都拷贝一遍，这就有点太浪费存储空间了。而且每次对数据的变化要在所有包含数据的索引中全部都修改一次，性能也非常低下。</p><p>很明显，回表的记录越少，性能提升就越高，需要回表的记录越多，使用二级索引的性能就越低，甚至让某些查询宁愿使用全表扫描也不使用二级索引。</p><p>那什么时候采用全表扫描的方式，什么时候使用采用二级索引 + 回表的方式去执行查询呢？这个就是查询优化器做的工作，查询优化器会事先对表中的记录计算一些统计数据，然后再利用这些统计数据根据查询的条件来计算一下需要回表的记录数，需要回表的记录数越多，就越倾向于使用全表扫描，反之倾向于使用二级索引 + 回表的方式。</p><p><strong>非聚集索引不一定回表查询。</strong></p><blockquote><p>试想一种情况，用户准备使用 SQL 查询用户名，而用户名字段正好建立了索引。</p></blockquote><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code> SELECT name FROM table WHERE name=&#39;张飞&#39;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote><p>那么这个索引的 key 本身就是 name，查到对应的 name 直接返回就行了，无需回表查询。</p></blockquote><h4 id="覆盖索引" tabindex="-1"><a class="header-anchor" href="#覆盖索引" aria-hidden="true">#</a> 覆盖索引</h4><p>如果一个索引包含（或者说覆盖）所有需要查询的字段的值，我们就称之为“覆盖索引”。我们知道在 InnoDB 存储引擎中，如果不是主键索引，叶子节点存储的是主键+列值。最终还是要“回表”，也就是要通过主键再查找一次。这样就会比较慢覆盖索引就是把要查询出的列和索引是对应的，不做回表操作！</p><p><strong>覆盖索引即需要查询的字段正好是索引的字段，那么直接根据该索引，就可以查到数据了， 而无需回表查询。</strong></p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>create table user ( id int primary key, name varchar(20), sex varchar(5), index(name) ) engine=innodb;

select id,name from user where name=&#39;李白&#39;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>能够命中name索引，索引叶子节点存储了主键id，通过name的索引树即可获取id和name，无需回表，符合索引覆盖，效率较高。</p><h4 id="联合索引-复合索引" tabindex="-1"><a class="header-anchor" href="#联合索引-复合索引" aria-hidden="true">#</a> <strong>联合索引（复合索引）</strong></h4><p>多个字段组成的索引称之为联合索引。</p><p><img src="https://gitee.com/zysspace/pic/raw/master/images/202203242112993.png" alt=""></p><p>要注意一点，建立联合索引只会建立1棵B+树，多个列分别建立索引会分别以每个列则建立B+树，有几个列就有几个B+树，比如，index(note)、index(b)，就分别对note,b两个列各构建了一个索引。</p><p>index(note,b)在索引构建上，包含了两个意思：</p><p>1、先把各个记录按照note列进行排序。</p><p>2、在记录的note列相同的情况下，采用b列进行排序。</p><p><img src="https://note.youdao.com/yws/public/resource/fd5eae820148eb4f7bd9ced08f48aab4/xmlnote/ED3A0EA1769A4A70821BB45785D1E46B/2097" alt="https://note.youdao.com/yws/public/resource/fd5eae820148eb4f7bd9ced08f48aab4/xmlnote/ED3A0EA1769A4A70821BB45785D1E46B/2097"></p><p><strong>最左匹配原则</strong></p><p>所谓最左原则指的就是如果你的 SQL 语句中用到了联合索引中的最左边的索引，那么这条 SQL 语句就可以利用这个联合索引去进行匹配，值得注意的是，当遇到范围查询(&gt;、&lt;、between、like)就会停止匹配。</p><p><strong>利用索引就是利用索引的有序性。</strong></p><p>建立联合索引的原则：尽量选择区分度高的列作为索引，区分度的公式是count(distinct col)/count(*)，表示字段不重复的比例，比例越大我们扫描的记录数越少，唯一键的区分度是1，而一些状态、性别字段可能在大数据面前区分度就是0</p><p>注意：</p><ul><li>like &#39;张三%&#39;会使用索引</li></ul><p>假设一个表具有以下规范：</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>CREATETABLE test (   
  id         INT NOT NULL, 
  last_name  CHAR(30)NOTNULL,  
  first_name CHAR(30)NOTNULL,
PRIMARYKEY(id),INDEXname(last_name,first_name));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该name指数是在一个索引 last_name和first_name 列。该索引可用于查询中的查找，这些查询指定在已知范围内的last_name和first_name 值组合的 值。它也可以用于仅指定last_name值的查询， 因为该列是索引的最左前缀（如本节稍后所述）。因此，该name索引用于以下查询中的查找：</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>SELECT * FROM test   WHERE last_name=&#39;Jones&#39;;  
SELECT * FROM test   WHERE last_name=&#39;Jones&#39; AND first_name=&#39;John&#39;;  
SELECT * FROM test   WHERE last_name=&#39;Jones&#39; AND (first_name=&#39;John&#39; OR first_name=&#39;Jon&#39;);  
SELECT * FROM test   WHERE last_name=&#39;Jones&#39; AND first_name &gt;=&#39;M&#39; AND first_name &lt; &#39;N&#39;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是，在以下查询中，name索引 不用于查找：</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>SELECT * FROM test WHERE first_name=&#39;John&#39;;  
SELECT * FROM test   WHERE last_name=&#39;Jones&#39; OR first_name=&#39;John&#39;;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>假设您发出以下 SELECT语句：</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>SELECT * FROM tbl_name WHERE col1=val1 AND col2=val2;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>如果col1和上存在多列索引col2，则可以直接获取相应的行。如果col1和上存在单独的单列索引 col2，则优化器将尝试使用索引合并优化，或尝试通过确定哪个索引排除更多行并使用来查找限制性最强的索引。该索引以获取行。</p><p>如果表具有多列索引，那么优化器可以使用索引的任何最左前缀来查找行。举例来说，如果你有一个三列的索引(col1, col2, col3)，你有索引的搜索功能 (col1)，(col1, col2)以及 (col1, col2, col3)。</p><p>如果列不构成索引的最左前缀，则MySQL无法使用索引执行查找。假设您具有以下语句：</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>SELECT * FROM tbl_name WHERE col1=val1; 
SELECT * FROM tbl_name WHERE col1=val1 AND col2=val2;  SELECT * FROM tbl_name WHERE col2=val2; 
SELECT * FROM tbl_name WHERE col2=val2 AND col3=val3;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果存在一个索引(col1, col2, col3)，则仅前两个查询使用该索引。第三个查询和第四个查询确实涉及索引列，但是不使用索引来执行查找，因为(col2)并且 (col2, col3)不是的最左前缀 (col1, col2, col3)。</p><p>只有当索引列的顺序和order by 子句的顺序完全一致，并且所有列的排序方向（正序或者倒序）一样时，会使用索引。</p><h4 id="全文索引" tabindex="-1"><a class="header-anchor" href="#全文索引" aria-hidden="true">#</a> <strong>全文索引</strong></h4><p>MySQL 5.6 以前的版本，只有 MyISAM 存储引擎支持全文索引。从InnoDB 1.2.x版本开始，InnoDB存储引擎开始支持全文检索，对应的MySQL版本是5.6.x系列。</p><p>注意，不管什么引擎，只有字段的数据类型为 char、varchar、text 及其系列才可以建全文索引。</p><h4 id="自适应哈希索引" tabindex="-1"><a class="header-anchor" href="#自适应哈希索引" aria-hidden="true">#</a> <strong>自适应哈希索引</strong></h4><p>我们知道B+树的查找次数,取决于B+树的高度,在生产环境中,B+树的高度一般为3~4层,故需要3~4次的IO查询。</p><p>所以在InnoDB存储引擎内部自己去监控索引表，如果监控到某个索引经常用，那么就认为是热数据，然后内部自己创建一个hash索引，称之为自适应哈希索引( Adaptive Hash Index,AHI)，创建以后，如果下次又查询到这个索引，那么直接通过hash算法推导出记录的地址，直接一次就能查到数据，比重复去B+tree索引中查询三四次节点的效率高了不少。</p><p>InnoDB存储引擎使用的哈希函数采用除法散列方式，其冲突机制采用链表方式。注意，对于自适应哈希索引仅是数据库自身创建并使用的，我们并不能对其进行干预。通过命令<strong>show engine innodb status\\G</strong>可以看到当前自适应哈希索引的使用状况。</p><div class="language-TEXT line-numbers-mode" data-ext="TEXT"><pre class="language-TEXT"><code>-------------------------------------
INSERT BUFFER AND ADAPTIVE HASH INDEX
-------------------------------------
Ibuf: size 1, free list len 953, seg size 955, 982 merges
merged operations:
 insert 710, delete mark 667158, delete 35599
discarded operations:
 insert 0, delete mark 0, delete 0
Hash table size 34679, node heap has 4 buffer(s)
Hash table size 34679, node heap has 46 buffer(s)
Hash table size 34679, node heap has 7 buffer(s)
Hash table size 34679, node heap has 7 buffer(s)
Hash table size 34679, node heap has 7 buffer(s)
Hash table size 34679, node heap has 4 buffer(s)
Hash table size 34679, node heap has 66 buffer(s)
Hash table size 34679, node heap has 12 buffer(s)
151.42 hash searches/s, 22.50 non-hash searches/s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>哈希索引只能用来搜索等值的查询,如 SELECT* FROM table WHERE index co=xxx。而对于其他查找类型,如范围查找,是不能使用哈希索引的,</p><p>因此这里会显示non- hash searches/s的统计情况。通过 hash searches: non-hash searches可以大概了解使用哈希索引后的效率。</p><p>由于AHI是由 InnoDB存储引擎控制的,因此这里的信息只供我们参考。不过我们可以通过观察 SHOW ENGINE INNODB STATUS的结果及参数 <strong>innodb_adaptive_hash_index</strong>来考虑是禁用或启动此特性,默认AHI为开启状态。</p><p>什么时候需要禁用呢？如果发现监视索引查找和维护哈希索引结构的额外开销远远超过了自适应哈希索引带来的性能提升就需要关闭这个功能。</p><p>同时在MySQL 5.7中，自适应哈希索引搜索系统被分区。每个索引都绑定到一个特定的分区，每个分区都由一个单独的 latch 锁保护。分区由 innodb_adaptive_hash_index_parts 配置选项控制 。在早期版本中，自适应哈希索引搜索系统受到单个 latch 锁的保护，这可能成为繁重工作负载下的争用点。innodb_adaptive_hash_index_parts 默认情况下，该 选项设置为8。最大设置为512。当然禁用或启动此特性和调整分区个数这个应该是DBA的工作，我们了解即可。</p><h2 id="索引在查询中的使用" tabindex="-1"><a class="header-anchor" href="#索引在查询中的使用" aria-hidden="true">#</a> <strong>索引在查询中的使用</strong></h2><p>索引在查询中的作用到底是什么？在我们的查询中发挥着什么样的作用呢？</p><p>请记住：</p><p>1、<strong>一个索引就是一个B+树，索引让我们的查询可以快速定位和扫描到我们需要的数据记录上，加快查询的速度</strong>。</p><p>2、<strong>一个select查询语句在执行过程中一般最多能使用一个二级索引来加快查询，即使在where条件中用了多个二级索引。</strong></p><p><strong>索引的代价</strong></p><p>世界上从来没有只有好处没有坏处的东西，如果你有，请你一定要告诉我，让我也感受一下。虽然索引是个好东西，在学习如何更好的使用索引之前先要了解一下使用它的代价，它在空间和时间上都会拖后腿。</p><p><strong>空间上的代价</strong></p><p>这个是显而易见的，每建立一个索引都要为它建立一棵B+树，每一棵B+树的每一个节点都是一个数据页，一个页默认会占用16KB的存储空间，一棵很大的B+树由许多数据页组成会占据很多的存储空间。</p><p><strong>时间上的代价</strong></p><p>每次对表中的数据进行增、删、改操作时，都需要去修改各个B+树索引。而且我们讲过，B+树每层节点都是按照索引列的值从小到大的顺序排序而组成了双向链表。不论是叶子节点中的记录，还是非叶子内节点中的记录都是按照索引列的值从小到大的顺序而形成了一个单向链表。</p><p>而增、删、改操作可能会对节点和记录的排序造成破坏，所以存储引擎需要额外的时间进行一些记录移位，页面分裂、页面回收的操作来维护好节点和记录的排序。如果我们建了许多索引，每个索引对应的B+树都要进行相关的维护操作，这必然会对性能造成影响。</p><p>既然索引这么有用，我们是不是创建越多越好？既然索引有代价，我们还是别创建了吧？当然不是！按照经验，一般来说，一张表6-7个索引以下都能够取得比较好的性能权衡。</p><p>那么创建索引的时候有什么好的策略让我们充分利用索引呢？</p><h2 id="高性能的索引创建策略" tabindex="-1"><a class="header-anchor" href="#高性能的索引创建策略" aria-hidden="true">#</a> <strong>高性能的索引创建策略</strong></h2><h3 id="索引列的类型尽量小" tabindex="-1"><a class="header-anchor" href="#索引列的类型尽量小" aria-hidden="true">#</a> <strong>索引列的类型尽量小</strong></h3><p>我们在定义表结构的时候要显式的指定列的类型，以整数类型为例，有TTNYINT、NEDUMNT、INT、BIGTNT这么几种，它们占用的存储空间依次递增，我们这里所说的类型大小指的就是该类型表示的数据范围的大小。能表示的整数范围当然也是依次递增，如果我们想要对某个整数列建立索引的话，在表示的整数范围允许的情况下，尽量让索引列使用较小的类型，比如我们能使用INT就不要使用BIGINT，能使用NEDIUMINT就不要使用INT，这是因为:</p><p>·数据类型越小，在查询时进行的比较操作越快（CPU层次)</p><p>·数据类型越小，索引占用的存储空间就越少，在一个数据页内就可以放下更多的记录，从而减少磁盘/0带来的性能损耗，也就意味着可以把更多的数据页缓存在内存中，从而加快读写效率。</p><p>这个建议对于表的主键来说更加适用，因为不仅是聚簇索引中会存储主键值，其他所有的二级索引的节点处都会存储一份记录的主键值，如果主键适用更小的数据类型，也就意味着节省更多的存储空间和更高效的I/0。</p><h3 id="索引的选择性-离散性" tabindex="-1"><a class="header-anchor" href="#索引的选择性-离散性" aria-hidden="true">#</a> <strong>索引的选择性/离散性</strong></h3><p>创建索引应该选择选择性/离散性高的列。索引的选择性/离散性是指，不重复的索引值（也称为基数，cardinality)和数据表的记录总数（N)的比值，范围从1/N到1之间。索引的选择性越高则查询效率越高，因为选择性高的索引可以让MySQL在查找时过滤掉更多的行。唯一索引的选择性是1，这是最好的索引选择性，性能也是最好的。</p><p>很差的索引选择性就是列中的数据重复度很高。</p><p>怎么算索引的选择性/离散性？比如order_exp这个表：</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>select  COUNT(DISTINCT order_no)/count(*) cnt from order_exp;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>数值越大离散度越高。</p><h3 id="前缀索引" tabindex="-1"><a class="header-anchor" href="#前缀索引" aria-hidden="true">#</a> <strong>前缀索引</strong></h3><p>前缀索引仅限于字符串类型，较普通索引会占用更小的空间，所以可以考虑使用前缀索引带替普通索引。</p><p>当要索引的列字符很多时 索引则会很大且变慢，可以只索引列开始的部分字符串 节约索引空间 从而提高索引效率 。尤其对于BLOB、TEXT或者很长的VARCHAR类型的列，应该使用前缀索引，因为MySQL不允许索引这些列的完整长度）。</p><p>诀窍在于要选择足够长的前缀以保证较高的选择性，同时又不能太长（以便节约空间)。前缀应该足够长，以使得前缀索引的选择性接近于索引整个列。</p><blockquote><p>【强制】在 varchar 字段上建立索引时，必须指定索引长度，没必要对全字段建立索引，根据实际文本区分度决定索引长度。</p><p>说明：索引的长度与区分度是一对矛盾体，一般对字符串类型数据，长度为 20 的索引，区分度会高达 90%以上，可以使用 count(distinct left(列名, 索引长度))/count(*)的区分度来确定。</p></blockquote><p><img src="https://note.youdao.com/yws/public/resource/fd5eae820148eb4f7bd9ced08f48aab4/xmlnote/B894074E19AA4DF1B67C3A6B7C8C5324/2079" alt="https://note.youdao.com/yws/public/resource/fd5eae820148eb4f7bd9ced08f48aab4/xmlnote/B894074E19AA4DF1B67C3A6B7C8C5324/2079"></p><p>可以看见，从第10个开始选择性的增加值很高，随着前缀字符的越来越多，选择度也在不断上升，但是增长到第15时，已经和第14没太大差别了，选择性提升的幅度已经很小了，都非常接近整个列的选择性了。</p><p>那么针对这个字段做前缀索引的话，从第13到第15都是不错的选择，甚至第12也不是不能考虑。</p><p>在上面的示例中，已经找到了合适的前缀长度，如何创建前缀索引:</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>ALTER TABLE order_exp ADD KEY (order_note(14));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>建立前缀索引后查询语句并不需要更改：</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>select * from order_exp where order_note = &#39;xxxx&#39; ;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>前缀索引是一种能使索引更小、更快的有效办法，但另一方面也有其缺点MySQL无法使用前缀索引做ORDER BY和GROUP BY，也无法使用前缀索引做覆盖扫描。</p><p>有时候后缀索引 (suffix index)也有用途（例如，找到某个域名的所有电子邮件地址)。MySQL原生并不支持反向索引，但是可以把字符串反转后存储，并基于此建立前缀索引。可以通过触发器或者应用程序自行处理来维护索引。</p><h3 id="选择合适的字段创建索引" tabindex="-1"><a class="header-anchor" href="#选择合适的字段创建索引" aria-hidden="true">#</a> <strong>选择合适的字段创建索引</strong></h3><p><strong>不为 NULL 的字段</strong></p><p>索引字段的数据应该尽量不为 NULL，因为对于数据为 NULL 的字段，数据库较难优化。如果字段频繁被查询，但又避免不了为 NULL，建议使用 0,1,true,false 这样语义较为清晰的短值或短字符作为替代。</p><p><strong>只为用于搜索、排序或分组的列创建索引</strong></p><p>也就是说，只为出现在WHERE 子句中的列、连接子句中的连接列创建索引，而出现在查询列表中的列一般就没必要建立索引了，除非是需要使用覆盖索引。又或者为出现在ORDER BY或GROUP BY子句中的列创建索引，这句话什么意思呢？比如：</p><p>SELECT * FROM order_exp ORDER BY insert_time, order_status,expire_time;</p><p>查询的结果集需要先按照insert_time值排序，如果记录的insert_time值相同，则需要按照order_status来排序，如果order_status的值相同，则需要按照expire_time排序。回顾一下联合索引的存储结构，u_idx_day_status索引本身就是按照上述规则排好序的，所以直接从索引中提取数据，然后进行回表操作取出该索引中不包含的列就好了。</p><p>当然ORDER BY的子句后边的列的顺序也必须按照索引列的顺序给出，如果给出ORDER BY order_status,expire_time, insert_time的顺序，那也是用不了B+树索引的，原因不用再说了吧。</p><p>SELECT insert_time, order_status,expire_time,count(*) FROM order_exp GROUP BY insert_time, order_status,expire_time;</p><p>这个查询语句相当于做了3次分组操作：</p><p>先把记录按照insert_time值进行分组，所有insert_time值相同的记录划分为一组。</p><p>将每个insert_time值相同的分组里的记录再按照order_status的值进行分组，将order_status值相同的记录放到一个小分组里。</p><p>再将上一步中产生的小分组按照expire_time的值分成更小的分组。</p><p>然后针对最后的分组进行统计，如果没有索引的话，这个分组过程全部需要在内存里实现，而如果有了索引的话，恰巧这个分组顺序又和我们的u_idx_day_status索引中的索引列的顺序是一致的，而我们的B+树索引又是按照索引列排好序的，这不正好么，所以可以直接使用B+树索引进行分组。和使用B+树索引进行排序是一个道理，分组列的顺序也需要和索引列的顺序一致。</p><h3 id="合理设计多列索引" tabindex="-1"><a class="header-anchor" href="#合理设计多列索引" aria-hidden="true">#</a> <strong>合理设计多列索引</strong></h3><p>很多人对多列索引的理解都不够。一个常见的错误就是，为每个列创建独立的索引，或者按照错误的顺序创建多列索引。</p><p>我们遇到的最容易引起困惑的问题就是索引列的顺序。正确的顺序依赖于使用该索引的查询，并且同时需要考虑如何更好地满足排序和分组的需要。反复强调过，在一个多列B-Tree索引中，索引列的顺序意味着索引首先按照最左列进行排序，其次是第二列，等等。所以，索引可以按照升序或者降序进行扫描，以满足精确符合列顺序的ORDER BY、GROUP BY和DISTINCT等子句的查询需求。</p><p>所以多列索引的列顺序至关重要。对于如何选择索引的列顺序有一个经验法则：将选择性最高的列放到索引最前列。当不需要考虑排序和分组时，将选择性最高的列放在前面通常是很好的。这时候索引的作用只是用于优化WHERE条件的查找。在这种情况下，这样设计的索引确实能够最快地过滤出需要的行，对于在WHERE子句中只使用了索引部分前缀列的查询来说选择性也更高。</p><p>然而，性能不只是依赖于索引列的选择性，也和查询条件的有关。可能需要根据那些运行频率最高的查询来调整索引列的顺序，比如排序和分组，让这种情况下索引的选择性最高。</p><p>同时，在优化性能的时候，可能需要使用相同的列但顺序不同的索引来满足不同类型的查询需求。</p><h3 id="处理冗余和重复索引" tabindex="-1"><a class="header-anchor" href="#处理冗余和重复索引" aria-hidden="true">#</a> <strong>处理冗余和重复索引</strong></h3><p>MySQL允许在相同列上创建多个索引，无论是有意的还是无意的。MySQL需要单独维护重复的索引，并且优化器在优化查询的时候也需要逐个地进行考虑，这会影响性能。重复索引是指在相同的列上按照相同的顺序创建的相同类型的索引。应该避免这样创建重复索引，发现以后也应该立即移除。</p><h2 id="建立索引原则" tabindex="-1"><a class="header-anchor" href="#建立索引原则" aria-hidden="true">#</a> 建立索引原则</h2><p>1、索引列不能参与计算，禁止对索引字段使用函数、运算符操作，会使索引失效，比如from_unixtime(create_time) = ’2014-05-29’就不能使用到索引，原因很简单，b+树中存的都是数据表中的字段值，但进行检索时，需要把所有元素都应用函数才能比较，显然成本太大。所以语句应该写成create_time = unix_timestamp(’2014-05-29’)。</p><p>2、联合索引注意最左匹配原则：必须按照从左到右的顺序匹配，mysql会一直向右匹配直到遇到范围查询(&gt;、&lt;、between、like)就停止匹配，比如a = 1 and b = 2 and c &gt; 3 and d = 4 如果建立(a,b,c,d)顺序的索引，d是用不到索引的，如果建立(a,b,d,c)的索引则都可以用到，a,b,d的顺序可以任意调整</p><p>3、在区分度高的字段上面建立索引可以有效的使用索引，区分度太低，无法有效的利用索引，可能需要扫描所有数据页，此时和不使用索引差不多</p><p>4、查询记录的时候，少使用*，尽量去利用索引覆盖，可以减少回表操作，提升效率</p><p>5、有些查询可以采用联合索引，进而使用到索引下推（IPC），也可以减少回表操作，提升效率</p><p>6、字符串字段和数字比较的时候会使索引无效</p><p>7、模糊查询’%值%&#39;会使索引无效，变为全表扫描，但是’值%&#39;这种可以有效利用索引</p><p>8、排序中尽量使用到索引字段，这样可以减少排序，提升查询效率</p><p>9、在使用 InnoDB 时使用与业务无关的自增主键作为主键，即使用逻辑主键，而不要使用业务主键。<strong>主键尽量是很少改变的列</strong>，行是按照聚集索引物理排序的，如果主键频繁改变(update)，物理顺序会改变，MySQL要不断调整B+树，并且中间可能会产生页面的分裂和合并等等，会导致性能会急剧降低。</p><p>10、避免数据类型的隐式转换</p><h2 id="mysql-为表字段添加索引" tabindex="-1"><a class="header-anchor" href="#mysql-为表字段添加索引" aria-hidden="true">#</a> MySQL 为表字段添加索引</h2><p>1.添加 PRIMARY KEY（主键索引）</p><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token keyword">ALTER</span> <span class="token keyword">TABLE</span> <span class="token identifier"><span class="token punctuation">\`</span>table_name<span class="token punctuation">\`</span></span> <span class="token keyword">ADD</span> <span class="token keyword">PRIMARY</span> <span class="token keyword">KEY</span> <span class="token punctuation">(</span> <span class="token identifier"><span class="token punctuation">\`</span>column<span class="token punctuation">\`</span></span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>2.添加 UNIQUE(唯一索引)</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>ALTER TABLE \`table_name\` ADD UNIQUE ( \`column\` )
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>3.添加 INDEX(普通索引)</p><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token keyword">ALTER</span> <span class="token keyword">TABLE</span> <span class="token identifier"><span class="token punctuation">\`</span>table_name<span class="token punctuation">\`</span></span> <span class="token keyword">ADD</span> <span class="token keyword">INDEX</span> index_name <span class="token punctuation">(</span> <span class="token identifier"><span class="token punctuation">\`</span>column<span class="token punctuation">\`</span></span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>4.添加 FULLTEXT(全文索引)</p><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token keyword">ALTER</span> <span class="token keyword">TABLE</span> <span class="token identifier"><span class="token punctuation">\`</span>table_name<span class="token punctuation">\`</span></span> <span class="token keyword">ADD</span> FULLTEXT <span class="token punctuation">(</span> <span class="token identifier"><span class="token punctuation">\`</span>column<span class="token punctuation">\`</span></span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>5.添加多列索引</p><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token keyword">ALTER</span> <span class="token keyword">TABLE</span> <span class="token identifier"><span class="token punctuation">\`</span>table_name<span class="token punctuation">\`</span></span> <span class="token keyword">ADD</span> <span class="token keyword">INDEX</span> index_name <span class="token punctuation">(</span> <span class="token identifier"><span class="token punctuation">\`</span>column1<span class="token punctuation">\`</span></span><span class="token punctuation">,</span> <span class="token identifier"><span class="token punctuation">\`</span>column2<span class="token punctuation">\`</span></span><span class="token punctuation">,</span> <span class="token identifier"><span class="token punctuation">\`</span>column3<span class="token punctuation">\`</span></span> <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,298),t=[i];function r(l,d){return a(),n("div",null,t)}const c=e(p,[["render",r],["__file","索引.html.vue"]]);export{c as default};
