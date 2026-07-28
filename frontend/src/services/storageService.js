const memoryStorage = {};

export const setInMemoryData = (key, value) => {
  memoryStorage[key] = value;
};

export const getInMemoryData = (key) => {
  return memoryStorage[key] || null;
};

export const removeInMemoryData = (key) => {
  delete memoryStorage[key];
};

export const clearAllInMemoryData = () => {
  Object.keys(memoryStorage).forEach((key) => delete memoryStorage[key]);
};
