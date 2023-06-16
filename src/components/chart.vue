<template>
  <div class="container">
    <dof-tab-page
      class="tab"
      type="primary"
      :is-slot="false"
      ref="dof-tab-page"
      :tab-titles="navTabTitles"
      @dofTabSelected="tabChangeHandler"
    ></dof-tab-page>
    <div class="maxminbox" v-if="dateType === 'WEEK'">
      <text class="maxmin">最高:{{ maxWeek || '— —' }}{{ unit }}</text>
      <text class="maxmin">最低:{{ minWeek || '— —' }}{{ unit }}</text>
    </div>
    <div class="maxminbox" v-if="dateType === 'MONTH'">
      <text class="maxmin">最高:{{ maxMonth || '— —' }}{{ unit }}</text>
      <text class="maxmin">最低:{{ minMonth || '— —' }}{{ unit }}</text>
    </div>
    <div class="maxminbox" v-if="dateType === 'YEAR'">
      <text class="maxmin">最高:{{ maxYear || '— —' }}{{ unit }}</text>
      <text class="maxmin">最低:{{ minYear || '— —' }}{{ unit }}</text>
    </div>
    <div>
      <div class="barchart-wrapper" v-if="dateType === 'WEEK' && isLoaded">
        <midea-linechart-view
          titleName="周表"
          class="line-chart"
          :data="chartData0"
        ></midea-linechart-view>
      </div>
    </div>
    <div>
      <div class="barchart-wrapper" v-if="dateType === 'YEAR' && isLoaded">
        <midea-linechart-view
          titleName="年表"
          class="line-chart"
          :data="chartData2"
        ></midea-linechart-view>
      </div>
    </div>
    <div>
      <div class="barchart-wrapper" v-if="dateType === 'MONTH' && isLoaded">
        <midea-linechart-view
          titleName="月表"
          class="line-chart"
          :data="chartData1"
        ></midea-linechart-view>
      </div>
    </div>
    <text class="date_text">{{ dateRange }}</text>
  </div>
</template>
<script>
import { DofTabPage } from 'dolphin-weex-ui'
import { mapActions, mapGetters } from 'vuex'
import { reportDataset } from '../config/report'
import {
  getMonthDaysArray,
  getCurrentWeekRange,
  getCurrentMonthRange,
  getCurrentYearRange,
  arith,
} from '../util'
import debugUtil from '../util/debugUtil'
import { calculateStandardWeight } from '../util/algo'

export default {
  props: {
    theme: {
      type: String,
      default: 'weight',
    },
  },
  components: {
    DofTabPage,
  },
  data: () => ({
    reportDataset,
    dateType: 'WEEK',
    curMonthDays: 30,
    isLoaded: false,
    maxWeek: 0,
    minWeek: 0,
    maxMonth: 0,
    minMonth: 0,
    maxYear: 0,
    minYear: 0,
    chartData0: {
      x: {
        value: [1, 2, 3, 4, 5, 6, 7],
        label: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      y: [
        {
          value: [1, 6, 2, 1],
          lineTypeList: [0, 0, 0, 0, 0, 0, 0], //只支持折线，不支持曲线。对应点是实线还是虚线，0-实线，1-虚线（8.8）
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
          value: [10, 10, 10, 10, 10, 10, 10],
          lineTypeList: [1, 1, 1, 1, 1, 1, 1],
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
      background: '#ffffff', //不传，则默认使用透明背景

      xAxisLabelTextSize: 12, //x轴文字大小
      xAxisGridColor: '#C7C7CC', //x轴上分割线颜色
      xAxisGridAlpha: 0, //x轴上分割线透明度
      yAxisGridAlpha: 0.5,
      xAxisGridLine: false, //iOS上默认关闭 设置是否开启X轴分割线绘制
      yAxisGridLine: true,
      granularity: 1, //间距本身是自适应的，可以使用该值进行调整间距的比例，比如自适应间距是20px，granularity设置为2的时候，界面显示的间距为 40px
      xAxisYOffset: 20, //x轴与label的间距设置(6.0) 如果要显示X轴单位需要预留空间显示单位 仅iOS
      yAxisXOffset: 20, //x轴与label的间距设置(6.0) 如果要显示X轴单位需要预留空间显示单位 仅iOS
      yAxisLabelShow: true, //是否只显示最大最小值，true: 显示y轴值；false: 不显示y轴值；默认true

      signPost: {
        //底部滑杆界面  （5.12）
        lineHeight: 1, //线条的高度
        lineColor: '#8A8A8F', //标签线的颜色 如果不设置，则默认是黑色线
        linePointRadius: 3, //标签线上圆点的半径, 默认10
        lineMarginTop: '5', //线条距离X轴的距离
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
      isDraggingLimitw: true, //拖动时是不中有区域限制. 如与另外一条曲线的数值，差值不能接近1(8.7)
      minOffset: 0, //最小padding, 默认是15dp(8.7)
      extraTopOffset: 20, //顶部padding(8.7)
      extraLeftOffset: -10, //左边padding(8.7)
      extraRightOffset: 16, //右边padding(8.7)
      extraBottomOffset: 24, //底部padding(8.7)
      extraHeight: 0,
      rightDraggingMiniUnit: 0.3, //右侧y轴值拖动步长,默认为1（8.9）

      isShowOutsidePart: false, //是否显示超出坐标区域的部分（8.7.0）

      visibleXRangeMaximum: 7, //x轴最大可视数据数量。当数据数量>最大可视数据数量时且dragType为x可滚动时（为0或2时）才可以左右滚动 （8.15.0）
      scaleType: 1, //0-x,y都可以缩放，1-x,y都不可缩放，2-只有x可缩放，3-只有y可缩放。 默认是1（8.15.0）
      dragType: 0, //0-x,y都可以拖拽，1-x,y都不可拖拽，2-只有x可拖拽，3-只有y可拖拽. 默认是0（8.15.0）

      inverseSelect: false, //android专用。设置点击高亮是否反选。如果为true,高亮时点击则取消高亮，否则显示高亮。true-反选，false-不返选。默认效果是不反选(仅android 8.15.0，暂不公开)
    },
    chartData1: {
      x: {
        value: [1, 2, 3, 4, 5, 6, 7],
        label: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      y: [
        {
          value: [1, 6, 2, 1],
          lineTypeList: [0, 0, 0, 0, 0, 0, 0], //只支持折线，不支持曲线。对应点是实线还是虚线，0-实线，1-虚线（8.8）
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
          value: [
            10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
            10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
          ],
          lineTypeList: [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1,
          ],
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
      background: '#ffffff', //不传，则默认使用透明背景

      xAxisLabelTextSize: 12, //x轴文字大小
      xAxisGridColor: '#C7C7CC', //x轴上分割线颜色
      xAxisGridAlpha: 0, //x轴上分割线透明度
      yAxisGridAlpha: 0.5,
      xAxisGridLine: false, //iOS上默认关闭 设置是否开启X轴分割线绘制
      yAxisGridLine: true,
      granularity: 1, //间距本身是自适应的，可以使用该值进行调整间距的比例，比如自适应间距是20px，granularity设置为2的时候，界面显示的间距为 40px
      xAxisYOffset: 20, //x轴与label的间距设置(6.0) 如果要显示X轴单位需要预留空间显示单位 仅iOS
      yAxisXOffset: 20, //x轴与label的间距设置(6.0) 如果要显示X轴单位需要预留空间显示单位 仅iOS
      yAxisLabelShow: true, //是否只显示最大最小值，true: 显示y轴值；false: 不显示y轴值；默认true

      signPost: {
        //底部滑杆界面  （5.12）
        lineHeight: 1, //线条的高度
        lineColor: '#8A8A8F', //标签线的颜色 如果不设置，则默认是黑色线
        linePointRadius: 3, //标签线上圆点的半径, 默认10
        lineMarginTop: '5', //线条距离X轴的距离
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
      isDraggingLimitw: true, //拖动时是不中有区域限制. 如与另外一条曲线的数值，差值不能接近1(8.7)
      minOffset: 0, //最小padding, 默认是15dp(8.7)
      extraTopOffset: 20, //顶部padding(8.7)
      extraLeftOffset: -10, //左边padding(8.7)
      extraRightOffset: 16, //右边padding(8.7)
      extraBottomOffset: 24, //底部padding(8.7)
      extraHeight: 0,
      rightDraggingMiniUnit: 0.3, //右侧y轴值拖动步长,默认为1（8.9）

      isShowOutsidePart: false, //是否显示超出坐标区域的部分（8.7.0）

      visibleXRangeMaximum: 7, //x轴最大可视数据数量。当数据数量>最大可视数据数量时且dragType为x可滚动时（为0或2时）才可以左右滚动 （8.15.0）
      scaleType: 1, //0-x,y都可以缩放，1-x,y都不可缩放，2-只有x可缩放，3-只有y可缩放。 默认是1（8.15.0）
      dragType: 0, //0-x,y都可以拖拽，1-x,y都不可拖拽，2-只有x可拖拽，3-只有y可拖拽. 默认是0（8.15.0）

      inverseSelect: false, //android专用。设置点击高亮是否反选。如果为true,高亮时点击则取消高亮，否则显示高亮。true-反选，false-不返选。默认效果是不反选(仅android 8.15.0，暂不公开)
    },
    chartData2: {
      x: {
        value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        label: [
          '一月',
          '二月',
          '三月',
          '四月',
          '五月',
          '六月',
          '七月',
          '八月',
          '九月',
          '十月',
          '十一月',
          '十二月',
        ],
      },
      y: [
        {
          value: [1, 6, 2, 1],
          lineTypeList: [0, 0, 0, 0, 0, 0, 0], //只支持折线，不支持曲线。对应点是实线还是虚线，0-实线，1-虚线（8.8）
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
          value: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
          lineTypeList: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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
      background: '#ffffff', //不传，则默认使用透明背景

      xAxisLabelTextSize: 12, //x轴文字大小
      xAxisGridColor: '#C7C7CC', //x轴上分割线颜色
      xAxisGridAlpha: 0, //x轴上分割线透明度
      yAxisGridAlpha: 0.5,
      xAxisGridLine: false, //iOS上默认关闭 设置是否开启X轴分割线绘制
      yAxisGridLine: true,
      granularity: 1, //间距本身是自适应的，可以使用该值进行调整间距的比例，比如自适应间距是20px，granularity设置为2的时候，界面显示的间距为 40px
      xAxisYOffset: 20, //x轴与label的间距设置(6.0) 如果要显示X轴单位需要预留空间显示单位 仅iOS
      yAxisXOffset: 20, //x轴与label的间距设置(6.0) 如果要显示X轴单位需要预留空间显示单位 仅iOS
      yAxisLabelShow: true, //是否只显示最大最小值，true: 显示y轴值；false: 不显示y轴值；默认true

      signPost: {
        //底部滑杆界面  （5.12）
        lineHeight: 1, //线条的高度
        lineColor: '#8A8A8F', //标签线的颜色 如果不设置，则默认是黑色线
        linePointRadius: 3, //标签线上圆点的半径, 默认10
        lineMarginTop: '5', //线条距离X轴的距离
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
      isDraggingLimitw: true, //拖动时是不中有区域限制. 如与另外一条曲线的数值，差值不能接近1(8.7)
      minOffset: 0, //最小padding, 默认是15dp(8.7)
      extraTopOffset: 20, //顶部padding(8.7)
      extraLeftOffset: -10, //左边padding(8.7)
      extraRightOffset: 16, //右边padding(8.7)
      extraBottomOffset: 24, //底部padding(8.7)
      extraHeight: 0,
      rightDraggingMiniUnit: 0.3, //右侧y轴值拖动步长,默认为1（8.9）

      isShowOutsidePart: false, //是否显示超出坐标区域的部分（8.7.0）

      visibleXRangeMaximum: 7, //x轴最大可视数据数量。当数据数量>最大可视数据数量时且dragType为x可滚动时（为0或2时）才可以左右滚动 （8.15.0）
      scaleType: 1, //0-x,y都可以缩放，1-x,y都不可缩放，2-只有x可缩放，3-只有y可缩放。 默认是1（8.15.0）
      dragType: 0, //0-x,y都可以拖拽，1-x,y都不可拖拽，2-只有x可拖拽，3-只有y可拖拽. 默认是0（8.15.0）

      inverseSelect: false, //android专用。设置点击高亮是否反选。如果为true,高亮时点击则取消高亮，否则显示高亮。true-反选，false-不返选。默认效果是不反选(仅android 8.15.0，暂不公开)
    },
    navTabTitles: [
      {
        title: '周',
      },
      {
        title: '月',
      },
      {
        title: '年',
      },
    ],
    unit: '',
  }),
  async created() {
    this.calData()
  },
  mounted() {},
  computed: {
    ...mapGetters(['newestRecord', 'curMemberDetail', 'curAdmin']),
    dateRange() {
      let res
      if (this.dateType === 'WEEK') {
        res = getCurrentWeekRange()
      } else if (this.dateType === 'MONTH') {
        res = getCurrentMonthRange()
      } else {
        res = getCurrentYearRange()
      }
      return `${res[0]}-${res[1]}`
    },
  },
  watch: {
    theme() {
      this.isLoaded = false
      this.calData()
    },
  },
  methods: {
    ...mapActions(['getBaseInfo', 'queryScaleWeightByTimes']),
    async calData() {
      const now = new Date() // 获取当前日期
      const year = now.getFullYear() // 获取年份
      const month = now.getMonth() + 1 // 获取月份（注意：月份是从0开始计数的，所以需要加1）
      const reportItem = this.reportDataset.find(
        item => item.key === this.theme
      )
      debugUtil.log('要查的数据项', reportItem)
      this.curMonthDays = getMonthDaysArray(year, month)
      this.chartData1.x.value = arith(this.curMonthDays)
      this.chartData1.x.label = arith(this.curMonthDays).map(
        item => item + '号'
      )
      await this.getBaseInfo()
      // 获取周数据
      const resWeek = await this.getData('WEEK')
      let weekData = resWeek.returnData.result.scaleWeightByTimesList
      const weekMaxWeight = resWeek.returnData.result.maxMinValue.weightMaxValue
      const weekMinWeight = resWeek.returnData.result.maxMinValue.weightMinValue
      const weekMaxImpedance =
        resWeek.returnData.result.maxMinValue.impedanceMaxValue
      const weekMinImpedance =
        resWeek.returnData.result.maxMinValue.impedanceMinValue
      let curWeekMaxValue = 0
      let curWeekMinValue = 0
      if (this.theme === 'weight') {
        curWeekMaxValue = weekMaxWeight
        curWeekMinValue = weekMinWeight
      } else {
        curWeekMaxValue = parseInt(
          reportItem.algo(
            this.curMemberDetail.birthday,
            this.curMemberDetail.height,
            weekMaxWeight,
            weekMaxImpedance,
            this.curMemberDetail.sex === '1' ? 'female' : 'male'
          )
        )
        curWeekMinValue = parseInt(
          reportItem.algo(
            this.curMemberDetail.birthday,
            this.curMemberDetail.height,
            weekMinWeight,
            weekMinImpedance,
            this.curMemberDetail.sex === '1' ? 'female' : 'male'
          )
        )
      }
      this.maxWeek = curWeekMaxValue > 0 ? curWeekMaxValue : 0
      this.minWeek = curWeekMinValue > 0 ? curWeekMinValue : 0
      debugUtil.log('最大值', this.maxWeek)
      debugUtil.log('最小值', this.minWeek)
      const dateStrOfWeek = getCurrentWeekRange()
      weekData = this.fillData(weekData, dateStrOfWeek[2], dateStrOfWeek[3])
      debugUtil.log('统计数据——周', weekData)
      const resMonth = await this.getData('MONTH')
      let monthData = resMonth.returnData.result.scaleWeightByTimesList
      const monthMaxWeight =
        resMonth.returnData.result.maxMinValue.weightMaxValue
      const monthMinWeight =
        resMonth.returnData.result.maxMinValue.weightMinValue
      const monthMaxImpedance =
        resMonth.returnData.result.maxMinValue.impedanceMaxValue
      const monthMinImpedance =
        resMonth.returnData.result.maxMinValue.impedanceMinValue
      let curMonthMaxValue = 0
      let curMonthMinValue = 0
      if (this.theme === 'weight') {
        curMonthMaxValue = monthMaxWeight
        curMonthMinValue = monthMinWeight
      } else {
        curMonthMaxValue = parseInt(
          reportItem.algo(
            this.curMemberDetail.birthday,
            this.curMemberDetail.height,
            monthMaxWeight,
            monthMaxImpedance,
            this.curMemberDetail.sex === '1' ? 'female' : 'male'
          )
        )
        curMonthMinValue = parseInt(
          reportItem.algo(
            this.curMemberDetail.birthday,
            this.curMemberDetail.height,
            monthMinWeight,
            monthMinImpedance,
            this.curMemberDetail.sex === '1' ? 'female' : 'male'
          )
        )
      }
      this.maxMonth = curMonthMaxValue > 0 ? curMonthMaxValue : 0
      this.minMonth = curMonthMinValue > 0 ? curMonthMinValue : 0
      const dateStrOfMonth = getCurrentMonthRange()
      monthData = this.fillData(monthData, dateStrOfMonth[2], dateStrOfMonth[3])
      debugUtil.log('统计数据——月', monthData)
      const resYear = await this.getData('YEAR')
      let yearData = resYear.returnData.result.scaleWeightByTimesList
      const yearMaxWeight = resYear.returnData.result.maxMinValue.weightMaxValue
      const yearMinWeight = resYear.returnData.result.maxMinValue.weightMinValue
      const yearMaxImpedance =
        resYear.returnData.result.maxMinValue.impedanceMaxValue
      const yearMinImpedance =
        resYear.returnData.result.maxMinValue.impedanceMinValue
      let curYearMaxValue = 0
      let curYearMinValue = 0
      if (this.theme === 'weight') {
        curYearMaxValue = yearMaxWeight
        curYearMinValue = yearMinWeight
      } else {
        curYearMaxValue = parseInt(
          reportItem.algo(
            this.curMemberDetail.birthday,
            this.curMemberDetail.height,
            yearMaxWeight,
            yearMaxImpedance,
            this.curMemberDetail.sex === '1' ? 'female' : 'male'
          )
        )
        curYearMinValue = parseInt(
          reportItem.algo(
            this.curMemberDetail.birthday,
            this.curMemberDetail.height,
            yearMinWeight,
            yearMinImpedance,
            this.curMemberDetail.sex === '1' ? 'female' : 'male'
          )
        )
      }
      this.maxYear = curYearMaxValue > 0 ? curYearMaxValue : 0
      this.minYear = curYearMinValue > 0 ? curYearMinValue : 0
      yearData = this.fillDataOfYear(yearData)
      debugUtil.log('统计数据——年', resYear)
      if (this.theme === 'weight') {
        this.chartData0.y[0].value = weekData.map(item =>
          item.weight ? item.weight : 0
        )
        this.chartData1.y[0].value = monthData.map(item =>
          item.weight ? item.weight : 0
        )
        this.chartData2.y[0].value = yearData.map(item =>
          item.weight ? item.weight : 0
        )
      } else {
        this.chartData0.y[0].value = weekData.map(item => {
          if (item.weight) {
            let curValue = reportItem.algo(
              this.curMemberDetail.birthday,
              this.curMemberDetail.height,
              item.weight,
              item.impedance,
              this.curMemberDetail.sex === '1' ? 'female' : 'male'
            )
            if (this.theme === 'bone') {
              curValue = ((curValue / item.weight) * 100).toFixed(2)
            }
            return parseInt(curValue) > 0 ? parseInt(curValue) : 0
          } else {
            return 0
          }
        })
        this.chartData1.y[0].value = monthData.map(item => {
          if (item.weight) {
            let curValue = reportItem.algo(
              this.curMemberDetail.birthday,
              this.curMemberDetail.height,
              item.weight,
              item.impedance,
              this.curMemberDetail.sex === '1' ? 'female' : 'male'
            )

            if (this.theme === 'bone') {
              curValue = ((curValue / item.weight) * 100).toFixed(2)
            }
            return parseInt(curValue) > 0 ? parseInt(curValue) : 0
          } else {
            return 0
          }
        })
        this.chartData2.y[0].value = yearData.map(item => {
          if (item.weight) {
            let curValue = reportItem.algo(
              this.curMemberDetail.birthday,
              this.curMemberDetail.height,
              item.weight,
              item.impedance,
              this.curMemberDetail.sex === '1' ? 'female' : 'male'
            )

            if (this.theme === 'bone') {
              curValue = ((curValue / item.weight) * 100).toFixed(2)
            }
            return parseInt(curValue) > 0 ? parseInt(curValue) : 0
          } else {
            return 0
          }
        })
      }

      this.maxWeek = Math.max(
        ...this.chartData0.y[0].value.filter(item => item !== 0)
      )
      this.minWeek = Math.min(
        ...this.chartData0.y[0].value.filter(item => item !== 0)
      )
      this.maxMonth = Math.max(
        ...this.chartData1.y[0].value.filter(item => item !== 0)
      )
      this.minMonth = Math.min(
        ...this.chartData1.y[0].value.filter(item => item !== 0)
      )
      this.maxYear = Math.max(
        ...this.chartData2.y[0].value.filter(item => item !== 0)
      )
      this.minYear = Math.min(
        ...this.chartData2.y[0].value.filter(item => item !== 0)
      )
      if (!isFinite(this.maxWeek)) this.maxWeek = 0
      if (!isFinite(this.maxMonth)) this.maxMonth = 0
      if (!isFinite(this.maxYear)) this.maxYear = 0
      if (!isFinite(this.minWeek)) this.minWeek = 0
      if (!isFinite(this.minMonth)) this.minMonth = 0
      if (!isFinite(this.minYear)) this.minYear = 0
      debugUtil.log('更改后的图表数据')
      debugUtil.log(this.chartData0.y[0])
      debugUtil.log(this.chartData1.y[0])
      debugUtil.log(this.chartData2.y[0])

      if (this.theme === 'bone') {
        this.chartData0.yAxisLabelCount = this.maxWeek + 2
        this.chartData0.yAxisMaximum = this.maxWeek + 1
        this.chartData1.yAxisLabelCount = this.maxMonth + 2
        this.chartData1.yAxisMaximum = this.maxMonth + 1
        this.chartData2.yAxisLabelCount = this.maxYear + 2
        this.chartData2.yAxisMaximum = this.maxYear + 1
      } else {
        delete this.chartData0.yAxisLabelCount
        delete this.chartData0.yAxisMaximum
        delete this.chartData1.yAxisLabelCount
        delete this.chartData1.yAxisMaximum
        delete this.chartData2.yAxisLabelCount
        delete this.chartData2.yAxisMaximum
      }

      // 赋值单位
      if (this.theme === 'weight') {
        this.chartData0.marker.markerGraduationLabel = 'kg'
        this.chartData1.marker.markerGraduationLabel = 'kg'
        this.chartData2.marker.markerGraduationLabel = 'kg'
        this.unit = 'kg'
      } else {
        this.chartData0.marker.markerGraduationLabel = reportItem.unit
        this.chartData1.marker.markerGraduationLabel = reportItem.unit
        this.chartData2.marker.markerGraduationLabel = reportItem.unit
        this.unit = reportItem.unit
      }
      // 赋值目标
      let best = 0
      let bestWeight = 0
      if (this.curMemberDetail.targetWeight) {
        bestWeight = this.curMemberDetail.targetWeight
      } else {
        const standard = calculateStandardWeight(this.curMemberDetail.height)
        bestWeight = (
          (standard.standardWeightMax - standard.standardWeightMin) / 2 +
          standard.standardWeightMin
        ).toFixed(0)
      }
      if (this.theme === 'weight') {
        best = bestWeight
      } else {
        best = parseInt(
          reportItem.algo(
            this.curMemberDetail.birthday,
            this.curMemberDetail.height,
            bestWeight,
            this.newestRecord.impedance,
            this.curMemberDetail.sex === '1' ? 'female' : 'male'
          )
        )
        if (this.theme === 'bone') {
          best = ((best / bestWeight) * 100).toFixed(2)
        }
      }
      debugUtil.log('计算出的目标', best)
      this.chartData0.y[1].value = Array.from({ length: 7 }, () => best)
      this.chartData1.y[1].value = Array.from(
        { length: this.curMonthDays },
        () => best
      )
      this.chartData2.y[1].value = Array.from({ length: 12 }, () => best)
      this.isLoaded = true
    },
    async getData(type) {
      const res = await this.queryScaleWeightByTimes(type)
      if (res.isSuccess) {
        return res
      }
    },
    fillData(data, start, end) {
      // 要填充的日期范围
      debugUtil.log('源数据', data)
      debugUtil.log('填充参数', start, end)
      const startDate = new Date(start)
      const endDate = new Date(end)

      // 填充并排序
      const result = []
      let currentDate = startDate
      for (
        currentDate;
        currentDate <= endDate;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        const isoString = this.formatDateToISO(currentDate)
        const currentDateString = isoString.substring(0, 10)
        const existingData = data.find(d => d.time === currentDateString)
        if (existingData) {
          result.push(existingData)
        } else {
          result.push({
            weight: null,
            impedance: null,
            time: currentDateString,
          })
        }
      }
      result.sort((a, b) => new Date(a.time) - new Date(b.time))
      debugUtil.log('填充结果', result)
      // 输出结果
      return result
    },
    formatDateToISO(date) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    fillDataOfYear(data) {
      const header = data[0].time.substring(0, 5)
      const startDate = 1
      const endDate = 12

      // 填充并排序
      const result = []
      let currentDate = startDate
      for (currentDate; currentDate <= endDate; currentDate++) {
        const currentDateString =
          header + currentDate.toString().padStart(2, '0')
        const existingData = data.find(d => d.time === currentDateString)
        if (existingData) {
          result.push(existingData)
        } else {
          result.push({
            weight: null,
            impedance: null,
            time: currentDateString,
          })
        }
      }
      result.sort((a, b) => new Date(a.time + '-01') - new Date(b.time + '-01'))
      debugUtil.log('填充结果', result)
      // 输出结果
      return result
    },
    async tabChangeHandler(e) {
      if (e.index === 0) {
        this.dateType = 'WEEK'
      } else if (e.index === 1) {
        this.dateType = 'MONTH'
      } else {
        this.dateType = 'YEAR'
      }
    },
  },
}
</script>

<style scoped>
.container {
  align-items: center;
  padding: 32px;
}

.tab {
  width: 686px;
}

.barchart-wrapper {
  flex-direction: row;
  justify-content: center;
  margin-top: 50px;
  width: 636px;
  height: 600px;
  background-color: #ffffff;
  box-sizing: border-box;
}

.line-chart {
  width: 626px;
  height: 600px;
}

.date_text {
  font-size: 24px;
  color: #666666;
  letter-spacing: 0;
  line-height: 24px;
  font-weight: 400;
  margin-top: 16px;
}

.maxminbox {
  margin-top: 32px;
  width: 626px;
  height: 60px;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 48px;
  padding-right: 48px;
  padding-top: 14px;
  padding-bottom: 14px;
  background-color: rgba(242, 242, 242, 0.42);
  border-radius: 14px;
}

.maxmin {
  height: 34px;
  font-size: 24px;
  color: #666666;
  letter-spacing: 0;
  font-weight: 400;
}

.tip {
  font-size: 26px;
  color: #666666;
  font-weight: 400;
  margin-top: 36px;
}
</style>
