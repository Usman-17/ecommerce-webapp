export const vibrate = (pattern = 20) => {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
};

export const successVibrate = () => vibrate(20);

export const deleteVibrate = () => vibrate(80);

export const errorVibrate = () => vibrate([100, 50, 100]);
