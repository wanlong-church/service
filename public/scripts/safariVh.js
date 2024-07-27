/** 解決 safari 100vh 問題 */
const setCorrectViewHeight = () => {
  const windowVH = window.innerHeight / 100;
  document.documentElement.style.setProperty("--vh", `${windowVH}px`);
};
setCorrectViewHeight();
window.addEventListener("resize", setCorrectViewHeight);
