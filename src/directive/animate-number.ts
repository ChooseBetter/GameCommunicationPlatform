export default {
  beforeUpdate(el: any, binding: any) {
    // 最终要显示的数字
    let finalNum = binding.value;
    // 定时器间隔
    let rate = 10;
    // 总时长
    let time = 1000;
    // 步长,数据增加间隔
    let step = finalNum / (time / rate);
    // 初始值
    let count = 0;
    // 要保留的小数
    let timer = setInterval(() => {
      count = count + step;
      // 把数字转换为字符串，并指定0位小数点后数字
      el.innerText = count.toFixed(0);
      if (count > finalNum) {
        //  避免count大于finalNum最终数字显示不对
        count = finalNum;
        el.innerText = count;
        // 清空定时器
        clearInterval(timer);
      }
    }, rate);
  },
};
