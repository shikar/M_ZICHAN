```js
  /**
   * menu 的 json 数据结构说明(相关json: menu.json, fav.json, searchResult.json)
   * id    : 用于识别菜单内容
   * icon  : 菜单的图片(只有二级以后有用)
   * name  : 菜单名称
   * count : 菜单的计数统计
   * list  : 子菜单
   * url   : 链接(只有二级以后有用)
   * type  : 菜单的类别
   *       def    : 调用默认的 ajax 地址
   *       open   : 本页跳转
   *       blank  : 新开一个
   *       ajax   : 自定义的 ajax 地址
   *       iframe : 以 iframe 的方式打开
   */

  /**
   * thumbnail show json 的结构说明
   * info: 顶部的信息数据
   * menu: 右边的目录 4-5
   *   open: 默认打开的
   *   list: 目录数据
   * filter: 筛选数据
   * breadcrumb: 导航栏数据
   * sort: 排序数据
   * table: 表格数据
   *   info: 配置
   *     checkbox: 是否显示 checkbox
   *     keyword: 高亮字段
   *     listbtn: 记录按钮
   *     tablebtn: 列表按钮
   *   fields: 字段名
   *   lists: 数据列表
   * page: 分页数据
   */
```