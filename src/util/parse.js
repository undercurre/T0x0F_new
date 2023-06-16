export function parseBluetoothData(data) {
  const manufacturerId = (data[0] << 8) | data[1]
  const protocolVersion = data[2]
  const modelNumber = (data[3] << 8) | data[4]
  const macAddress = data
    .slice(5, 11)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join(':')
  const random = data[11]
  const scaleMode = data[12]
  const flags = data[13]

  let modeInfo = {}
  console.log(scaleMode)
  switch (scaleMode) {
    case 0x00:
      modeInfo = { name: '休眠' }
      break
    case 0x01:
      console.log('称重')
      modeInfo = { name: '称重', code: '01' }
      break
    case 0x02:
      modeInfo = { name: '平衡力', code: '02', status: flags & 0x03 }
      break
    case 0x03:
      modeInfo = {
        name: '阻抗',
        code: '03',
        measurementMode: Boolean(flags & 0x01),
        measurementStatus: Boolean(flags & 0x02),
        impedanceStatus: (flags >> 2) & 0x03,
      }
      break
  }

  let measurementInfo = {}
  switch (scaleMode) {
    case 0x00:
    case 0x01: {
      const weightUnit = flags & 0x03
      const weightUnitName = ['kg', 'lb', 'st', '斤'][weightUnit]
      const division = (flags >> 2) & 0x03
      const divisionName = [100, 50, 10][division] + 'g'
      measurementInfo = {
        weight: ((data[14] | (data[15] << 8)) * 0.01).toFixed(2),
        weightUnit: weightUnitName,
        division: divisionName,
        isStable: Boolean(flags & 0x10),
        isOverloaded: Boolean(flags & 0x20),
        isConfiguring: Boolean(flags & 0x40),
      }
      break
    }
    case 0x02:
      measurementInfo = {
        status: flags & 0x03,
      }
      break
    case 0x03: {
      const measurementMode = Boolean(flags & 0x01)
      const impedanceUnit = measurementMode ? 'Ω' : 'kΩ'
      measurementInfo = {
        impedance: (data[14] | (data[15] << 8)) + impedanceUnit,
        measurementMode,
        measurementStatus: Boolean(flags & 0x02),
        impedanceStatus: ['正常', '阻抗偏低/短路', '阻抗偏大/开路', '失败'][
          (flags >> 2) & 0x03
        ],
      }
      break
    }
  }

  const broadcastNumber = data[16]
  const checksum = data.slice(11, 17).reduce((acc, val) => acc + val, 0) & 0xff

  return {
    manufacturerId,
    protocolVersion,
    modelNumber,
    macAddress,
    random,
    mode: modeInfo,
    measurement: measurementInfo,
    broadcastNumber,
    checksum,
  }
}
