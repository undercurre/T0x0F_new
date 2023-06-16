/* eslint-disable no-unused-vars */
// 这里负责输出标准、评估等级、建议

export function weightLevel(weight, height) {
  var bmivalue = weight / ((height / 100) * (height / 100))

  let levelBoy = [18.5, 24, 28]
  let levelGirl = [18.5, 24, 28]
  let levelText = ['偏瘦', '正常', '偏胖', '肥胖']
  let curLevel = 0
  let HealthAdvices = [
    '你太瘦了，离标准身材还有一点距离哦~',
    '你的体重相当健康，请继续保持！',
    '你的体重偏高，不及时调整可能引起相关疾病，请多加注意！',
    '体重正处于非常危险的区间，高血压、心脏病、糖尿病等代谢疾病的发病风险较高！',
  ]
  let EatAdvices = [
    '建议增加营养摄入。胃肠吸收不好的话一餐吃得多反而不能有效吸收，可以增加进餐次数。',
    '请继续保持良好的饮食方式，三餐按时，注重营养均衡。',
    '建议制定减肥计划，注意饮食，减少高热量高脂肪的食物摄入。',
    '请立刻减少高油高热量食物摄入，主食中增加杂粮、杂豆等富含膳食纤维的食物比重。',
  ]
  let ExerciseAdvices = [
    '建议制定增重计划，重视增肌，经常监测指标变化。',
    '请继续保持良好的运动习惯，坚持运动增强代谢，还有别忘了补充足够水分~',
    '从每日步行开始行动，努力恢复到健康体重和好身材。坚持运动，经常监测指标变化。',
    '请马上实施减肥计划，加大运动量，经常监测指标变化。',
  ]
  if (bmivalue < 18.5) {
    curLevel = 1
  } else if (bmivalue >= 18.5 && bmivalue < 24) {
    curLevel = 2
  } else if (bmivalue >= 24 && bmivalue < 28) {
    curLevel = 3
  } else {
    curLevel = 4
  }

  return {
    bmivalue,
    levelBoy,
    levelGirl,
    levelText,
    curLevel,
    curLevelText: levelText[curLevel - 1],
    curHealthAdvice: HealthAdvices[curLevel - 1],
    curEatAdvice: EatAdvices[curLevel - 1],
    curExerciseAdvice: ExerciseAdvices[curLevel - 1],
  }
}

export function bmiLevel(sex, age, value, weight) {
  let levelBoy = [18.5, 24, 28]
  let levelGirl = [18.5, 24, 28]
  let levelText = ['偏瘦', '正常', '偏胖', '肥胖']
  let curLevel = 0
  let HealthAdvices = [
    'BMI是衡量人体胖瘦程度的标准。你的BMI指数偏低，属于偏瘦人群，离标准身材还有一点距离哦~',
    '你的BMI指数很标准，请继续保持！',
    '你的BMI指数偏高，不及时调整可能引起相关疾病！',
    '你的BMI指数处于较高水平了，要知道BMI愈高，罹患胆结石、第二型糖尿病、高血压、心脏病及高脂血症等疾病的机率也随之增高，要重视并制定对应强度的瘦身计划！',
  ]
  let EatAdvices = [
    '建议加大摄入易消化吸收、高蛋白、高热量的食物（如果汁、奶酪等）。',
    '请继续保持良好的饮食方式，三餐按时，注重营养均衡。',
    '现在要制定相应的减肥计划，改变不良饮食习惯，配合适量的运动，使BMI指数恢复正常水平。',
    '当前需要严格控制摄入，请远离高热量的食物，主食中增加杂粮、杂豆等富含膳食纤维的食物比重。',
  ]
  let ExerciseAdvices = [
    '当前建议进行力量训练，适当增肌，使身材更加健美！',
    '保持规律运动，每周安排2-3次运动可以保持身体的基础代谢，使身体的循环能力增强。运动后记得拉伸放松哦~',
    '当前建议减脂，每周2-3次高强度间歇训练有助于快速燃烧脂肪，提高心肺功能。减脂原理是消耗大于摄入，只要坚持运动并合理控制摄入，很快就能瘦下来！',
    '请增加运动量，有助于消耗脂肪。体重指数较大时不要选择对膝盖压力较大的运动如跑步、跳动。',
  ]
  if (value < 18.5) {
    curLevel = 1
  } else if (value >= 18.5 && value < 24) {
    curLevel = 2
  } else if (value >= 24 && value < 28) {
    curLevel = 3
  } else {
    curLevel = 4
  }

  return {
    value,
    levelBoy,
    levelGirl,
    levelText,
    curLevel,
    curLevelText: levelText[curLevel - 1],
    curHealthAdvice: HealthAdvices[curLevel - 1],
    curEatAdvice: EatAdvices[curLevel - 1],
    curExerciseAdvice: ExerciseAdvices[curLevel - 1],
  }
}

export function bodyFat(sex, age, value, weight) {
  let levelBoy = []
  let levelGirl = []
  let levelText = ['偏瘦', '正常', '偏胖', '肥胖']
  let curLevel = 0
  let HealthAdvices = [
    '你的脂肪水平过低，身材有点单薄！为避免引发病痛不适，需养成良好的生活和饮食习惯。',
    '你的脂肪水平相当标准，请继续保持良好的饮食方式和生活习惯！',
    '你的脂肪水平偏高，表明脂肪摄入过剩而运动不足，长期可能导致糖尿病、高血压等心脑血管疾病，请提高警惕！',
    '你的脂肪水平过高！这样不仅会造成体形上的臃肿，更容易引发慢性疾病。建议定期监测血压、血糖、肝功能等。',
  ]
  let EatAdvices = [
    '建议加大摄入易消化吸收、高蛋白、高热量的食物（如果汁、奶酪等）。',
    '请继续保持良好的饮食方式，三餐按时，注重营养均衡。',
    '为打造健美身形，需要减少高热量高脂肪的食物摄入。',
    '请立刻减少高油高热量食物摄入，主食中增加杂粮、杂豆等富含膳食纤维的食物比重。',
  ]
  let ExerciseAdvices = [
    '建议制定增重计划，告别瘦削身材。',
    '注意保持锻炼，坚持运动增强代谢，还有别忘了补充足够水分~',
    '坚持适量的有氧运动，快走、慢跑、爬楼梯、骑行等都是很好的选择。',
    '请开始健身计划，加大运动量。每周2-3次力量训练有助于消耗脂肪，高强度间歇运动使脂肪燃烧的时间延长，做完运动躺着也会瘦哦~',
  ]
  // 计算女生标准
  if (age >= 10 && age <= 17) {
    levelGirl = [20, 37, 41]
  } else if (age >= 18 && age <= 39) {
    levelGirl = [21, 35, 40]
  } else if (age >= 40 && age <= 59) {
    levelGirl = [22, 36, 41]
  } else {
    levelGirl = [24, 37, 42]
  }
  // 计算男生标准
  if (age >= 10 && age <= 17) {
    levelBoy = [9, 26, 30]
  } else if (age >= 18 && age <= 39) {
    levelBoy = [11, 22, 27]
  } else if (age >= 40 && age <= 59) {
    levelBoy = [12, 23, 28]
  } else {
    levelBoy = [14, 25, 30]
  }

  if (sex === 1) {
    // 如果是女生
    if (value <= levelGirl[0]) {
      curLevel = 1
    } else if (value >= levelGirl[0] && value <= levelGirl[1]) {
      curLevel = 2
    } else if (value >= levelGirl[1] && value <= levelGirl[2]) {
      curLevel = 3
    } else {
      curLevel = 4
    }
  } else {
    // 如果是男生
    if (value <= levelBoy[0]) {
      curLevel = 1
    } else if (value >= levelBoy[0] && value <= levelBoy[1]) {
      curLevel = 2
    } else if (value >= levelBoy[1] && value <= levelBoy[2]) {
      curLevel = 3
    } else {
      curLevel = 4
    }
  }

  return {
    value,
    levelBoy,
    levelGirl,
    levelText,
    curLevel,
    curLevelText: levelText[curLevel - 1],
    curHealthAdvice: HealthAdvices[curLevel - 1],
    curEatAdvice: EatAdvices[curLevel - 1],
    curExerciseAdvice: ExerciseAdvices[curLevel - 1],
  }
}

export function bodyMuscle(sex, age, value, weight) {
  let levelBoy = [73, 81]
  let levelGirl = [69, 78]
  let levelText = ['不足', '正常', '优']
  let curLevel = 0
  let HealthAdvices = [
    '你的肌肉率偏低！保有一定量的肌肉可以促进代谢，减少与代谢紊乱相关的慢性病。',
    '你的肌肉率在标准范围内，要继续保持哦~',
    '你的肌肉率很优秀，要继续保持！',
  ]
  let EatAdvices = [
    '增肌阶段需要能量支持，需保持摄入大于消耗，尤其是糖分和蛋白质。高蛋白食物可以选择鸡胸肉、鸡蛋白等。糖分可从碳水化合物中摄取如各类谷物、红薯等。',
    '可适当调整饮食结构，以打造更完美的身形。',
    '请继续保持均衡饮食，因为暴食或节食会造成肌肉量流失',
  ]
  let ExerciseAdvices = [
    '可适当加强运动，使身形更完美！还有别忘了补充足够水分哦~',
    '注意保持锻炼，坚持运动增强代谢，还有别忘了补充足够水分~',
    '请继续保持适当的运动量，因为运动量骤然减少会造成肌肉量流失。',
  ]

  if (sex === 1) {
    // 如果是女生
    if (value <= levelGirl[0]) {
      curLevel = 1
    } else if (value > levelGirl[0] && value <= levelGirl[1]) {
      curLevel = 2
    } else {
      curLevel = 3
    }
  } else {
    // 如果是男生
    if (value <= levelBoy[0]) {
      curLevel = 1
    } else if (value > levelBoy[0] && value <= levelBoy[1]) {
      curLevel = 2
    } else {
      curLevel = 3
    }
  }

  return {
    value,
    levelBoy,
    levelGirl,
    levelText,
    curLevel,
    curLevelText: levelText[curLevel - 1],
    curHealthAdvice: HealthAdvices[curLevel - 1],
    curEatAdvice: EatAdvices[curLevel - 1],
    curExerciseAdvice: ExerciseAdvices[curLevel - 1],
  }
}

export function viscusFat(sex, age, value, weight) {
  let levelBoy = [9, 14]
  let levelGirl = [9, 14]
  let levelText = ['', '标准', '偏高', '高']
  let curLevel = 0
  let HealthAdvices = [
    '',
    '你的内脏脂肪水平很标准！适当的内脏脂肪可以大幅度降低心脑血管疾病的发病危险。',
    '你的内脏脂肪偏高，虽不算过度肥胖，但不引起重视的话也容易加剧并引发健康问题！',
    '你的内脏脂肪过高！过多的内脏脂肪会导致心脏病、高血压、高血脂和Ⅱ型糖尿病。建议定期监测血压、血糖、肝功能等。',
  ]
  let EatAdvices = [
    '',
    '请继续保持健康的饮食，拒绝高热量的食物。',
    '请调整饮食习惯，保持饮食清淡，少吃高热量食物。',
    '请调整饮食习惯，保持饮食清淡，少吃高热量食物。',
  ]
  let ExerciseAdvices = [
    '',
    '请继续保持适当的运动，健康会一直陪伴你哒~',
    '坚持规律运动，饭后步行30分钟，有利于促进食物的消化，带动能量消耗。',
    '在专业人士的指导下配合高强度运动。选择无氧运动以提高身体代谢能力，选择有氧运动以提高身体能量消耗，燃烧脂肪。',
  ]

  if (value < 9) {
    curLevel = 2
  } else if (value >= 9 && value <= 14) {
    curLevel = 3
  } else {
    curLevel = 4
  }

  return {
    value,
    levelBoy,
    levelGirl,
    levelText,
    curLevel,
    curLevelText: levelText[curLevel - 1],
    curHealthAdvice: HealthAdvices[curLevel - 1],
    curEatAdvice: EatAdvices[curLevel - 1],
    curExerciseAdvice: ExerciseAdvices[curLevel - 1],
  }
}

export function subcutaneousFat(sex, age, value, weight) {
  let levelBoy = [73, 81]
  let levelGirl = [69, 78]
  let levelText = ['偏低', '标准', '偏高']
  let curLevel = 0
  let HealthAdvices = [
    '你的皮下脂肪含量偏低了，可能是由于身体瘦弱，体脂率过低造成的。如果身体过于消瘦，并伴有全身乏力、疼痛、皮肤无光泽等症状，应考虑营养不良的可能性。',
    '你的皮下脂肪含量非常标准，请继续保持！',
    '你的皮下脂肪含量有点偏高！高糖高脂饮食、久坐少动、遗传因素等都是引起皮下脂肪率偏高的原因。皮脂率偏高会增加高脂血症、高血压、糖尿病等疾病的患病风险，也会让您的身材走样，需要引起注意！',
  ]
  let EatAdvices = [
    '适当增加碳水化合物和蛋白质的摄入能健康有效地增加皮下脂肪含量。',
    '请继续保持健康的饮食，拒绝高热量的食物。',
    '注意平衡膳食结构，控制热量摄入，多吃富含膳食纤维的粗粮谷物，多吃蔬菜水果。',
  ]
  let ExerciseAdvices = [
    '要坚持规律运动，积极锻炼身体！',
    '请继续保持适当的运动，健康会一直陪伴你哒~',
    '建议每周进行3-5次运动锻炼，降低皮脂率，积极减脂，改善身体健康状况，塑造健美的体型。',
  ]

  // 计算女生标准
  if (age <= 50) {
    levelGirl = [13.3, 19.9]
  } else {
    levelGirl = [14.5, 21.2]
  }
  // 计算男生标准
  if (age <= 50) {
    levelBoy = [6.67, 13.9]
  } else {
    levelBoy = [8.6, 15.9]
  }

  if (sex === 1) {
    // 如果是女生
    if (value <= levelGirl[0]) {
      curLevel = 1
    } else if (value > levelGirl[0] && value <= levelGirl[1]) {
      curLevel = 2
    } else {
      curLevel = 3
    }
  } else {
    // 如果是男生
    if (value <= levelBoy[0]) {
      curLevel = 1
    } else if (value > levelBoy[0] && value <= levelBoy[1]) {
      curLevel = 2
    } else {
      curLevel = 3
    }
  }

  return {
    value,
    levelBoy,
    levelGirl,
    levelText,
    curLevel,
    curLevelText: levelText[curLevel - 1],
    curHealthAdvice: HealthAdvices[curLevel - 1],
    curEatAdvice: EatAdvices[curLevel - 1],
    curExerciseAdvice: ExerciseAdvices[curLevel - 1],
  }
}

export function bodyWater(sex, age, value, weight) {
  let levelBoy = [73, 81]
  let levelGirl = [69, 78]
  let levelText = ['偏低', '标准', '偏高']
  let curLevel = 0
  let HealthAdvices = [
    '你的身体水分偏低！水是人体新陈代谢中的重要物质，一旦身体缺水，容易造成便秘、烦躁、头晕头痛、消化不良、记忆力下降等不良情况。',
    '你的身体水分处于标准范围。身体里充足的水分能促进代谢，带走体内毒素和废物，帮助你更好地消化食物和吸收养分。',
    '你的身体水分有点偏高！如果身体水分含量持续偏高，可能表明细胞外有水分淤积，请及时咨询专业医生。',
  ]
  let EatAdvices = [
    '日常要多补充水分。保持充足的水分可以促进身体的代谢，带走体内的废物和毒素。',
    '听说，规律的饮食习惯和每天8杯水就可以维持正常的身体水分哦~',
    '请注意保持规律的饮食习惯，另外每天8杯水就可以维持正常的身体水分哦~',
  ]
  let ExerciseAdvices = [
    '体重降低时，若水分降低但体脂无变化，减轻的部分可能是体内的水分，表明减重方式不科学哦~',
    '如有进行运动锻炼，请注意补充水分，弥补出汗过多导致的水分流失。',
    '平时要加强运动，多排汗，及时上厕所，把体内多余的水分排出去可以排毒和促进新陈代谢。',
  ]

  // 计算女生标准
  if (age < 40) {
    levelGirl = [45, 60]
  } else if (age >= 40 && age <= 60) {
    levelGirl = [43.5, 58.5]
  } else {
    levelGirl = [42, 57]
  }

  // 计算男生标准
  if (age < 40) {
    levelBoy = [50, 65]
  } else if (age >= 40 && age <= 60) {
    levelBoy = [48.5, 63.5]
  } else {
    levelBoy = [47, 62]
  }

  if (sex === 1) {
    // 如果是女生
    if (value <= levelGirl[0]) {
      curLevel = 1
    } else if (value > levelGirl[0] && value <= levelGirl[1]) {
      curLevel = 2
    } else {
      curLevel = 3
    }
  } else {
    // 如果是男生
    if (value <= levelBoy[0]) {
      curLevel = 1
    } else if (value > levelBoy[0] && value <= levelBoy[1]) {
      curLevel = 2
    } else {
      curLevel = 3
    }
  }

  return {
    value,
    levelBoy,
    levelGirl,
    levelText,
    curLevel,
    curLevelText: levelText[curLevel - 1],
    curHealthAdvice: HealthAdvices[curLevel - 1],
    curEatAdvice: EatAdvices[curLevel - 1],
    curExerciseAdvice: ExerciseAdvices[curLevel - 1],
  }
}

export function bodyBone(sex, age, value, weight) {
  let levelBoy = [73, 81]
  let levelGirl = [69, 78]
  let levelText = ['不足', '标准', '优']
  let curLevel = 0
  let HealthAdvices = [
    '你的骨骼量偏低，可能是长期低钙饮食、缺乏户外日照、缺乏锻炼运动、过度减肥、遗传等因素导致。',
    '你的骨骼量处于标准水平，请继续保持！',
    '恭喜，你的骨骼量水平优秀，说明生活习惯较健康，营养摄入合理，骨骼中包含的钙等无机盐含量非常充分，请继续保持！',
  ]
  let EatAdvices = [
    '建议调整健康饮食，加强营养摄入，加强补钙的同时也要补充胶原蛋白和维生素D。',
    '建议在维持现有饮食习惯的前提下，适当补钙，让骨骼更健康。',
    '请继续保持健康的饮食习惯！',
  ]
  let ExerciseAdvices = [
    '建议加强锻炼，多晒太阳，每天午饭后可以步行10分钟，补充钙质又能保持身材~',
    '建议保持适当的锻炼。每天午饭后可以步行10分钟，补充钙质又能保持身材~',
    '请继续保持适当的锻炼！每天午饭后可以步行10分钟，补充钙质又能保持身材~',
  ]

  // 计算女生标准
  if (weight < 45) {
    levelGirl = [1.7, 1.9]
  } else {
    levelGirl = [2.1, 2.3]
  }

  // 计算男生标准
  if (age < 60) {
    levelBoy = [2.4, 2.6]
  } else if (age >= 60 && age <= 75) {
    levelBoy = [2.8, 3]
  } else {
    levelBoy = [3.1, 3.3]
  }

  if (sex === 1) {
    // 如果是女生
    if (value <= levelGirl[0]) {
      curLevel = 1
    } else if (value > levelGirl[0] && value <= levelGirl[1]) {
      curLevel = 2
    } else {
      curLevel = 3
    }
  } else {
    // 如果是男生
    if (value <= levelBoy[0]) {
      curLevel = 1
    } else if (value > levelBoy[0] && value <= levelBoy[1]) {
      curLevel = 2
    } else {
      curLevel = 3
    }
  }

  return {
    value,
    levelBoy,
    levelGirl,
    levelText,
    curLevel,
    curLevelText: levelText[curLevel - 1],
    curHealthAdvice: HealthAdvices[curLevel - 1],
    curEatAdvice: EatAdvices[curLevel - 1],
    curExerciseAdvice: ExerciseAdvices[curLevel - 1],
  }
}

export function boneMuscle(sex, age, value, weight) {
  let levelBoy = [20, 56]
  let levelGirl = [20, 56]
  let levelText = ['偏低', '标准', '偏高']
  let curLevel = 0
  let HealthAdvices = [
    '你的骨骼肌含量偏低！同龄人中，肌肉率更高的会显得年轻~',
    '你的骨骼肌含量非常标准，请继续保持！',
    '你的骨骼肌含量属于优秀等级，要继续保持哦！',
  ]
  let EatAdvices = [
    '建议调整健康饮食。',
    '请继续保持健康的饮食习惯！',
    '请继续保持健康的饮食习惯！',
  ]
  let ExerciseAdvices = [
    '适当增加运动可以让自己变得更加有力量。',
    '坚持运动就能继续保持漂亮的身体线条！',
    '坚持运动就能继续保持漂亮的身体线条！',
  ]

  if (value <= 20) {
    curLevel = 1
  } else if (value > 20 && value <= 56) {
    curLevel = 2
  } else {
    curLevel = 3
  }

  return {
    value,
    levelBoy,
    levelGirl,
    levelText,
    curLevel,
    curLevelText: levelText[curLevel - 1],
    curHealthAdvice: HealthAdvices[curLevel - 1],
    curEatAdvice: EatAdvices[curLevel - 1],
    curExerciseAdvice: ExerciseAdvices[curLevel - 1],
  }
}

export function danbaizhi(sex, age, value, weight) {
  let levelBoy = [16, 20]
  let levelGirl = [16, 20]
  let levelText = ['偏低', '标准', '偏高']
  let curLevel = 0
  let HealthAdvices = [
    '你的蛋白质水平过低！缺乏蛋白质会引起免疫力下降、肌肉无力、贫血、易疲劳和营养不良，请多加注意！',
    '你的蛋白质水平在标准范围内，免疫力良好，肌肉有力，请继续保持！',
    '你的蛋白质水平偏高！过剩的蛋白质可能转化成脂肪，加重肾脏的负担，请多加注意！',
  ]
  let EatAdvices = [
    '多摄入肉类、奶类、蛋类食物，同时避免过多的脂肪摄入。',
    '只要保持健康的饮食，不过分节食，就可以维持稳定的蛋白质水平。',
    '建议控制高蛋白食物的摄入量，适当增加谷类食物、绿叶蔬菜、水果的摄入。',
  ]
  let ExerciseAdvices = [
    '加强运动，锻炼肌肉，减少体脂。',
    '坚持适当的锻炼，健康会一直陪伴你！',
    '坚持多运动，健康才会一直陪伴你~',
  ]

  if (value <= 16) {
    curLevel = 1
  } else if (value > 16 && value <= 20) {
    curLevel = 2
  } else {
    curLevel = 3
  }

  return {
    value,
    levelBoy,
    levelGirl,
    levelText,
    curLevel,
    curLevelText: levelText[curLevel - 1],
    curHealthAdvice: HealthAdvices[curLevel - 1],
    curEatAdvice: EatAdvices[curLevel - 1],
    curExerciseAdvice: ExerciseAdvices[curLevel - 1],
  }
}

export function jichudaixie(sex, age, value, weight) {
  let levelBoy = [16, 20]
  let levelGirl = [16, 20]
  let levelText = ['偏低', '标准', '偏高']
  let curLevel = 0
  let HealthAdvices = [
    '你的基础代谢水平偏低！年龄增加、体重降低、药物、交感神经活动少等因素都可能导致基代水平降低。此外，环境温度对代谢也有影响。舒适环境（20～25℃）中，代谢最低。如基础代谢水平持续过低，请及时咨询专业医生。',
    '目前你的基础代谢已达标，请继续保持！',
    '你的基础代谢水平偏高！发育时期、体重增长等因素都可能导致基代水平升高。此外，环境温度对代谢也有影响，偏低和偏高的温度环境中，代谢会升高。如基础代谢水平持续过高，请及时咨询专业医生。',
  ]
  let EatAdvices = [
    '饮食上可摄入富含蛋白质的食物如鸡胸肉、鸡蛋白等。蛋白质耗能比碳水化合物和脂肪多，身体消耗蛋白质也会消耗热量。',
    '只要不多吃就可以轻松保持体重哦~',
    '',
  ]
  let ExerciseAdvices = [
    '力量训练可提高基础代谢，增加能耗。',
    '保持基础代谢的最有效方式是每天都进行一些低强度的运动。最低成本的低强度运动是步行和慢跑~',
    '',
  ]

  if (age >= 1 && age <= 2) {
    levelBoy = [600, 800]
    levelGirl = [600, 800]
  } else if (age >= 3 && age <= 5) {
    levelBoy = [800, 1000]
    levelGirl = [760, 960]
  } else if (age >= 6 && age <= 8) {
    levelBoy = [990, 1190]
    levelGirl = [900, 1100]
  } else if (age >= 9 && age <= 11) {
    levelBoy = [1190, 1390]
    levelGirl = [1080, 1280]
  } else if (age >= 12 && age <= 14) {
    levelBoy = [1380, 1580]
    levelGirl = [1240, 1440]
  } else if (age >= 15 && age <= 17) {
    levelBoy = [1510, 1710]
    levelGirl = [1200, 1400]
  } else if (age >= 18 && age <= 29) {
    levelBoy = [1450, 1650]
    levelGirl = [1110, 1310]
  } else if (age >= 30 && age <= 49) {
    levelBoy = [1400, 1600]
    levelGirl = [1070, 1270]
  } else if (age >= 50 && age <= 69) {
    levelBoy = [1250, 1450]
    levelGirl = [1010, 1210]
  } else {
    levelBoy = [1120, 1320]
    levelGirl = [910, 1110]
  }

  if (sex === 1) {
    // 如果是女生
    if (value <= levelGirl[0]) {
      curLevel = 1
    } else if (value > levelGirl[0] && value <= levelGirl[1]) {
      curLevel = 2
    } else {
      curLevel = 3
    }
  } else {
    // 如果是男生
    if (value <= levelBoy[0]) {
      curLevel = 1
    } else if (value > levelBoy[0] && value <= levelBoy[1]) {
      curLevel = 2
    } else {
      curLevel = 3
    }
  }

  return {
    value,
    levelBoy,
    levelGirl,
    levelText,
    curLevel,
    curLevelText: levelText[curLevel - 1],
    curHealthAdvice: HealthAdvices[curLevel - 1],
    curEatAdvice: EatAdvices[curLevel - 1],
    curExerciseAdvice: ExerciseAdvices[curLevel - 1],
  }
}
