import bodyFatIcon from '../assets/image/fat.png'
import bmiIcon from '../assets/image/bmi.png'
import bodyAgeIcon from '../assets/image/bodyAge.png'
import muscleIcon from '../assets/image/muscle.png'
import visceralIcon from '../assets/image/visceral.png'
import subcutaneousIcon from '../assets/image/subcutaneous.png'
import fatFreeIcon from '../assets/image/fatFree.png'
import waterIcon from '../assets/image/water.png'
import boneIcon from '../assets/image/bone.png'
import boneMuscleIcon from '../assets/image/boneMuscle.png'
import proteinIcon from '../assets/image/protein.png'
import rateIcon from '../assets/image/rate.png'

import standard from '../assets/image/standard.png'
import obese from '../assets/image/obese.png'
import slightlyOverweight from '../assets/image/slightly-overweight.png'
import thin from '../assets/image/thin.png'
import strong from '../assets/image/strong.png'

import * as algo from '../util/algo'
import * as level from './level'

export let reportDataset = [
  {
    key: 'bodyFat',
    name: '体脂率',
    icon: bodyFatIcon,
    algo: algo.calculateBodyFatPercentage,
    level: level.bodyFat,
    unit: '%',
    define:
      '体脂率是反映身体胖瘦程度的最重要指标之一，体脂肪包括皮下脂肪和内脏脂肪，体脂肪率则指体内脂肪总重量占体重的百分比。',
  },
  {
    key: 'bmi',
    name: 'BMI',
    icon: bmiIcon,
    algo: algo.calculateBMI,
    level: level.bmiLevel,
    unit: 'kg/㎡',
    define:
      'BMI（Body Mass Index），是国际常用的衡量人体胖瘦程度以及是否健康的标准。请注意以下人群不适宜参考此指数：1）18岁以下未成年人；2）运动员；3）正在做重量训练的人；4）怀孕或哺乳中；5）身体虚弱或久坐不动的老人。',
  },
  {
    key: 'bodyAge',
    name: '身体年龄',
    icon: bodyAgeIcon,
    algo: algo.calculateBodyAge,
    unit: '岁',
    define:
      '身体年龄是基于对身体各项指标的全面评估后得出的数值，取决于生活方式和健康状况。',
  },
  {
    key: 'muscle',
    name: '肌肉率',
    icon: muscleIcon,
    algo: algo.calculateMuscleMassPercentage,
    level: level.bodyMuscle,
    unit: '%',
    define:
      '人体肌肉包括构成内脏的平滑肌、构成心脏的心肌，以及牵引身体活动的骨骼肌。肌肉在人体中起到了维持身体活动的重要作用。肌肉率是指人体的肌肉比例。',
  },
  {
    key: 'visceral',
    name: '内脏脂肪率',
    icon: visceralIcon,
    algo: algo.calculateVFI,
    level: level.viscusFat,
    unit: '%',
    define:
      '内脏脂肪是人体脂肪的一种，主要存在于腹腔内。一定量的内脏脂肪对器官起到了支撑和保护作用，但过量的内脏脂肪也会对身体带来危害。',
  },
  {
    key: 'subcutaneousIcon',
    name: '皮下脂肪率',
    icon: subcutaneousIcon,
    algo: algo.calculateSFR,
    level: level.subcutaneousFat,
    unit: '%',
    define:
      '人体的脂肪大约有2/3贮存在皮下组织。皮下脂肪是贮存于皮下的脂肪组织，在真皮层以下，筋膜层以上，用于调节体温，保护对温度敏感的组织，防止热能散失。',
  },
  {
    key: 'fatFree',
    name: '去脂体重',
    icon: fatFreeIcon,
    algo: algo.calculateMuscleMass,
    unit: 'kg',
    define:
      '去脂体重是指除脂肪外身体其他成分的重量，其中肌肉是关键部分。去脂体重的测量对于促进能量转换、耗氧以及调节水和盐代谢等具有参考价值',
  },
  {
    key: 'water',
    name: '水分率',
    icon: waterIcon,
    algo: algo.calculateBodyWater,
    level: level.bodyWater,
    unit: '%',
    define:
      '人体水分是指人体内的水分，包括血液，淋巴液，细胞外液，细胞内液等。水分率是人体中水分所占体重的百分比。',
  },
  {
    key: 'bone',
    name: '骨骼率',
    icon: boneIcon,
    algo: algo.calculateBoneDensity,
    level: level.bodyBone,
    unit: '%',
    define:
      '骨骼量是人体中骨组织的含量，代表骨骼健康情况，直接反应出骨质疏松程度。骨组织包括骨矿物质（钙、磷等）和骨基质（骨胶原、蛋白质、无机盐等）。',
  },
  {
    key: 'boneMuscle',
    name: '骨骼肌率',
    icon: boneMuscleIcon,
    algo: algo.getCountGetSkeletalMuscle,
    level: level.boneMuscle,
    unit: '%',
    define:
      '骨骼肌是具有收缩能力的组织之一，人体所有的活动几乎都是由骨骼肌收缩来完成，其强弱与运动训练强度有关，骨骼肌率越高，人体的力量和耐力越好。',
  },
  {
    key: 'protein',
    name: '蛋白质率',
    icon: proteinIcon,
    algo: algo.calculateProteinRatio,
    level: level.danbaizhi,
    unit: '%',
    define:
      '蛋白质是人体细胞、组织的重要组成部分，起到了维持体内酸碱平衡，运输氧气和营养物质等作用，是人体生命活动的主要承担者。',
  },
  {
    key: 'rate',
    name: '基础消耗',
    icon: rateIcon,
    algo: algo.calculateBMR,
    level: level.jichudaixie,
    unit: 'kcal/天',
    define:
      '基础代谢率是指人体在清醒又极端安静的状态下，不受肌肉活动、环境温度、食物及精神紧张等影响所消耗的基础能量，代表人体维持生命的所有器官的最低能量需要。',
  },
]

export const bodyType = {
  'Hidden-obesity': {
    name: '隐形肥胖型',
    define: '体重低于标准10%以上，但体脂肪量高。',
    advice:
      '你的体型属于隐性肥胖型。饮食上建议均衡地摄取营养，尤其是蛋白质的补充，但应减少高脂肪与甜食的摄取。运动上建议加强脂肪燃烧，降低体内脂肪量；另一方面强化肌力，培养运动习惯，可改善体力不足的问题。',
    icon: obese,
  },
  Obese: {
    name: '肥胖型',
    define: '体重高于标准体重10%以上，体脂肪量高。',
    advice:
      '你的体型属于肥胖型。饮食上建议制定专门的减重减脂餐单.运动上建议加强脂肪燃烧运动，每周至少固定三次运动，每次运动时间在30分钟以上。',
    icon: obese,
  },
  'Slightly-overweight': {
    name: '微胖型',
    define: '体重符合标准，但体脂肪量高，是典型的现代人体型。',
    advice:
      '你的体型属于微胖型。饮食上应减少高脂肪、高热量的食物摄入，避免营养过剩。运动上建议加强脂肪燃烧运动。',
    icon: slightlyOverweight,
  },
  Thin: {
    name: '偏瘦型',
    define: '体重低于标准体重10%以上，但体脂肪量符合标准。',
    advice:
      '你的体型属于偏瘦型。建议加强肌力训练，多做强化肌力运动，可促进体内新陈代谢。',
    icon: standard,
  },
  Underweight: {
    name: '过瘦型',
    define: '体重低于标准体重10%以上，体脂肪量不足。',
    advice:
      '你的体型属于过瘦型。饮食上建议多注意均衡营养的摄取。运动上建议增加强化肌力的运动，可帮助体力的训练及体力的增加。',
    icon: thin,
  },
  Standard: {
    name: '标准型',
    define: '体重及体脂肪量均符合标准。',
    advice:
      '你的体型属于标准型。体型会随年龄增长及饮食、运动而改变，请注意维持均衡的营养，并经常做运动，才可保持标准的体型。',
    icon: standard,
  },
  Strong: {
    name: '强壮型',
    define: '体重高于标准体重，体脂肪量正常，本体型的人骨架大，肌肉也较发达。',
    advice:
      '你的体型属于强壮型。通常本体型的人应属于运动型，若能多做脂肪燃烧运动，降低脂肪，体型将更健美。',
    icon: strong,
  },
  Energetic: {
    name: '活力型',
    define: '体重标准，但体脂肪量少，是健而美的体型。',
    advice:
      '你的体型属于活力型。通常活力型的人为运动族中的一员，请继续保持运动习惯，以维持让人羡慕的身材。',
    icon: strong,
  },
  Muscular: {
    name: '肌肉发达型',
    define: '体重超过标准体重，但体脂肪量少，是典型的运动员。',
    advice:
      '你的体型属于肌肉发达型。请继续维持固定的运动，避免长时间不运动，造成脂肪堆积。',
    icon: strong,
  },
}
