const app = getApp();
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
  },
  data: {
    totalMargin: 80,
    listData: [],
    travelsList: [], // 在某地，视频渲染模块
    strategyList: [], // 攻略
    spotList: [], // 游记
  },
  lifetimes: {
    
  },
  methods: {
    // 这里是处理数据，把
    // const list = [{
    //   category: 'a',
    //   number: 1
    // }, {
    //   category: 'b',
    //   number: 2
    // }, {
    //   category: 'a',
    //   number: 3
    // }]
    // 形式的处理成
    // const list = [[{
    //   category: 'a',
    //   number: 1
    // }, {
    //     category: 'b',
    //     number: 2
    // }], [{
    //   category: 'a',
    //   number: 3
    // }]]
    // 这里采用快慢指针的算法
    // fillData: function (isPull, data) {
    //   const result = [];
    //   let fastIndex = 0, slowIndex = 0;
    //   let currentItem = [], includeCategorys = [];
    //   for (let item of data) {
    //     currentItem = result[slowIndex];
    //     if (!currentItem) {
    //       result[slowIndex] = [item];
    //       fastIndex++;
    //     }else {
    //       includeCategorys = result[slowIndex].map(im => im.category);
    //       includeCategorys.includes(item.category) ? ((result[fastIndex] = [item]) && fastIndex++) : result[slowIndex].push(item);
    //     }
    //     result[slowIndex].length === 3 ? slowIndex++ : '';
    //   }
    //   this.setData({
    //     listData: result
    //   })
    // }
    
    // 发现上面的数据格式，传参给template不好区分，二维数组里面元素的数据格式还是换成key value的形式吧
    fillData: function (isPull, data) {
      const result = [];
      let fastIndex = 0, slowIndex = 0;
      let currentItem = [], includeCategorys = [];
      // let wrapCount = 0; // 计算swiper的高度
      for (let item of data) {
        currentItem = result[slowIndex];
        console.log(currentItem, 'currentItem')
        if (!currentItem) {
          result[slowIndex] = {};
          result[slowIndex][item.category] = {...item};
          fastIndex++;
        }else {
          includeCategorys = Object.keys(result[slowIndex]);
          includeCategorys.includes(item.category) ? ((result[fastIndex] = {...item}) && fastIndex++) : result[slowIndex][item.category]=item;
        }
        Object.keys(result[slowIndex]).length === 3 ? slowIndex++ : '';
      }
      console.log(result, 'result')
      const extra = data.length - slowIndex * 3 || 0; // 多余的数据条数
      const wrapHeight = (slowIndex * (373 + 189 + 274) + 373 * extra) * 2 + 195; // 视频高度没有去取精确值，粗略算法，多余的条数按照最长的一条来算;195为top-bar
      this.triggerEvent('getHeight', { wrapHeight });
      this.setData({
        listData: result
      })
      console.log(result, result[0].travels.detail.content[1].images[0])
    },
  }
})