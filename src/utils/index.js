/**
 * 格式化日期
 * @param {*} time
 * @param {*} cFormat
 * @returns string
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * 格式化时间
 * @param {*} time
 * @param {*} option
 * @returns string
 */
export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
 * 检测字符串是否为空
 * @param {*} text
 * @returns bool
 */
export function checkEditorReq(text) {
  const div = document.createElement('div')
  div.innerHTML = text
  text = div.textContent || div.innerText
  if (text.trim() === '') {
    return false
  }
  return true
}

export function checkEditorNum(text, number) {
  const div = document.createElement('div')
  div.innerHTML = text
  text = div.textContent || div.innerText

  return text.length
}

/**
 * 检测字符串是否包含emoji表情符
 * @param {*} str
 * @returns bool
 */
export function checkEmojiChar(str) {
  var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig

  if (regStr.test(str)) {
    return false
  }

  return true
}

/**
 * 交换数组元素
 * @param {*} arr
 * @param {*} index1
 * @param {*} index2
 * @returns arr
 */
export function swapItems(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  return arr
}

/**
 * 是否为数值
 * @param {*} val
 * @returns bool
 */
export function isNumber(val) {
  var regPos = /^\d+(\.\d+)?$/ // 非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ // 负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true
  } else {
    return false
  }
}

/**
 * 文件下载
 * @param {*} url
 */
export function downloadFile(url) {
  var iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = url
  document.body.appendChild(iframe)
}

/**
 * 深拷贝
 * @param {*} values
 * @returns
 */
export function deepClone(values) {
  var copy

  // Handle the 3 simple types, and null or undefined
  if (values === null || typeof values !== 'object') return values

  // Handle Date
  if (values instanceof Date) {
    copy = new Date()
    copy.setTime(values.getTime())
    return copy
  }

  // Handle Array
  if (values instanceof Array) {
    copy = []
    for (var i = 0, len = values.length; i < len; i++) {
      copy[i] = deepClone(values[i])
    }
    return copy
  }

  // Handle Object
  if (values instanceof Object) {
    copy = {}
    for (var attr in values) {
      if (values.hasOwnProperty(attr)) copy[attr] = deepClone(values[attr])
    }
    return copy
  }

  throw new Error("Unable to copy values! Its type isn't supported.")
}

/**
 * 获取mp3时长
 * @param {*} file
 * @param {*} callback
 * @returns
 */
export function getMediaTimeByPromise(file, callback) {
  return new Promise((resolve, reject) => {
    var src = window.createObjectURL && window.createObjectURL(file) || window.URL && window.URL.createObjectURL(file) || window.webkitURL && window.webkitURL.createObjectURL(file)
    var audio = document.createElement('audio')
    audio.style.display = 'none'
    audio.style.display = 'block'
    audio.src = src
    audio.muted = true
    audio.play()
    const g = function g() {
      if (isNaN(audio.duration)) {
        requestAnimationFrame(g)
      } else {
        resolve(Math.round(audio.duration))
      }
    }
    requestAnimationFrame(g)
  })
}

/**
 *数组去重
 * @param {*} arr
 * @returns
 */
export function duplicateRemoval(arr) {
  var obj = arr.reduce(function(accumulator, item) {
    accumulator[item] = 1
    return accumulator
  }, {})

  return Object.keys(obj)
}
