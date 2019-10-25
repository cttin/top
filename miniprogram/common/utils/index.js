const utils = {
  //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
  GetSlideDrection: function(startX, startY, endX, endY) {
    const dy = endY - startY;
    const dx = endX - startX;
    let result = 0;
    // 滑动距离太短，则认为没有滑动
    if (Math.abs(dy) < 2 && Math.abs(dx) < 2) {
      return result;
    }
    let angle = this.GetSliderAngle(dx, dy);
    if (angle >= -45 && angle < 45) {
      result = 4;
    } else if (angle >= 45 && angle < 135) {
      result = 1;
    } else if (angle >= -135 && angle < -45) {
      result = 2;
    } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
      result = 3;
    }
    return result;
  },
  GetSliderAngle: function(dx, dy) {
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  },
  // 格式化时间
  // let Date = new Date();
  // console.log(dateFormat(Date, "yyyy-MM-dd hh:mm:ss")) // 调用
  dateFormat: function(thisDate, fmt) {
    let o = {
      "M+": thisDate.getMonth() + 1,
      "d+": thisDate.getDate(),
      "h+": thisDate.getHours(),
      "m+": thisDate.getMinutes(),
      "s+": thisDate.getSeconds(),
      "q+": Math.floor((thisDate.getMonth() + 3) / 3),
      "S": thisDate.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (thisDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  // formatTime: function(date) { 
  //   const year = date.getFullYear();
  //   const month = date.getMonth() + 1;
  //   const day = date.getDate();
  //   const hour = date.getHours();
  //   const minute = date.getMinutes();
  //   const second = date.getSeconds();
  //   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
  // },
  // formatNumber: function(n) {
  //   n = n.toString();
  //   return n[1] ? n : '0' + n;
  // }

}
module.exports = utils;