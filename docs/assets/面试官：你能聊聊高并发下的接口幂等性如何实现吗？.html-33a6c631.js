const e=JSON.parse('{"key":"v-4a67cf62","path":"/%E9%9D%A2%E8%AF%95/%E9%9D%A2%E8%AF%95%E5%AE%98%EF%BC%9A%E4%BD%A0%E8%83%BD%E8%81%8A%E8%81%8A%E9%AB%98%E5%B9%B6%E5%8F%91%E4%B8%8B%E7%9A%84%E6%8E%A5%E5%8F%A3%E5%B9%82%E7%AD%89%E6%80%A7%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E5%90%97%EF%BC%9F.html","title":"面试官：你能聊聊高并发下的接口幂等性如何实现吗？","lang":"zh-CN","frontmatter":{"title":"面试官：你能聊聊高并发下的接口幂等性如何实现吗？","author":"程序员子龙","index":true,"icon":"discover","category":["面试"],"description":"什么是幂等性？ 幂等是一个数学与计算机学概念，在数学中某一元运算为幂等时，其作用在任一元素两次后会和其作用一次的结果相同。\\r “ 在计算机中编程中，一个幂等操作的特点是其任意多次执行所产生的影响均与一次执行的影响相同。 幂等函数或幂等方法是指可以使用相同参数重复执行，并能获得相同结果的函数。这些函数不会影响系统状态，也不用担心重复执行会对系统造成改变。...","head":[["meta",{"property":"og:url","content":"https://zilong-tech.github.io/docs/docs/%E9%9D%A2%E8%AF%95/%E9%9D%A2%E8%AF%95%E5%AE%98%EF%BC%9A%E4%BD%A0%E8%83%BD%E8%81%8A%E8%81%8A%E9%AB%98%E5%B9%B6%E5%8F%91%E4%B8%8B%E7%9A%84%E6%8E%A5%E5%8F%A3%E5%B9%82%E7%AD%89%E6%80%A7%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E5%90%97%EF%BC%9F.html"}],["meta",{"property":"og:site_name","content":"子龙技术"}],["meta",{"property":"og:title","content":"面试官：你能聊聊高并发下的接口幂等性如何实现吗？"}],["meta",{"property":"og:description","content":"什么是幂等性？ 幂等是一个数学与计算机学概念，在数学中某一元运算为幂等时，其作用在任一元素两次后会和其作用一次的结果相同。\\r “ 在计算机中编程中，一个幂等操作的特点是其任意多次执行所产生的影响均与一次执行的影响相同。 幂等函数或幂等方法是指可以使用相同参数重复执行，并能获得相同结果的函数。这些函数不会影响系统状态，也不用担心重复执行会对系统造成改变。..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-02-15T03:36:38.000Z"}],["meta",{"property":"article:author","content":"程序员子龙"}],["meta",{"property":"article:modified_time","content":"2023-02-15T03:36:38.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"面试官：你能聊聊高并发下的接口幂等性如何实现吗？\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-02-15T03:36:38.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"程序员子龙\\"}]}"]]},"headers":[{"level":3,"title":"什么是幂等性？","slug":"什么是幂等性","link":"#什么是幂等性","children":[]},{"level":3,"title":"什么是接口幂等性？","slug":"什么是接口幂等性","link":"#什么是接口幂等性","children":[]},{"level":3,"title":"为什么接口需要幂等性","slug":"为什么接口需要幂等性","link":"#为什么接口需要幂等性","children":[]},{"level":3,"title":"引入幂等性后对系统有什么影响？","slug":"引入幂等性后对系统有什么影响","link":"#引入幂等性后对系统有什么影响","children":[]},{"level":3,"title":"接口超时了，到底如何处理","slug":"接口超时了-到底如何处理","link":"#接口超时了-到底如何处理","children":[]},{"level":3,"title":"设计方案","slug":"设计方案","link":"#设计方案","children":[]},{"level":3,"title":"解决方案","slug":"解决方案","link":"#解决方案","children":[]},{"level":3,"title":"总结","slug":"总结","link":"#总结","children":[]}],"git":{"createdTime":1676432198000,"updatedTime":1676432198000,"contributors":[{"name":"javacode","email":"zysspace@163.com","commits":1}]},"readingTime":{"minutes":18.68,"words":5605},"filePathRelative":"面试/面试官：你能聊聊高并发下的接口幂等性如何实现吗？.md","localizedDate":"2023年2月15日","autoDesc":true}');export{e as data};
