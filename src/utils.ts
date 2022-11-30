export const getArrangedData = () => {
  let data = [];
  for (let i = 0; i < 5; ++i) {
    for (let j = 0; j < 6; ++j) {
      data[i * 6 + j] = [-12 + j * 5, 2 + i * 3, -16];
    }
  }
  return data;
};

export const getRandomData = () => {
  let data = [];
  for (let i = 0; i < 6; ++i) {
    for (let j = 0; j < 5; ++j) {
      data[i * 6 + j] = [
        -15 + j * 5 + Math.random() * 8,
        1 + i * Math.random() * 4 + j,
        -15 * i * j * Math.random() - 15,
      ];
      if (data[i * 6 + j][1] > 15) data[i * 6 + j][1] = 15;
    }
  }

  return data;
};
