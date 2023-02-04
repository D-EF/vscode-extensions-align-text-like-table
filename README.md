# align-text-like-table README
编写这个插件的动机是用于在编辑有很多表达式的矩阵后让它对齐，另外一个动机是为了将jsdoc的注释对齐。

## 使用方式
默认设置分隔符为 "(?: {5,})|(?:\t\t+)"    它在代码中会被当成的正则表达式。

如此只需要在想要分开的地方连按两下tab键，然后运行命令 "align like table"，即可方便地使用对齐功能。   

## 注意
* 自定义分隔符时一定要避免正则表达式捕获组的产生，不然会出现意料外的结果
* 本插件采用空格作为对齐时的填充物；所以需要对齐后依然希望使用制表位的话不建议使用这个插件。   

## 效果
对齐前
``` javascript
/**
 * @typedef Arc
 * @property {Vector}       c     圆心坐标
 * @property {float}        r      圆半径
 * @property {float}        theta_a        弧线端点 a 弧度 渲染时作为绘制起点
 * @property {float}        theta_b        弧线端点 b 弧度 渲染时作为绘制终点
 * @property {{min:Vector,max:Vector}|null}     [_aabb]     aabb轴对齐包围盒        缓存属性
 * @property {Polygon|null}     polygon__proxy_arc     使用圆弧上的采样点生成的多边形拟合        缓存属性
 */
```

对齐后
``` javascript
/**
 * @typedef Arc
 * @property {Vector}                           c                      圆心坐标
 * @property {float}                            r                      圆半径
 * @property {float}                            theta_a                弧线端点 a 弧度 渲染时作为绘制起点
 * @property {float}                            theta_b                弧线端点 b 弧度 渲染时作为绘制终点
 * @property {{min:Vector,max:Vector}|null}     [_aabb]                aabb轴对齐包围盒                       缓存属性
 * @property {Polygon|null}                     polygon__proxy_arc     使用圆弧上的采样点生成的多边形拟合     缓存属性
 */
```