import{_ as e,W as n,X as i,a1 as d}from"./framework-2afc6763.js";const a={},l=d(`<p>间隙锁，锁的就是两个值之间的空隙。Mysql默认级别是repeatable-read，间隙锁在某些情况下可以解决幻读问题。间隙锁属于行锁中的一种，间隙锁是在事务加锁后其锁住的是表记录的某一个区间，当表的相邻ID之间出现空隙则会形成一个区间，遵循左开右闭原则。</p><p>准备表</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>CREATE TABLE \`account\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) DEFAULT NULL,
  \`balance\` int(11) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB AUTO_INCREMENT=1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>准备数据</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>INSERT INTO \`account\` VALUES (1, &#39;lilei&#39;, 450);
INSERT INTO \`account\` VALUES (2, &#39;hanmei&#39;, 16000);
INSERT INTO \`account\` VALUES (3, &#39;lucy&#39;, 2400);
INSERT INTO \`account\` VALUES (10, &#39;liuda&#39;, 1000);
INSERT INTO \`account\` VALUES (20, &#39;zhaosi&#39;, 2000);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么间隙就有 id 为 (3,10)，(10,20)，(20,正无穷) 这三个区间，那么间隙锁有（-∞，3]（3，10]（10，20]（20，+∞]</p><h4 id="案例一" tabindex="-1"><a class="header-anchor" href="#案例一" aria-hidden="true">#</a> 案例一</h4><p>开启一个事务</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>#手动提交
SET autocommit = 0;
BEGIN;

update account set name = &#39;kongming&#39; where id &gt; 8 and id &lt;18;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时没有提交事务。</p><p>开启另外一个事务</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>SET autocommit = 0;
BEGIN;
#阻塞
INSERT INTO \`account\` VALUES (7, &#39;laohuang&#39;, 3000);
#阻塞
update account set balance = 5000 WHERE id = 20;

#可以执行成功
INSERT INTO \`account\` VALUES (21, &#39;laosong&#39;, 3000);

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看出，事务1没有提交，则其他事务没法在这个<strong>范围所包含的所有行记录(包括间隙行记录)以及行记录所在的间隙</strong>里插入或修改任何数据，即id在(3,20]区间都无法修改数据，注意最后那个20也是包含在内的。</p><p><strong>间隙锁是在可重复读隔离级别下才会生效。</strong></p><h4 id="案例二" tabindex="-1"><a class="header-anchor" href="#案例二" aria-hidden="true">#</a> 案例二</h4><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>#事务一
SET autocommit = 0;
BEGIN;

update account set balance = 10000 WHERE id = 11;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>事务一没有提交。</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>#事务二
SET autocommit = 0;
BEGIN;
#阻塞
INSERT INTO \`account\` VALUES (12, &#39;laohuang&#39;, 3000);


COMMIT;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>事务二会阻塞。</p><table><thead><tr><th>步骤</th><th style="text-align:left;">事务A</th><th>事务B</th></tr></thead><tbody><tr><td></td><td style="text-align:left;">begin；</td><td>begin;</td></tr><tr><td>1</td><td style="text-align:left;">update account set balance = 10000 WHERE id = 11;</td><td>-</td></tr><tr><td></td><td style="text-align:left;"></td><td></td></tr><tr><td>2</td><td style="text-align:left;">-</td><td>INSERT INTO <code>account</code> VALUES (12, &#39;laohuang&#39;, 3000);<img src="https://math.jianshu.com/math?formula=\\color{red}{blocked}" alt="olor{red}{blocked}"></td></tr><tr><td>3</td><td style="text-align:left;">commit;</td><td>-</td></tr></tbody></table><p>事务一会对数据库表增加（10，20]这个区间锁，这时insert id = 12 的数据的时候就会因为区间锁（10，20]而被锁住无法执行。</p>`,21),s=[l];function t(c,r){return n(),i("div",null,s)}const u=e(a,[["render",t],["__file","间隙锁.html.vue"]]);export{u as default};
