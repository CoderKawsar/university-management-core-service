export const asyncForEach = async (array: any[], callback: any) => {
  if (!Array.isArray(array)) {
    throw new Error('Exprected an array');
  }

  for (let index = 0; array.length; index++) {
    await callback(array[index], index, array);
  }
};
