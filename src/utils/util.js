/**
 * 浏览器判断是否全屏
 */
 export const fullscreenToggel = () => {
    if (fullscreenEnable()) {
      exitFullScreen();
    } else {
      reqFullScreen();
    }
  };