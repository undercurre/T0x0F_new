/* eslint-disable no-unused-vars */
import { bodyFat } from '../config/level'
import { bodyType } from '../config/report'
import { calAge } from '.'

// BMI算法
export function calculateBMI(birthday, height, weight, impedance, gender) {
  // 转换身高为米
  height = height / 100

  // 计算BMI
  var bmi = weight / (height * height)

  // 如果是女性，通过阻抗调整BMI
  // if (gender === 'female') {
  //   bmi = bmi + (5.0 / impedance) * 1000
  // }

  // 返回结果并保留两位小数
  return bmi.toFixed(2)
}

// 体脂率算法
export function calculateBodyFatPercentage(
  birthday,
  height,
  weight,
  impedance,
  gender
) {
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

  let v7, v8, v9, v10, v11, v12, v13
  v7 = (weight / height / height) * 10000.0
  if (gender === 'male') {
    if (age >= 17) {
      v8 = -503790.0 / impedance / v7
      v9 = 11409.0 / impedance
      v10 = 0.0676
      v11 = v8 + 0.0
      v12 = 37.657
      return (age * v10 + (v9 + v11) + v12).toFixed(2) < 100
        ? (age * v10 + (v9 + v11) + v12).toFixed(2)
        : -1.0
    }
    if (age - 11 > 4) {
      return -1.0
    } else {
      return (
        12009.0 / impedance +
        (-506790.0 / impedance / v7 + 0.0) +
        age * -1.121 +
        63.25
      ).toFixed(2) < 100
        ? (
            12009.0 / impedance +
            (-506790.0 / impedance / v7 + 0.0) +
            age * -1.121 +
            63.25
          ).toFixed(2)
        : -1.0
    }
  } else {
    if (age >= 17) {
      v13 = -570020.0 / impedance / v7
      v9 = 17987.0 / impedance
      v10 = 0.0267
      v11 = v13 + 0.0
      v12 = 43.02
      return (age * v10 + (v9 + v11) + v12).toFixed(2) < 100
        ? (age * v10 + (v9 + v11) + v12).toFixed(2)
        : -1.0
    }
    if (age - 11 > 4) {
      return -1.0
    } else {
      return (
        17387.0 / impedance +
        (-556420.0 / impedance / v7 + 0.0) +
        44.19
      ).toFixed(2) < 100
        ? (
            17387.0 / impedance +
            (-556420.0 / impedance / v7 + 0.0) +
            44.19
          ).toFixed(2)
        : -1.0
    }
  }
}

// 肌肉率算法
export function calculateMuscleMassPercentage(
  birthday,
  height,
  weight,
  impedance,
  gender
) {
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

  // 计算bmi
  let v7 = (weight / height / height) * 10000.0
  if (gender == 'male') {
    if (age >= 17) {
      let v8 = 37.657
      let v10 =
        age * 0.0676 +
        (11409.0 / impedance + (-503790.0 / impedance / v7 + 0.0))
      let v11 = 0.9480012508444722
      return ((100.0 - (v10 + v8)) * v11).toFixed(2) < 100
        ? ((100.0 - (v10 + v8)) * v11).toFixed(2)
        : -1.0
    } else if (age - 11 >= 0 && age - 11 <= 4) {
      let v8 = 63.25
      let v10 =
        12009.0 / impedance + (-506790.0 / impedance / v7 + 0.0) + age * -1.121
      let v11 = 0.6104869429700175
      return ((100.0 - (v10 + v8)) * v11).toFixed(2) < 100
        ? ((100.0 - (v10 + v8)) * v11).toFixed(2)
        : -1.0
    } else {
      return -1.0
    }
  } else {
    if (age >= 17) {
      let v8 = 43.02
      let v10 =
        age * 0.0267 +
        (17987.0 / impedance + (-570020.0 / impedance / v7 + 0.0))
      return ((100.0 - (v10 + v8)) * 0.939).toFixed(2) < 100
        ? ((100.0 - (v10 + v8)) * 0.939).toFixed(2)
        : -1.0
    } else if (age - 11 >= 0 && age - 11 <= 4) {
      return (
        (100.0 -
          (17387.0 / impedance + (-556420.0 / impedance / v7 + 0.0) + 44.19)) *
        0.939
      ).toFixed(2) < 100
        ? (
            (100.0 -
              (17387.0 / impedance +
                (-556420.0 / impedance / v7 + 0.0) +
                44.19)) *
            0.939
          ).toFixed(2)
        : -1.0
    } else {
      return -1.0
    }
  }
}

// 内脏脂肪指数算法
export function calculateVFI(birthday, height, weight, impedance, gender) {
  const age = new Date().getFullYear() - new Date(birthday).getFullYear()
  let v7 = impedance
  if (gender == 'male') {
    return (
      age * 0.1668 +
      6096.3 / v7 +
      weight * (77.216 / v7 + 0.0678) +
      (height * ((-5489.0 / impedance + 2.8) * height)) / 10000.0 -
      1.22
    ).toFixed(2)
  } else {
    return (
      age * 0.068 +
      weight * (71.92 / v7 + 0.0876) +
      (height * ((-1261.7 / v7 - 2.88) * height)) / 10000.0 -
      1545.6 / v7 +
      5.9
    ).toFixed(2)
  }
}

// 皮下脂肪率算法
export function calculateSFR(birthday, height, weight, impedance, gender) {
  const age = new Date().getFullYear() - new Date(birthday).getFullYear()
  let v7 = (weight / height / height) * 10000.0
  if (gender == 'male') {
    if (age >= 17) {
      let v8 = 37.657
      let v9 = age * 0.0676 + 11409.0 / impedance + -503790.0 / impedance / v7
      return ((v9 + v8) * 0.898).toFixed(2) < 100
        ? ((v9 + v8) * 0.898).toFixed(2)
        : -1.0
    } else if (age >= 11 && age <= 15) {
      let v8 = 63.25
      let v9 = 12009.0 / impedance + -506790.0 / impedance / v7 + age * -1.121
      return ((v9 + v8) * 0.898).toFixed(2) < 100
        ? ((v9 + v8) * 0.898).toFixed(2)
        : -1.0
    } else {
      return -1.0
    }
  } else {
    if (age < 17) {
      if (age < 11 || age > 15) {
        return -1.0
      } else {
        return (
          (17387.0 / impedance + -556420.0 / impedance / v7 + 44.19) * 0.876 +
          1.66
        ).toFixed(2) < 100
          ? (
              (17387.0 / impedance + -556420.0 / impedance / v7 + 44.19) *
                0.876 +
              1.66
            ).toFixed(2)
          : -1.0
      }
    } else {
      return (
        (age * 0.0267 +
          17987.0 / impedance +
          -570020.0 / impedance / v7 +
          43.02) *
          0.876 +
        1.66
      ).toFixed(2) < 100
        ? (
            (age * 0.0267 +
              17987.0 / impedance +
              -570020.0 / impedance / v7 +
              43.02) *
              0.876 +
            1.66
          ).toFixed(2)
        : -1.0
    }
  }
}

// 水分率算法
export function calculateBodyWater(
  birthday,
  height,
  weight,
  impedance,
  gender
) {
  let v7, v8, v9, v10

  if (gender === 'male') {
    v7 = (696820 / impedance + 299.43) / weight
    v8 = -10770
    v9 = (height * height * 3705.3) / impedance / 10000
    v10 = 29.61
  } else {
    v7 = (556710 / impedance + 444.93) / weight
    v8 = -10276
    v9 = (height * height * 3752.4) / impedance / 10000
    v10 = 24.305
  }

  return (v7 + v9 + v8 / impedance + v10).toFixed(2) < 100
    ? (v7 + v9 + v8 / impedance + v10).toFixed(2)
    : -1.0
}

// 骨骼重量算法
export function calculateBoneDensity(
  birthday,
  height,
  weight,
  impedance,
  gender
) {
  // 计算年龄的函数
  function calculateAge(birthday) {
    var today = new Date()
    var birthDate = new Date(birthday)
    var age = today.getFullYear() - birthDate.getFullYear()
    var m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }
  // 计算年龄
  var age = calculateAge(birthday)

  let v7 = (weight / height / height) * 10000.0
  let v8, v9, v12, v13, v14, v15, v16, v17

  if (gender === 'male') {
    if (age >= 17) {
      v8 = 11409.0 / impedance + -503790.0 / impedance / v7
      v9 = 37.657
      v12 = age * 0.0676 + v8
      v13 = 100
      v14 = v12 + v9
      v15 = 0.05197827728103798
      v16 = 100
      console.log('mark', weight * (v13 - v14))
      return ((weight * ((v13 - v14) * v15)) / v16).toFixed(2)
    } else if (age >= 11 && age <= 15) {
      v17 = 12009.0 / impedance + -506790.0 / impedance / v7
      v9 = 63.25
      v12 = v17 + age * -1.121
      v13 = 100
      v14 = v12 + v9
      v15 = 0.05197827728103798
      v16 = 100
      return ((weight * ((v13 - v14) * v15)) / v16).toFixed(2)
    } else {
      return -1.0
    }
  } else {
    if (age >= 17) {
      v13 = 100.0
      v14 =
        age * 0.0267 + 17987.0 / impedance + -570020.0 / impedance / v7 + 43.02
      v15 = 0.061
      v16 = 100
      return ((weight * ((v13 - v14) * v15)) / v16).toFixed(2)
    } else if (age >= 11 && age <= 15) {
      return (
        (weight *
          ((100.0 -
            (17387.0 / impedance + -556420.0 / impedance / v7 + 44.19)) *
            0.061)) /
        100.0
      ).toFixed(2)
    } else {
      return -1.0
    }
  }
}

// 蛋白质率算法
export function calculateProteinRatio(
  birthday,
  height,
  weight,
  impedance,
  gender
) {
  var today = new Date()
  var birthDate = new Date(birthday)
  var age = today.getFullYear() - birthDate.getFullYear()
  var m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  let v7,
    v8,
    v9,
    v10,
    v11,
    v12,
    v13,
    v14,
    v15,
    v16,
    v17,
    v19,
    v20,
    v21,
    v22,
    v23,
    v24,
    v25,
    v26,
    v27,
    v28,
    v29,
    v30,
    v31,
    v32,
    v33,
    v34,
    v35

  v7 = (weight / height / height) * 10000.0
  if (gender === 'male') {
    if (age >= 17) {
      v8 = 696820.0 / impedance + 299.0
      v9 = -503790.0 / impedance / v7 + 0.0
      v10 = 11409.0 / impedance
      v11 = -10770.0 / impedance
      v12 = (height * 3705.3 * height) / impedance
      v13 = v10 + v9
      v14 = 37.657
      v15 = v12 / 10000.0
      v16 = v8 / weight
      v17 = 0.948
      v19 = age * 0.0676 + v13
      v25 = v17
      v26 = v16 + v15
      v27 = 29.61397824601844
      v33 = v26 + v11 + v27
      v34 = (100.0 - (v19 + v14)) * v25
      return (v34 - v33).toFixed(2) < 100 ? (v34 - v33).toFixed(2) : -1.0
    }
    if (age - 11 <= 4) {
      v28 = 696820.0 / impedance + 299.0
      v29 = -506790.0 / impedance / v7 + 0.0
      v30 = 12009.0 / impedance
      v11 = -10770.0 / impedance
      v31 = (height * 3705.3 * height) / impedance
      v32 = v30 + v29
      v14 = 63.25
      v15 = v31 / 10000.0
      v16 = v28 / weight
      v17 = 0.948
      v19 = v32 + age * -1.121
      v25 = v17
      v26 = v16 + v15
      v27 = 29.61397824601844

      v33 = v26 + v11 + v27
      v34 = (100.0 - (v19 + v14)) * v25
      return (v34 - v33).toFixed(2) < 100 ? (v34 - v33).toFixed(2) : -1.0
    }
    return -1.0
  } else {
    if (age >= 17) {
      v20 = 556710.0 / impedance + 444.0
      v21 = -570020.0 / impedance / v7 + 0.0
      v22 = 17987.0 / impedance
      v11 = -10276.0 / impedance
      v23 = (height * 3752.4 * height) / impedance
      v24 = v22 + v21
      v14 = 43.02
      v25 = 0.939
      v26 = v20 / weight + v23 / 10000.0
      v27 = 24.305
      v19 = age * 0.0267 + v24
      v33 = v26 + v11 + v27
      v34 = (100.0 - (v19 + v14)) * v25
      return (v34 - v33).toFixed(2) < 100 ? (v34 - v33).toFixed(2) : -1.0
    }
    if (age - 11 <= 4) {
      v35 = 17387.0 / impedance + (-556420.0 / impedance / v7 + 0.0)
      v33 =
        (556710.0 / impedance + 444.0) / weight +
        (height * 3752.4 * height) / impedance / 10000.0 +
        -10276.0 / impedance +
        24.305
      v34 = (100.0 - (v35 + 44.19)) * 0.939
      return (v34 - v33).toFixed(2) < 100 ? (v34 - v33).toFixed(2) : -1.0
    }
    return -1.0
  }
}

// 基础代谢量
export function calculateBMR(birthday, height, weight, impedance, gender) {
  if (weight <= 0) {
    return -1.0
  }

  var today = new Date()
  var birthDate = new Date(birthday)
  var age = today.getFullYear() - birthDate.getFullYear()
  var m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  let v7, v8, v9, v10

  if (gender === 'male') {
    if (age >= 17 || Math.abs(age - 11) <= 4) {
      v7 = weight * 13.9
      v8 = 66.0
      v9 = height * 5.1
      v10 = -6.8
      return (v7 + v8 + v9 + age * v10).toFixed(2)
    }
    return -1.0
  } else {
    if (age >= 17 || Math.abs(age - 11) <= 4) {
      v7 = weight * 9.6
      v8 = 665.0
      v9 = height * 1.9
      v10 = -4.7
      return (v7 + v8 + v9 + age * v10).toFixed(2)
    }
    return -1.0
  }
}

// 身体年龄
// eslint-disable-next-line no-unused-vars
export function calculateBodyAge(birthday, height, weight, impedance, gender) {
  if (weight <= 0) {
    return -1.0
  }

  var today = new Date()
  var birthDate = new Date(birthday)
  var age = today.getFullYear() - birthDate.getFullYear()
  var m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  let result =
    age * (age * 0.00313 * ((weight / height / height) * 10000.0 - 21.5) + 1.0)
  let v7 = result - age
  if (v7 <= 10.0) {
    if (v7 >= -10.0) {
      return result.toFixed(0)
    } else {
      return (age - 10).toFixed(0)
    }
  } else {
    return (age + 10).toFixed(0)
  }
}

// 肌肉重量
export function calculateMuscleMass(
  birthday,
  height,
  weight,
  impedance,
  gender
) {
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
  // 计算bmi
  let bmi = (weight / height / height) * 10000.0
  if (gender === 'male') {
    if (age >= 17) {
      let coeff = 11409.0 / impedance + (-503790.0 / impedance / bmi + 0.0)
      let const1 = 37.657
      let age_factor = age * 0.0676
      let muscle_mass = weight
      let loc_2000 = 100
      let loc_305 = 0.948
      let factor = age_factor + coeff
      return (
        (muscle_mass * ((loc_2000 - (factor + const1)) * loc_305)) /
        100.0
      ).toFixed(2)
    }
    if (age - 11 >= 0 && age - 11 <= 4) {
      let coeff = 12009.0 / impedance + (-506790.0 / impedance / bmi + 0.0)
      let const1 = 63.25
      let muscle_mass = weight
      let loc_2000 = 100
      let loc_305 = 0.948
      let factor = coeff + age * -1.121
      return (
        (muscle_mass * ((loc_2000 - (factor + const1)) * loc_305)) /
        100.0
      ).toFixed(2)
    }
    return -1.0
  } else {
    if (age >= 17) {
      let coeff = 17987.0 / impedance + (-570020.0 / impedance / bmi + 0.0)
      let const1 = 43.02
      let age_factor = age * 0.0267
      let muscle_mass = weight
      let loc_2000 = 100
      let loc_305 = 0.948
      let factor = age_factor + coeff
      return (
        (muscle_mass * ((loc_2000 - (factor + const1)) * loc_305)) /
        100.0
      ).toFixed(2)
    }
    if (age - 11 >= 0 && age - 11 <= 4) {
      return (
        (weight *
          ((100.0 -
            (17387.0 / impedance + (-556420.0 / impedance / bmi + 0.0)) +
            44.19) *
            0.948)) /
        100.0
      )
    }
    return -1.0
  }
}

// 骨骼肌率
export function getCountGetSkeletalMuscle(
  brithday,
  height,
  weight,
  impedance,
  gender
) {
  if (gender === 'male') {
    return (
      ((696820.0 / impedance + 299.43) / weight +
        (height * 3705.3 * height) / impedance / 10000.0 +
        -10770.0 / impedance +
        29.61) *
      0.895
    ).toFixed(2) < 100
      ? (
          ((696820.0 / impedance + 299.43) / weight +
            (height * 3705.3 * height) / impedance / 10000.0 +
            -10770.0 / impedance +
            29.61) *
          0.895
        ).toFixed(2)
      : -1.0
  } else {
    return (
      ((556710.0 / impedance + 444.93) / weight +
        (height * 3752.4 * height) / impedance / 10000.0 +
        -10276.0 / impedance +
        24.305) *
        0.857 +
      -0.36
    ).toFixed(2) < 100
      ? (
          ((556710.0 / impedance + 444.93) / weight +
            (height * 3752.4 * height) / impedance / 10000.0 +
            -10276.0 / impedance +
            24.305) *
            0.857 +
          -0.36
        ).toFixed(2)
      : -1.0
  }
}

// 计算标准体重
export function calculateStandardWeight(height) {
  // 将身高从厘米转换为米
  var heightM = height / 100

  // 根据性别和BMI值计算标准体重
  var standardWeightMin = 18.5 * heightM * heightM
  var standardWeightMax = 23.5 * heightM * heightM

  return {
    standardWeightMin,
    standardWeightMax,
  }
}

export function calBodyType(weight, impedance, height, birthday, sex) {
  const standardWeight = calculateStandardWeight(height)
  const down10 = standardWeight.standardWeightMin * 0.1
  const up10 = standardWeight.standardWeightMax * 0.1
  const tizhilvData = calculateBodyFatPercentage(
    birthday,
    height,
    weight,
    impedance,
    sex === '1' ? 'female' : 'male'
  )
  const tizhilv = bodyFat(parseInt(sex), calAge(birthday), tizhilvData)
  if (weight > standardWeight.standardWeightMax) {
    // 超出标准体重
    if (tizhilv.curLevel === 2) {
      // 但脂肪量标准——强壮型
      return bodyType.Strong
    }
    if (tizhilv.curLevel < 2) {
      // 但脂肪量较少——肌肉发达型
      return bodyType.Muscular
    }
    if (weight - standardWeight.standardWeightMax > up10) {
      // 超出10%
      if (tizhilv.curLevel > 2) {
        // 但脂肪含量高——肥胖型
        return bodyType.Obese
      }
    } else {
      // 标准体重
      if (tizhilv.curLevel > 2) {
        // 但脂肪含量高——微胖型
        return bodyType['Slightly-overweight']
      }
      if (tizhilv.curLevel === 2) {
        // 但脂肪量标准——偏瘦型
        return bodyType.Standard
      }
      if (tizhilv.curLevel < 2) {
        // 但脂肪量少——活力型
        return bodyType.Energetic
      }
    }
  } else if (weight < standardWeight.standardWeightMin) {
    // 超出标准体重
    if (weight - standardWeight.standardWeightMin > down10) {
      // 超出10%
      if (tizhilv.curLevel > 2) {
        // 但脂肪含量高——隐形肥胖型
        return bodyType['Hidden-obesity']
      }
      if (tizhilv.curLevel === 2) {
        // 但脂肪量标准——偏瘦型
        return bodyType.Thin
      }
      if (tizhilv.curLevel < 2) {
        // 但脂肪量标准——过瘦型
        return bodyType.Underweight
      }
    } else {
      // 标准体重
      if (tizhilv.curLevel > 2) {
        // 但脂肪含量高——微胖型
        return bodyType['Slightly-overweight']
      }
      if (tizhilv.curLevel === 2) {
        // 但脂肪量标准——偏瘦型
        return bodyType.Standard
      }
      if (tizhilv.curLevel < 2) {
        // 但脂肪量少——活力型
        return bodyType.Energetic
      }
    }
  } else {
    // 标准体重
    if (tizhilv.curLevel > 2) {
      // 但脂肪含量高——微胖型
      return bodyType['Slightly-overweight']
    }
    if (tizhilv.curLevel === 2) {
      // 但脂肪量标准——偏瘦型
      return bodyType.Standard
    }
    if (tizhilv.curLevel < 2) {
      // 但脂肪量少——活力型
      return bodyType.Energetic
    }
  }
  // 默认标准型
  return bodyType.Standard
}
