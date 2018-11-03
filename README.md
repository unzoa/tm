# tm

## 主页

- cover
    + cover-con
    +   => 高度固定200px, 那么图片就违法宽度适应
    +   => image height: 200px; 宽度计算就好了 
    +   => => 当图片的宽度小于此时容器的宽高比得到的宽度时，需要让宽度适应，高度撑开
        *   首先得到容器的宽高比 ratioCon
        *   记录图片的宽高比 ratioImg
        *   if (ratioImg >= ratioCon) { // 图片的宽度大，正常记录宽度即可 }
        *   else { // img 宽度小，则宽度撑开，重新计算高度 }

- 日期menu
    + 对应的列表需要滑动 
    +   => swiper配合
    + 滑动到顶部时候，需要固定到顶部 
    +   => 监听page的scrollTop给定menu的class定位和swiperpadding-top
    + 切换显示
    +   => swiper的滑动监听事件

- swiper高度的限制
    + 根据列表的元素高度 * 元素的个数给定 swiper-item的高度