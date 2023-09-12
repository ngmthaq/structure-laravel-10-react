export const __ = (key, placeholders = {}) => {
  let translations = window.translations;
  let keyArray = key.split(".");
  let string = getI18nValue(keyArray, translations);
  Object.entries(placeholders).forEach(([placeholderKey, placeholderValue]) => {
    string = string.replace(":" + placeholderKey, placeholderValue);
  });

  return string;
};

export const getI18nValue = (keyArray, translations, index = 0) => {
  const key = keyArray[index];
  if (translations[key]) {
    const value = translations[key];
    if (typeof value === "string") {
      return value;
    }

    return getI18nValue(keyArray, value, index + 1);
  }

  return keyArray.join(".");
};
