import debugUtil from './debugUtil'

export const isObject = obj =>
  Object.prototype.toString.call(obj) === '[object Object]'

// 延时，不传参数时类似 this.$nextTick
export function delay(ms = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export function getParameterByName(name) {
  const url = this.$getConfig().bundleUrl
  name = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

// 取 weex 页面的文件名（不带后缀）
export const getPageName = () => {
  const pattern = /.*\/(.*).js/
  return weex.config.bundleUrl.match(pattern)[1]
}

/**
 * 简易diff，返回包含有变化的属性的对象
 * @param newObj Object 新的对象
 * @param oldObj Object 旧的对象
 * @return Object | Null 有变化的属性，如果没有变化返回null
 */
export function SimpleDiff(newObj, oldObj) {
  const ret = {}
  if (
    !(Object.prototype.toString.call(newObj) === '[object Object]') ||
    !(Object.prototype.toString.call(oldObj) === '[object Object]')
  ) {
    return null
  }
  for (const [key, val] of Object.entries(newObj)) {
    if (oldObj[key] && oldObj[key] !== val) {
      ret[key] = val
    }
  }
  if (JSON.stringify(ret) === '{}') {
    return null
  }
  return ret
}

/**
 * @title 对象属性排序
 * @description 按key的字母顺序进行重排，如果是多层对象，则分别递归处理
 * @param {array|object|string} obj 要处理的数据
 * @returns object
 */
export const sortObj = obj => {
  if (Array.isArray(obj)) {
    return obj.map(item => sortObj(item))
  }
  // 除数组以外的对象数据
  if (isObject(obj)) {
    const keysArray = Object.keys(obj).sort()
    const newObj = {}
    keysArray.forEach(key => {
      const value = obj[key]
      newObj[key] = sortObj(value)
    })
    return newObj
  }
  // 非对像数据，原样返回

  return obj
}

/**
 * !! this 通过 bind 指向 Vue.prototype
 * !! 若 this 不存在，即调用场景不支持 `this.$bridge` 等方法时，则自动使用 `console.log` 输出
 * @description 格式化日志输出，带数据排序功能，支持多条日志同时输出
 * @param {Array} params 数组形式传入日志列表，其中params[1]包含设置项
 * @param {Boolean} params[1].isExpanded 是否展开日志内容；为 `true` 时，带缩进空格格式化展开；为 `false` 时以紧凑字符串的形式输出
 * @param {Array} params[1].logType 日志输出方式 bridge || pageview || alert || console
 * @param {String} params[1].level 日志级别 Debug || Info || Warn || Error
 *
 * bridge 默认值，基于 `this.$bridge.log` 输出，带日志级别 // ! 支持展开日志
 * -- IOS 使用‘美居-设置-关于美的美居-测试使用-日志可视化工具’；安卓 logcat 过滤 `NativeInterface: >`
 *
 * console 基于 `console.log` 的常规日志输出 // ! 支持展开日志
 * -- 安卓 logcat过滤 `jsLog`；iOS 调试浮球进入log查看
 *
 * pageview 基于 `<ipc-debug />` 及 `this.$bug.$emit("log")` // ! 不支持展开日志
 * -- 在插件页上以浮层滚动输出，数据局限在当前页面
 *
 * alert 基于 `this.$alert` 输出 // ! 不支持展开日志
 */
export async function Log(...params) {
  // try-catch 日志输出出现异常时，避免正常业务功能堵塞
  try {
    // 从第二个参数 params[1] 中提取日志输出设置项
    const {
      isExpanded = true,
      logType = ['bridge', 'pageview'],
      level = 'Info',
    } = params[1] || {}

    // 格式化日志数组，alert 及 pageview 模式直接使用此数据输出
    const message = params.map(item => {
      if (typeof item !== 'object') {
        return item
      }
      const _copy = JSON.parse(JSON.stringify(item)) // 伪深拷贝，去掉不可枚举的属性
      return sortObj(_copy) // 按字母顺序整理日志数据项
    })

    const pageName = getPageName()

    const msg_split = message.map(item => {
      if (typeof item !== 'string') {
        return JSON.stringify(item, null, isExpanded ? 2 : 0)
      }
      return item
    })

    // 各条日志之间的分隔符
    const SPLITER = `\n$>---- Next Slice of ${pageName}.js ----\n`

    // 基于 pageview，页面浮层
    if (logType.includes('pageview') && !!this) {
      await delay() // HACK 可能存在渲染冲突，导致日志无法正常输出，等待下一轮渲染
      this.$bus.$emit('log', message)
    }

    // 基于 alert 弹窗
    if (logType.includes('alert') && !!this) {
      this.$alert(message)
    }

    // 基于 this.$bridge.log
    if (logType.includes('bridge') && !!this) {
      const prefix = `\n$>===== Beginning of ${pageName}.js =====\n`
      const str = msg_split.map(item => `>${item}`).join(SPLITER)
      this.$bridge.log({ message: `${prefix}${str}`, level })
    }

    // 基于 console.log
    if (logType.includes('console') || (logType.includes('bridge') && !this)) {
      const str = msg_split.join(SPLITER)

      // 每页的字符长度。原生输出日志长度限制为1024字节，路径及各种前缀又占了一部分长度
      const BUFFER_SIZE = 880

      // 不必分片，直接输出
      if (str.length <= BUFFER_SIZE) {
        const prefix = `\n===== Beginning of ${pageName}.js =====\n`
        console.log(`${prefix}${str}`)
      }
      // 分片输出
      else {
        let i = 0
        while (str.length > BUFFER_SIZE * i) {
          const prefix = `\n==== ${pageName}.js: page:${i + 1}, chars:${
            str.length
          } ====\n`
          console.log(
            `${prefix}${str.slice(BUFFER_SIZE * i, BUFFER_SIZE * ++i)}`
          )
        }
      }
    }
  } catch (err) {}
}

// 节流
export function throttle(func, delay) {
  let lastExecTime = 0
  return function (...args) {
    const now = new Date().getTime()
    const elapsedTime = now - lastExecTime
    console.log(lastExecTime)
    debugUtil.log('剩余时间', lastExecTime, elapsedTime)
    if (!lastExecTime || elapsedTime >= delay) {
      lastExecTime = now
      func.apply(this, args)
    }
  }
}

// 获取now的yyyy-MM-DD
export function getNowDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const today = `${year}-${month}-${day}`
  return today
}

// 获取now的YYYY-MM-DD HH:mm:ss
export function getNowTime() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  return dateTimeString
}

export function convertResistance(resistanceString) {
  // 匹配数字和单位部分
  const matches = resistanceString.match(/([\d\.]+)\s*(Ω|kΩ|mΩ|GΩ)?/)
  if (!matches) {
    // 如果没有找到数字和单位，返回 NaN
    return NaN
  }

  // 将数字部分转换为浮点数
  const value = parseFloat(matches[1])

  // 根据单位转换为相应的值
  switch (matches[2]) {
    case 'Ω':
      return value
    case 'kΩ':
      return value * 1000
    case 'mΩ':
      return value / 1000
    case 'GΩ':
      return value * 1000000000
    default:
      // 如果单位不是预期的值，返回 NaN
      return NaN
  }
}

export function calAge(birthday) {
  // 计算年龄
  var today = new Date()
  var birthDate = new Date(birthday)
  var age = today.getFullYear() - birthDate.getFullYear()
  var monthDiff = today.getMonth() - birthDate.getMonth()
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--
  }

  return age
}

export function daotui(dayCount) {
  const today = new Date() // 获取当前日期
  const oneWeekAgo = new Date(today.getTime() - dayCount * 24 * 60 * 60 * 1000) // 获取一周前的日期
  const year = oneWeekAgo.getFullYear() // 获取年份
  const month = String(oneWeekAgo.getMonth() + 1).padStart(2, '0') // 获取月份，并在前面补充 0
  const day = String(oneWeekAgo.getDate()).padStart(2, '0') // 获取日期，并在前面补充 0
  const oneWeekAgoString = `${year}-${month}-${day}` // 拼接成字符串格式的日期
  return oneWeekAgoString
}

export function getCurrentWeekRange(date) {
  const dayOfWeek = date.getDay() // 获取该日期的星期几（0-6，0表示星期日）

  // 根据星期几计算该日期所在周的第一天和最后一天的日期
  const firstDayOfWeek = new Date(
    date.getTime() - ((dayOfWeek + 6) % 7) * 86400000
  ) // 将时间调整到本周第一天
  const lastDayOfWeek = new Date(firstDayOfWeek.getTime() + 6 * 86400000) // 将时间调整到本周最后一天

  // // 格式化日期字符串
  // const firstDayStr = formatDate(firstDayOfWeek)
  // const lastDayStr = formatDate2(lastDayOfWeek)
  // const firstDayStr2 = formatDate3(firstDayOfWeek) // 格式化第一天的日期字符串
  // const lastDayStr2 = formatDate3(lastDayOfWeek) // 格式化最后一天的日期字符串

  // return [firstDayStr, lastDayStr, firstDayStr2, lastDayStr2] // 返回日期范围

  return [firstDayOfWeek, lastDayOfWeek]
}

export function getCurrentMonthRange(now) {
  const year = now.getFullYear() // 获取年份
  const month = now.getMonth() + 1 // 获取月份（注意：月份是从0开始计数的，所以需要加1）

  const firstDayOfMonth = new Date(year, month - 1, 1) // 当前月份的第一天
  const lastDayOfMonth = new Date(year, month, 0) // 当前月份的最后一天

  // const firstDayStr = formatDate(firstDayOfMonth) // 格式化第一天的日期字符串
  // const lastDayStr = formatDate2(lastDayOfMonth) // 格式化最后一天的日期字符串
  // const firstDayStr2 = formatDate3(firstDayOfMonth) // 格式化第一天的日期字符串
  // const lastDayStr2 = formatDate3(lastDayOfMonth) // 格式化最后一天的日期字符串

  // return [firstDayStr, lastDayStr, firstDayStr2, lastDayStr2] // 返回日期范围

  return [firstDayOfMonth, lastDayOfMonth]
}

export function getCurrentYearRange(now) {
  const year = now.getFullYear() // 获取年份

  const firstDayOfYear = new Date(year, 0, 1) // 当前年份的第一天
  const lastDayOfYear = new Date(year, 11, 31) // 当前年份的最后一天

  // const firstDayStr = formatDate(firstDayOfYear) // 格式化第一天的日期字符串
  // const lastDayStr = formatDate2(lastDayOfYear) // 格式化最后一天的日期字符串
  // const firstDayStr2 = formatDate3(firstDayOfYear) // 格式化第一天的日期字符串
  // const lastDayStr2 = formatDate3(lastDayOfYear) // 格式化最后一天的日期字符串

  // return [firstDayStr, lastDayStr, firstDayStr2, lastDayStr2] // 返回日期范围

  return [firstDayOfYear, lastDayOfYear]
}

export function formatDate(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}年${month}月${day}日`
}

export function formatDate2(date) {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}

export function formatDate3(date) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getMonthDaysArray(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate()
  const daysArray = []
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i)
  }
  return daysArray.length
}

export const arith = (n, d = 1, pad = null) => {
  let t = []
  for (let i = 0; i < n; i++) {
    if (i % d === 0) {
      t.push(i + 1)
    } else if (pad !== null) {
      t.push(pad)
    }
  }
  return t
}

export function getOneHundredYearsAgoDate() {
  var currentDate = new Date()
  var year = currentDate.getFullYear() - 100
  var month = currentDate.getMonth() + 1
  var day = currentDate.getDate()

  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }

  var oneHundredYearsAgo = year + '-' + month + '-' + day
  return oneHundredYearsAgo
}
