export function decode(resource) {
  // 把数据变成十六进制数组
  const data = resource
    .match(/.{1,2}/g)
    .map(item => parseInt(item.toString(16), 16))

  // x1其实是xi
  // x2就是xi+1

  // 初始化加密因子
  let x1 = data[10] // 取MAC地址的最后一位
  let y1 = data[11]

  // 解密明文
  const decryptedData = []
  for (let i = 12; i < data.length; i++) {
    // 密文
    const s = data[i]

    // 明文
    let lent = s - y1
    if (lent < 0) lent += 256
    const d = lent ^ x1

    decryptedData.push(d.toString(16).padStart(2, '0').slice(-2))

    // 更新加密因子
    let y2 = x1 ^ y1
    let x2 = x1 + d

    // 纠正借位
    if (x2 > 256) {
      x2 -= 256
    }
    if (x2 < 0) {
      x2 += 256
    }
    if (y2 > 256) {
      y2 -= 256
    }
    if (y2 < 0) {
      y2 += 256
    }

    x1 = x2
    y1 = y2
  }

  // 拼接非加密部分
  let dataP = data
    .splice(0, 12)
    .concat(decryptedData.map(item => parseInt(item, 16)))

  return dataP
}
