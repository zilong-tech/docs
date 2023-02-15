---
title: VuePress + Github Pages 搭建博客
author: 程序员子龙
index: true
icon: discover
category:
- 工具
---
### VuePress

VuePress 是一个以 Markdown 为中心的静态网站生成器。

### 快速开始

1、创建并进入一个新目录

```bash
mkdir vuepress-starter && cd vuepress-starter
```

2、使用你喜欢的包管理器进行初始化

```bash
yarn init # npm init
```

3、将 VuePress 安装为本地依赖

```bash
yarn add -D vuepress # npm install -D vuepress
```

4、创建第一篇文档

```bash
mkdir docs && echo '# Hello VuePress' > docs/README.md
```

5、在 `package.json` 中添加一些 [scripts(opens new window)](https://classic.yarnpkg.com/zh-Hans/docs/package-json#toc-scripts)

```json
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```

 最终package.json如下：

```json
{
    "name": "blog",
    "version": "1.0.0",
    "description": "开发技术，分布式，微服务，高并发，高可用，高可扩展，高可维护，JVM技术，MySQL，分布式数据库，分布式事务，云原生，大数据，云计算，渗透技术，各种面试题，面试技巧",
    "main": "index.js",
    "keywords": [
        "开发技术，分布式，微服务，高并发，高可用，高可扩展，高可维护，JVM技术，MySQL，分布式数据库，分布式事务，云原生，大数据，云计算，渗透技术，各种面试题，面试技巧"
    ],
    "author": "程序员子龙",
    "license": "ISC",
    "scripts": {
        "docs:dev": "vuepress dev docs",
        "docs:build": "vuepress build docs"
    },
    "devDependencies": {
        "vuepress": "^1.9.8"
    }
}

```

6、在docs目录下新建目录kafka，新建md文件

注意：一定要包含README.md文件

7、在本地启动服务器

```bash
yarn docs:dev # npm run docs:dev
```

VuePress 会在 [http://localhost:8080 (opens new window)](http://localhost:8080/)启动一个热重载的开发服务器。

### 配置导航栏

#### 顶部导航栏

通过 `themeConfig.nav` 增加一些导航栏链接

```js
// .vuepress/config.js
module.exports = {
  title: '',
  description: '开发技术，分布式，微服务，高并发，高可用，高可扩展，高可维护，JVM技术，MySQL，分布式数据库，分布式事务，云原生，大数据，云计算，渗透技术，各种面试题，面试技巧',
  markdown:{
	  pageSuffix: '.md',
  },
  themeConfig: {
	   displayAllHeaders: true ,
	   activeHeaderLinks: false,
	   smoothScroll: true,
	   sidebarDepth: 2,
       nav: [
            { text: '首页', link: '/' },
            { 
                text: '消息中间件', 
                items: [
                    { text: 'kafka', link: '/kafka/' }
                ]
            }
        ],
	    sidebar: {
			 '/kafka/': genSidebar.genDefaultSidebar('kafka', 'kafka', true, 4),
			 '/': ['']
	
		}
  }

}
```

#### 侧边导航栏

通过配置 `themeConfig.sidebar` 侧边导航生效

通常文档多的时候手动配置侧边栏非常麻烦，因此这里采用了脚本自动生成，其原理如下：

1、遍历指定路径中的Markdown文档，并过滤掉无关文档；
 2、通过符号“.”切割文件名获取序号，根据文档序号进行排序；
 3、抽取文档名称作为侧边栏标题（title），并拼接出文档路径（path）

```js
// docs/.vuepress/utils/genSidebar.js
// docs/.vuepress/utils/genSidebar.js
const fs = require('fs');
const rpath = require('path');

// 获取根目录
var DOCS_PATH = rpath.resolve(__dirname, '../..');

// 比较文档序列
function cmpMarkDown(md1, md2) {
    var ls1 = md1.split('.');
    var ls2 = md2.split('.');
    return parseInt(ls1[0]) - parseInt(ls2[0]);
}

// 获取md文档列表
function getMarkDownList(path, is_sort) {
    var list = new Array();
    if (typeof path == "string" && typeof is_sort == "boolean") {
        let file_list = fs.readdirSync(path);
        for (let i = 0; i < file_list.length; i++) {
            let file = file_list[i];
            if (file.endsWith('.md') && file.indexOf('README') == -1) {
                list.push(file);
            }
        }
        if (is_sort) {
            list.sort(cmpMarkDown)
        }
    }
    return list;
}

// 裁剪到文本左侧的特殊字符
function trimRight(string) {
    var str = new String();
    if (typeof string == "string") {
        str = string
        var filter = new String(' \t\r\n');
        if (filter.indexOf(str.charAt(str.length - 1) != -1)) {
            var i = str.length - 1;
            while (i >= 0 && filter.indexOf(str.charAt(i)) != -1) {
                i--;
            }
            str = str.substring(0, i + 1);
        }
        return str;
    }
    return undefined;
}

var genSidebar = {
    // 生成侧边栏
    genDefaultSidebar: function (path, name, is_sort, depth) {
        var result = new Array();
        var object = new Object();
        if (typeof path == "string" && typeof name == "string") {
            let target_path = rpath.resolve(DOCS_PATH, path);
            if (typeof depth != "number") {
                depth = 2;
            }
            object.title = name;
            object.collapsable = false;
            object.sidebarDepth = depth;
            object.children = new Array();

            let md_list = getMarkDownList(target_path, is_sort);
            for (let i = 0; i < md_list.length; i++) {
                let md = md_list[i];
                let ls = md.split('.');
                let iter = new Object();
                if (ls.length > 2) {
                    iter.title = ls[1];
                    iter.path = ls[0] + '.' + ls[1];
                } else {
                    iter.title = ls[0];
                    iter.path = ls[0];
                }
                object.children.push(iter);
            }
        }
        result.push(object);
        return result;
    }
}

module.exports = genSidebar;
```

预览效果如下：

![](https://gitee.com/zysspace/mq-demo/raw/master/image/202301301640534.png)

### 部署

部署到 GitHub Pages

1、在`docs/.vuepress/config.js` 中设置正确的 `base`。

如果打算发布到 `https://<USERNAME>.github.io/`，则可以省略这一步，因为 `base` 默认即是 `"/"`。

如果打算发布到 `https://<USERNAME>.github.io/<REPO>/`（也就是说你的仓库在 `https://github.com/<USERNAME>/<REPO>`），则将 `base` 设置为 `"/<REPO>/"`。

2、在GitHub上建立仓库，并建立分支gh-pages

3、发布

```
# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist
git add .
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
```

