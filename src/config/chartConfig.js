const chartConfig = {
  x: {
    value: [],
    label: [],
  },
  y: [
    {
      value: [],
      lineTypeList: [], //只支持折线，不支持曲线。对应点是实线还是虚线，0-实线，1-虚线（8.8）
      title: '记录',
      color: '#3F89FF', //折线颜色
      starcolor: '#ffffff', //区域背景渐变开始颜色（从下自上）
      endcolor: '#3F89FF', //区域背景渐变结束颜色（从下自上）
      smooth: 1, //0直线，1平滑
      lineSidesPointAble: false, //首尾可以设置是否有端点,默认false
      lineSidesPointRadius: 4, //端点大小，端点的半径值大小，lineSidesPointAble为ture有效
      lineSidesPointColor: '#000000', //端点颜色，lineSidesPointAble为ture有效
      lineDashAble: false, //曲线的类型可调: 是否使用虚线，默认false
      lineWidth: 2, //折线曲线线宽  默认为1 ，最大不能超过10，5.12 增加
      labelSize: 9, //折线或者曲线上文字颜色
      labelColor: '#000000', //折线或者曲线上文字大小

      isDrawCircles: true, //是否绘制圆圈  （5.12）
      isDrawCircleHole: true, //是否绘制圆内  （5.12）
      circleRadius: 5, //圆圈半径  （5.12）
      circleHoleRadius: 3, //圆内半径  （5.12）
      circleHoleColor: '#3a7df6', //圆圈颜色  （5.12）
      circleColor: '#ffffff', //圆内颜色  （5.12）
      drawCircleShadowEnable: false, //是否圈内带阴影，默认为false，使用lineIcon图片来显示阴影（8.7）

      //高亮线
      highLightColor: '#3a7df6', //高亮线的颜色（8.7）
      highLightLineWidth: 2, //高亮线的线宽（8.7）
      maxHighLightColor: '#3a7df6', //（8.7）
      highLightEnable: true, //是否显示高亮线（8.7）
      highLineDashAble: true, //true-虚线，false-实线，默认是为false（8.7）
      isVerticalHighlightIndicatorEnabled: true, //垂直高亮线是否显示，默认不显示（8.7）
      isHorizontalHighlightIndicatorEnabled: false, //水平设计线是否显示，默认不显示（8.7）

      //点中高亮的设置
      isDrawHighLightCircles: true, //是否启动 点击高亮 （5.12）
      highLightCircleRadius: 8, // 高亮的圆圈半径设置（5.12）
      highLightCircleHoleRadius: 6, // 高亮的圆内半径设置（5.12）
      highLightCircleOutsideWidth: 2, // 高亮的圆外宽度设置（5.12）
      highLightCircleColor: '#3a7df6', // 高亮的圆圈颜色（5.12）
      highLightCircleHoleColor: '#ffffff', // 高亮的圆内颜色（5.12）
      highLightCircleOutsideColor: '#3a7df6', // 高亮的圆外颜色设置（5.12）
      axisDependency: 'left', //依赖的坐标轴。默认对齐left , 设置right 才会生效变化

      colorList: ['#3a7df6'], //指定每个线段的颜色(8.11)
      completeLineColor: '#3a7df6', //已进行线段颜色(8.11)
      completePointBgColor: '#3a7df6', //已进行节点背景颜色(8.11)
      completePointTextColor: '#3a7df6', //已进行节点文字颜色(8.11)
      notCompleteLineColor: '#3a7df6', //未进行线段颜色(8.11)
      notCompletePointBgColor: '#3a7df6', //未进行节点背景颜色(8.11)
      notCompletePointTextColor: '#3a7df6', //未进行节点文字颜色(8.11)
      dragableList: [0, 1, 0], //拖拽标志列表，0-不可拖拽，1-可拖拽(8.11)
      splitXValue: 1.5, //分割点的x坐标(8.11,只支持折线图。8.13.1支持曲线图)
    },
    {
      value: [],
      lineTypeList: [],
      title: '目标',
      color: '#FF8225', //折线颜色
      lineDashAble: true,
      highLightEnable: 0,
      lineWidth: 2, //折线曲线线宽  默认为1 ，最大不能超过10，5.12 增加
      starcolor: '', //区域背景渐变开始颜色（从下自上）
      endcolor: '', //区域背景渐变结束颜色（从下自上）
      smooth: 1, //0直线，1平滑
    },
  ],
  xAxisColor: '#C7C7CC', //x轴线的颜色，如果不设置，则默认是黑色线
  isUnEquelDistance: true, //iOS6.2新增不等距属性，默认打开（iOS专用）false关闭
  xAxisLabelColor: '#C7C7CC', //x label的字体颜色，如果不设置，则默认是黑色字体颜色
  yAxisColor: '#ffffff', //y轴线的颜色，如果不设置，则默认是黑色线
  yAxisLabelColor: '#C7C7CC', // label的字体颜色，如果不设置，则默认是黑色字体颜色

  xAxisLabelTextSize: 10, //x轴文字大小
  xAxisGridColor: '#C7C7CC', //x轴上分割线颜色
  xAxisGridAlpha: 0, //x轴上分割线透明度
  yAxisGridAlpha: 0.5,
  xAxisGridLine: false, //iOS上默认关闭 设置是否开启X轴分割线绘制
  yAxisGridLine: true,
  granularity: 1.2, //间距本身是自适应的，可以使用该值进行调整间距的比例，比如自适应间距是20px，granularity设置为2的时候，界面显示的间距为 40px
  xAxisYOffset: 20, //x轴与label的间距设置(6.0) 如果要显示X轴单位需要预留空间显示单位 仅iOS
  yAxisXOffset: 20, //x轴与label的间距设置(6.0) 如果要显示X轴单位需要预留空间显示单位 仅iOS
  yAxisLabelShow: true, //是否只显示最大最小值，true: 显示y轴值；false: 不显示y轴值；默认true

  signPost: {
    //底部滑杆界面  （5.12）
    lineHeight: 1, //线条的高度
    lineColor: '#8A8A8F', //标签线的颜色 如果不设置，则默认是黑色线
    linePointRadius: 3, //标签线上圆点的半径, 默认10
    lineMarginTop: 15, //线条距离X轴的距离
    lineMarginBottom: '0',
    cursorColor: '#267AFF', //标签（三角形）的颜色 如果不设置，则默认是黑色线
    cursorMarginTop: '5', //标签（三角形）距离线条的距离
    cursorHigh: '15', //标签（三角形）本身高度
    cursorMarginBottom: '0',
    show: false, //默认是 false 是否显示底部界面
    showType: 'all', //端点的显示样式，支持 all,ends,none 三种模式
    isSelectedDisappear: true, //是否标签 滑动到的端点消失不见
    isSelectedShake: true, //选择后是否支持震动，默认不支持，因为震动体验问题，该功能仅ios支持 （5.10）
    isInterceptTouch: true, //滑动是否拦截手势,android仅有（6.7）
  },
  description: '',
  legend: {
    position: 'TOP_LEFT', //"TOP_LEFT"/"TOP_RIGHT"
    orientation: 'HORIZONTAL', //"HORIZONTAL"/"BOTTOM_RIGHT"
    textColor: '#3a7df6', //图例文字颜色（8.7）
    textSize: 10, //图例文字大小（8.7）
    xOffset: 10, //图例水平间距（8.7）
    form: 'LINE', //图例类型NONE, EMPTY, SQUARE, CIRCLE, LINE（8.7）
    formSize: 10, //图例大小（8.7）
    formLineWidth: 6, //图例线宽大小（8.7）
    space: 6, //图例之间的间距（8.7）
  },
  legendHide: false, //是否需要隐藏legend，默认不隐藏
  unit: {
    x: '',
    y: '',
  },

  isShowYExtraInfo: false, //是否在y轴显示额外信息（8.8）
  yExtraInfoText: '', //y轴开始位置显示的文本（8.8）
  extraCircleColor: '#FF8225', //虚线对应的圆圈的颜色(8.8)
  extraLineSegColor: '#FF8225', //虚线对应线段颜色(8.8)

  marker: {
    markerShow: true, //默认为false,不显示maker
    markerColor: '#000000', //默认为黑色，marker的背景色，一定要六位
    markerTextColor: '#ffffff', //默认白色，marker字体字颜色
    markerTextSize: '12', //默认12
    markerCornerRadius: '6', //圆角
    markerGraduationLabel: '', //显示单位 默认为空""
    markerOffsetY: 15, //垂直间距设置
    markerType: 0, //0：显示单个y轴数据，1：显示双y轴数据（8.7）
    markerMarginX: 10, //marker距离选择点的右边距离，默认是10像素（8.7）
    shadowColor: '#267AFF', //阴影颜色（8.7 android）
    blur: 15, //阴影程度大小（8.7,android）
    offsetY: 1, //垂直方向阴影大小	（8.7,android）
    offsetX: 0, //水平方向阴影大小（8.7,android）
    markermaximumFractionDigits: '1',

    // extraInfo: {
    //   //额外信息(8.8)
    //   value: [20, 30, 40, 50, 30, 10, 30, 60], //与Y值对应的额外信息(8.8)
    //   graduationLabel: '升', //单位(8.8)
    //   title: '预计用水', //标题(8.8)
    // },
  },
  isDraggingLimit: true, //拖动时是不中有区域限制. 如与另外一条曲线的数值，差值不能接近1(8.7)
  yRightAxisEnable: false,
  minOffset: 0, //最小padding, 默认是15dp(8.7)
  extraTopOffset: 20, //顶部padding(8.7)
  extraLeftOffset: -10, //左边padding(8.7)
  extraRightOffset: 16, //右边padding(8.7)
  extraBottomOffset: 24, //底部padding(8.7)
  extraHeight: 0,
  rightDraggingMiniUnit: 0.3, //右侧y轴值拖动步长,默认为1（8.9）

  isShowOutsidePart: false, //是否显示超出坐标区域的部分（8.7.0）

  visibleXRangeMaximum: 0, //x轴最大可视数据数量。当数据数量>最大可视数据数量时且dragType为x可滚动时（为0或2时）才可以左右滚动 （8.15.0）
  scaleType: 1, //0-x,y都可以缩放，1-x,y都不可缩放，2-只有x可缩放，3-只有y可缩放。 默认是1（8.15.0）
  dragType: 1, //0-x,y都可以拖拽，1-x,y都不可拖拽，2-只有x可拖拽，3-只有y可拖拽. 默认是0（8.15.0）

  inverseSelect: false, //android专用。设置点击高亮是否反选。如果为true,高亮时点击则取消高亮，否则显示高亮。true-反选，false-不返选。默认效果是不反选(仅android 8.15.0，暂不公开)
}

export default chartConfig
