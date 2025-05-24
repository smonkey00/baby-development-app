import { Baby } from "@/types";

export function validateForm(data: Baby): Record<string, string> {
  const errors: Record<string, string> = {};
  
  // Validate age (0-72 months)
  if (!data.age) {
    errors.age = "请输入宝宝年龄";
  } else if (data.age < 0 || data.age > 72 || !Number.isInteger(data.age)) {
    errors.age = "年龄必须是0-72之间的整数";
  }
  
  // Validate height (30-130 cm)
  if (!data.height) {
    errors.height = "请输入宝宝身高";
  } else if (data.height < 30 || data.height > 130) {
    errors.height = "身高必须是30-130之间的数值";
  }
  
  // Validate weight (3-30 kg)
  if (!data.weight) {
    errors.weight = "请输入宝宝体重";
  } else if (data.weight < 3 || data.weight > 30) {
    errors.weight = "体重必须是3-30之间的数值";
  }
  
  // Validate gender
  if (!data.gender) {
    errors.gender = "请选择宝宝性别";
  }
  
  return errors;
}