import { getDirname, path } from "@vuepress/utils";
import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar/navbar.js";
import sidebar from "./sidebar/index.js";
import {PageFrontmatter} from "@vuepress/core";

const __dirname = getDirname(import.meta.url);


export default hopeTheme({
  hostname: "http://xxfxpt.top",
  logo: "/logo.png",
  favicon: "/favicon.ico",

  iconAssets: "//at.alicdn.com/t/c/font_2922463_kweia6fbo9.css",

  author: {
    name: "子龙",
    url: "http://xxfxpt.top",
  },

  repo: "https://gitee.com/zilong-tech",
  docsDir: "src",
  // 纯净模式：https://theme-hope.vuejs.press/zh/guide/interface/pure.html
  pure: true,
  breadcrumb: false,
  navbar,
  sidebar,
  footer:

  "<div>\n" +
  "\t<p> <span><img src=\"http://www.beian.gov.cn/img/ghs.png\"><a href=\"http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=21011102000332&amp\" style=\"display:inline-block;text-decoration:none;height:20px;line-height:20px;color: black;\" target=\"_blank\">辽公网安备 21011102000332号</a> &nbsp;&nbsp;&nbsp;&nbsp;</span><a href=\"http://beian.miit.gov.cn/\" style='color: black;' target=\"_blank\">辽ICP备2023001503号-1</a> </p>\n" +
  "\t</div>",
  displayFooter: true,

  pageInfo: [
    "Author",
    "Category",
    "Tag",
    // "Date",
    "Original",
    "Word",
    "ReadingTime",
  ],

  blog: {
    // intro: "/about-the-author/",
    sidebarDisplay: "mobile",
    medias: {
      Zhihu: "https://www.zhihu.com/people/bian-cheng-ji-zhu-zhi-nan",
      Github: "https://github.com/zilong-tech",
      Gitee: "https://gitee.com/zilong-tech",
    },
  },

  plugins: {
    blog: true,
    copyright: {
      author: "子龙(http://xxfxpt.top)",
      license: "MIT",
      triggerLength: 100,
      maxLength: 700,
      canonical: "http://xxfxpt.top/",
      global:true
    },
    mdEnhance: {
      align: true,
      codetabs: true,
      container: true,
      figure: true,
      include: {
        resolvePath: (file, cwd) => {
          if (file.startsWith("@"))
            return path.resolve(
              __dirname,
              "../snippets",
              file.replace("@", "./")
            );

          return path.resolve(cwd, file);
        },
      },
      tasklist: true,
    },
    feed: {
      atom: true,
      json: true,
      rss: true,
    },
    autoCatalog:false
  }


});
