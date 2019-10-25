# 排行榜
>> 前言  
一直觉得开发如果能有助于解决实际问题，那么这将是体现其价值最好的方式之一。
最近想学习小程序开发，但是可以做点什么呢？从身边的实际情况考虑，其实有两个思路。  
第一，做一个吃喝玩乐榜单类型的。从自身出发，去一个地方旅游，其实经常会有玩什么、买什么的苦恼，也会想知道大家平常玩的是什么，基于这么一个思路，于是就想做一个排行榜的小程序。其中的功能有：给你推荐的一些玩法和地方，各个地区的景点、住宿、及购物等等的排行榜榜单，让大家一目了然的知道目的地的一些流行的玩法、景点等等。当然你也可以自己发表一些游玩的心得什么的，让大家看到你的推荐和游玩经验；  
第二，做一个医类的，这个想法是来自于我爸爸。因为他之前去医院看病，完了之后，可能后面需要当时检查的报告或者医生开的的证明之类的东西，但是又不一定保存好了，这就很头疼。所以想做一个医类主题的小程序，功能想的大概有：医保卡（可以添加医保卡、就诊卡）、健康档案（基本信息、门诊记录、住院记录、体检报告等等）、就医服务（预约挂号）、健康管理（每日运动、体重指数、肿瘤风险评估、血压记录、血糖记录等等）、我的（可以上传证明、也可以记录当时就医、平常的健康情况等等）。  
这里先做了排行榜的小程序。下面主要介绍一下该小程序的功能及遇到的问题记录。
## 功能
排行榜分为三大块，分别为：首页、排行榜、我的。  
* 首页  
首页分为四个模块，有推荐、当地、国内及国外。   
推荐主要是一些热度比较高的攻略，内容各个方面可能都会有，列表按照热度来排序。点开可以看到文章的详情，详情里面可以点击❤️，也可以进行回复。    
当地是根据你在的地区推荐一些热度较高的攻略。国内、国外同理。     
首页可以进行搜索，搜索弹框有历史记录，点击历史记录的tag会发起相关内容的请求，搜索弹框里也有一些tab，包括：综合、景点、路线、酒店、笔记、游记、攻略等等，点击会进入到对应的页面    
* 排行榜  
排行榜相比首页会更加细分，包括地区的细化、各个模块主题的细化。排行榜可以选择世界不同地区，选择之后，会展示该地区的景点、路线、住宿、美食、购物等主题模块。这里所有的列表都是根据热度来进行排序。  
* 我的  
在这里可以看到个人信息，包括收藏、订单以及历史记录等等。这里也可以写笔记、游记，发视频等等。  
## 项目介绍及遇到的问题  
* 项目技术  
项目主要采用微信小程序原生开发，选取了[colorui](https://github.com/weilanwl/ColorUI)作为CSS库。
使用云开发搭建服务器，云开发具体的使用方式可以参考[微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)和[小程序云开发项目 · 私房书柜](https://github.com/Tencent-CloudEDU/WXCloud-bookcase)。
* 开发记录及遇到的问题  
因为也是第一次写小程序，难免遇到许多问题。在做项目的过程中将一些遇到的问题和总结记录下来。  
  1.设置页面的背景颜色不是在json文件中设置backgroundColor（ backgroundColor 指的窗体背景颜色，而不是页面的背景颜色，即窗体下拉刷新或上拉加载时露出的背景），而是在wxss文件中设置`background`。
    ```
    page {
      background-color: #eee;
    }
    ```
  [微信小程序设置 backgroundColor 无效的问题](https://www.jianshu.com/p/e5bf778ac1d4)    
  2.自定义组件使用报错   
  [微信小程序——自定义组件时，编译报`Component is not found in path '...'`](https://blog.csdn.net/u014490083/article/details/81026601?utm_source=blogxgwz0)  
  3.swiper默认高度150px，超过不显示，所以页面如果较长，可能需要设置合适的高度，如首页中。  
  4.父子组件传值
    - WXML 数据绑定  
    用于父组件向子组件的指定属性设置数据。     
    A（父组件）中引入B（子组件）  
      ```
      <componentB paramAtoB='我是A向B中传入的参数'/> 
      ``` 
    B（子组件）接收A（父组件）的数据   
      ```
      properties: {
        paramAtoB: String // B组件（子）
      },
      ```
    - 事件  
    用于子组件向父组件传递数据，可以传递任意数据。
    A（父组件）接收B（子组件）的事件，进行相应的操作：
      ```
      <componentB bind:eventBtoA='eventBtoA'/> // A组件中引入B组件
      ...
      eventBtoA(e) {
        ...
      }
      ```
    B（子组件）触发A（父组件）的方法：  
      ```
      this.triggerEvent('eventBtoA', {
        'XXX': 123
      })
      ```
    - `this.selectComponent`  
    父组件可以通过`this.selectComponent`获取子组件实例对象，这样就可以访问子组件的任意方法。   
    使用时要注意几点：   
    ① 确保`"usingComponents"`的key和wxml文件的标签一样。  
    ② 参数可以为id或者class，如：   
      ```
      this.componentName = this.selectComponent('#id');
      this.componentName = this.selectComponent('.className');
      ```  
      注意：这里的id或者class是在页面中定义的，而不是在组件中，而且不能传标签选择器。  
    ③ 要注意时机，要等元素渲染了再去获取。    
    ④ 如果用了`wx:if`有可能为null。  
      
  5.通过数据绑定动态改变video的宽高、image不要通过style设置样式。  
  6.video组件  
  项目列表页和详情页都可能有视频的的播放，这里封装了微信官方的video组件，使用`cover-view`和`cover-image`覆盖在原生组件上面。
    - 播放  
    组件通过`const videoContext = wx.createVideoContext()`方法或得实例，通过`videoContext.play()`控制播放，`videoContext.pause()`暂停播放。  
    - WiFi环境下自动播放 
    微信提供判断网络环境的api，通过api判断，如果是wifi下，就主动调用videoContext.play()方法。 
    - 视频不在范围停止播放  
    通过`wx.createIntersectionObserver()`这个api来监听元素位置，从而控制是否播放。 
    - 设置宽高  
    通过`behaviors/setVideoSize.js`设置宽高，通过屏幕宽度以及左右边距来设置视频容器的大小。 
    
  7.template模板与component组件
  template和component组件是小程序中常见的组件化方式，两者的区别是template模板主要是展示，方法需要在引用template的页面定义，传入的仅仅是数据。而component组件有自己的JS文件，整个component组件类似一个page页面。如果仅仅是数据的展示，建议使用template，如果涉及到较多的逻辑，建议使用component。  
  8.瀑布流布局 
  瀑布流分为左右两列，分别对应左右的数据源，主要是数据源的处理。左右两边的数据如何分配？左右各定义一个高度`leftHeight`、`rightHeight`，来分别记录左右容器的高度，如果左边的高度大于右边的高度，则把下一个元素放在右边，并且右边的高度叠加新加元素的高度；如果右边的高度大于左边的高度也是同样的道理。  
  使用的话就是首先在对应页面的json文件中引入：  
    ```
    "usingComponents": {
      "waterFallView": "../../component/WaterFallView/WaterFallView"
    }
    ```
  然后在wxml文件中添加组件，并加上id或者class。
    ```
    <waterFallView id='waterFallView'></waterFallView>
    ```
  最后在父组件页面利用上面说到的`this.selectComponent`调用填充数据的方法（fillData）。
    ```
    fillData: function (isFull,goods){
      let view = this.selectComponent('#waterFallView');
      view.fillData(isFull, goods);
    },
    ```
  在写首页瀑布流的时候，给图片设置好了宽度和高度，最终的效果宽度是设置的值，但高度总是不对，找了很久的原因，后面才发现是设置了`mode:widthFix`，宽度不变，高度自动变化的原因。 
  
  9.生命周期  
  生命周期分为组件生命周期和页面生命周期。  
  * 组件生命周期  
  小程序组件生命周期在[微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/lifetimes.html)也有介绍，但是没有明确说明有哪些生命周期钩子函数。这里简单的列一下。  
    - created  
    组件实例化，当组件刚被创建好时触发，但节点树还未生成。这个生命周期不能调用`this.setData`方法，通常情况下，这个生命周期只应该用于给组件 this 添加一些自定义属性字段。  
    - attached  
    组件完全初始化完毕，进入页面节点树后，`attached`被触发。此时，`this.data`已经被初始化为组件当前的默认值，可以用setData渲染节点，但无法操作节点，绝大多数初始化工作可以在这个时机进行。  
    - ready  
    组件布局完成，这时可以获取节点信息，也可以操作节点。  
    - moved  
    组件实例被移动到树的另一个位置。  
    - detached  
    组件实例从节点树中移除。  
  * 页面生命周期  
   各个生命周期的触发时机可以参考[微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page-life-cycle.html)。  
    - onLoad  
    小程序注册完之后，加载页面，触发onLoad方法。onLoad函数携带的options参数可以获取打开当前页面路径中的参数。  
    - onShow  
    页面载入后触发onShow方法，显示页面。  
    - onReady  
    首次显示页面会触发onReady方法，渲染页面元素和样式，一个页面只会调用一次。之前在写项目的时候也遇到过问题，在写首页的时候，瀑布流一开始没加载出来，以为是home设置为page的原因（原来onReady根本没执行），然后把home改成Component，fillData放到attached里面执行，结果还是不对。后面改成放到ready里面就好了。因为onRady它其实只执行了一次。  
    - onHide  
    当小程序后台运行或者跳转到其他页面时，触发onHide方法。  
    - onShow  
    当小程序有后台进入到前台运行或重新进入页面时，触发onShow方法。  
    - onUnload  
    当使用重定向方法`wx.redirectTo()`或关闭当前页返回上一页`wx.navigateBack()`，触发onUnload。  
    ![屏幕快照 2019-10-19 上午7.27.50.png](https://i.loli.net/2019/10/19/dTr4GhAYFV25aUy.png)   
    
    
  10.微信小程序全局样式无法作用于自定义组件的解决办法  
  在组件中加以下代码：  
    ```
    Component({
      options: {
        addGlobalClass: true
      }
    })
    ```
  11.swiper-item不要用wx:if，不然可能会导致无法渲染。（home）  
  12.选择地区动画  
  在排行榜模块，有个选择地区的功能，点击后会出现从下到上的弹出层动画（area组件），具体的API可以参考[微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/wx.createAnimation.html)。  
  其中，涉及到的API有以下几个：   
  `wx.createAnimation()`：创建动画。    
  `animation.translateY()`：对Y轴平移，向下为正，默认位置为(50%, 50%, 0)。     
  `animation.step()`：完成一个动画。    
  `animation.export()`：导出动画队列。    
  先说一下弹出，因为动画是从下到上弹出，先初始化设置在Y轴偏移1000px，同时显示遮罩层，然后在`setTimeout`里面设置弹出动画的最后偏移量为0，同时导出数据给animationData，这时候往上弹出内容。  
  点击取消或者选择好了地址之后会消失，消失的动画，先是在Y轴方向设置了700的偏移量，这时候弹框慢慢向下消失，在定时器里面把动画最后的位移再还原为0，同时设置变量`areas`为false，遮罩层消失。  
  13.在组件中调用`wx.createSelectorQuery()`为null    
  在自定义组件中，应使用`this.createSelectorQuery()`。    
  详见官方文档[wx.createSelectorQuery()](https://developers.weixin.qq.com/miniprogram/dev/api/wxml/wx.createSelectorQuery.html)  
  14.小程序使用百度地图  
  使用前的操作步骤，也可以参考[文档](http://lbsyun.baidu.com/index.php?title=wxjsapi/guide/key)。    
  ① 申请ak      
    在[百度开放平台](http://lbsyun.baidu.com)中，导航栏选择”开发文档“ => ”微信小程序JavaScript API“，点击申请ak；创建应用；选择微信小程序；接下来在我的应用里面就可以看到刚生成的ak。     
    ![屏幕快照 2019-09-26 下午9.56.52.png](https://i.loli.net/2019/09/26/QdArLw2aY6HNyJS.png)     
    把ak复制到小程序代码里。     
  ② 下载百度地图API   
    在[相关下载](http://lbsyun.baidu.com/index.php?title=wxjsapi/wxjs-download)中下载API与DEMO，解压之后里面有两个js文件，一个压缩过的，一个常规没压缩的，由于小程序对项目文件大小有限制，所以推荐使用压缩版的。在项目根目录下新建一个路径，将百度的js文件拷贝到新建的路径下。    
    不想下载的百度地图也提供了线上转换链接地址：'https://api.map.baidu.com/reverse_geocoding/v3'，参数如pages/auth/auth.js中的getCityName函数所示。经度纬度可以通过`wx.getLocation`获得。   
  ③ 添加合法域名      
    使用小程序的账号登录[微信公众平台](https://mp.weixin.qq.com/)，在“设置” 中选择 “开发设置”，把百度地图api的url：  `https://api.map.baidu.com`添加到request合法域名中（只支持https）。如果配置之后还是未生效，可以在 微信开发者工具 => 详情 => 项目配置中查看域名信息。如果存在还是不生效，刷新一下，应该就好了。     
    如果没有设置合法域名，在开发阶段是可以不设置合法域名的：微信开发者工具 => 详情 => 勾选 不校验合法域名...。   
  ④ 编辑代码    
    如果是下载的压缩包，要先引入压缩代码，然后new一个实例，再去调用对应的方法，具体用法及常见方法如下：    
    ```
    const bmap = require('../../libs/bmap-wx/bmap-wx.min');
    Page({
      data: {
        ak: 'XXXXX', // 百度地图ak
      },
      onLoad: function (options) { // 这里放在了onLoad里面
        const BMap = new bmap.BMapWX({
          ak: this.data.ak
        });
        // 调用的天气方法
        BMap.weather({ 
          success: data => {
            const weatherData = data.currentWeather[0];
            this.setData({
              weatherData
            });
          },
          fail: (err) => {
            console.log(err)
          }
        });
        // 百度搜索
        BMap.suggestion({
          query: e.detail.value,
          region: this.city,
          city_limit: true  ,
          success: data => {
            console.log(data);
          },
          fail: (err) => {
            console.log(err)
          },
        });
        // 查询附近和周边
        BMap.search({
          "query": '办公楼',
          success: data => {
            console.log(data);
          },
          fail: (err) => {
            console.log(err)
          },
          // 此处需要在相应路径放置图片文件 
          iconPath: 'https://loumayun.oss-cn-shenzhen.aliyuncs.com/mini-program/map.png',
          // 此处需要在相应路径放置图片文件 
          iconTapPath: '../assets/icons/marker_red.png'
        });
      },
    })
    ```
    如果是引用的地址，可以参考pages/auth/auth.js中的代码。  
    这里还要注意下，使用百度地图API进行逆地理编码时将新建的服务端AK填入到URL中进行访问时，可能会返回：  
    ```
    {
      "status":240,
      "message":"APP 服务被禁用"
    }
    ```
  参考[最新文档](http://lbsyun.baidu.com/index.php?title=webapi/guide/webservice-geocoding-abroad)发现，官方对逆地址编码服务做了升级，   分拆为地理编码和逆地理编码两个独立服务，实现坐标点和对应位置信息转化的功能。请求的URL发生了变化，之前的是："http://api.map.baidu.com/geocoder/v2/?location=34.35555,107.32518&output=json&ak=你的AK&pois=1" ，后面改成了："http://api.map.baidu.com/reverse_geocoding/v3/?ak=你的AK&output=json&coordtype=wgs84ll&location=31.225696,121.49884" 。        
  改了新的URL之后，应该就没有问题了。  
  15. 自定义导航栏  
  小程序有两种导航栏：常规和自定义。  
  常规布局下，可以使用小程序提供的导航栏。  
  自定义导航栏可以自己掌控样式，赋予导航栏更多的交互和UI样式。本项目用的也会自定义导航栏，这里重点说一下自定义导航栏需要做哪些工作。    
  ① app配置     
  禁用所有的头部，在`app.json`的window里加一行：   
  ```
  "window": {
    "navigationStyle": "custom"
  }, 
  ```
  你会发现所有页面的头部都消失了。      
  ② 在app.js里面获取导航栏高度的全局数据：    
  ```
  wx.getSystemInfo({
    success: e => {
      this.globalData.StatusBar = e.statusBarHeight;
      let custom = wx.getMenuButtonBoundingClientRect();
      this.globalData.Custom = custom;
      this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
    }
  })
  ```
  导航栏分为StatusBar和NavigationBar，通过`wx.getSystemInfo()`获取状态栏高度，`wx.getMenuButtonBoundingClientRect()`获取菜单按钮（右上角胶囊按钮）的布局位置信息。CustomBar为导航栏的高度，StatusBar为上边距的距离。坐标信息以屏幕左上角为原点。  
  ③ 然后在app.wxss里面设置：  
  ```
  /* app.wxss */
  page {
    height: 100%;
  }
  ```
  16.自定义tabBar   
    ① 模拟tabBar页面  
    如果要自定义tabBar，在`app.json`中就不需要配置tabBar。用普通page页面来替代tabBar页面的话，每个模拟的tabBar页面都需要引入自定义tabbar组件。写法主要是定义一个tab组件，定义你需要的tab，绑定事件，点击元素之后利用`wx.redirectTo`跳转到对应的页面。由于`wx.redirectTo`跳转页面是跳转的普通页面，页面渲染也自然会导致自定义的tabbar组件重新渲染，所以会出现底部tabBar闪一下，体验不是很好。  
    ② Component代替页面 
    将模拟的tab页面换成组件，如本项目的写法，由于是通过wx:if控制组件的创建和销毁，是局部更新，所以不会导致底部tabBar的重新渲染。不过这样的话很多逻辑都需要定义在外部总的页面中，如上拉加载下拉刷新，代码可能稍微有些乱。  
    上拉加载下拉刷新的方法只有在页面中才能检测到，但是有的时候获取数据是在子组件，如何执行“子组件的上拉加载下拉刷新”方法呢？思路可以通过vue中的ref得到启发，也就是给子组件加一个属性，id或者class，如： 
    ```
    <component-name id="sub"></component-name>
    ```
    通过利用在第四点中谈到的父子组件通信方法，直接在父组件中调用子组件的方法： 
    ```
    this.selectComponent("#sub").methodName();
    ```
    如果涉及到多次调用该子组件的方法，可以在onReady生命周期中定义一下： 
    ```
    onReady:function(){
      this.subComponent = this.selectComponent("#sub");
    },
    ```
  之后直接调用`this.subComponent.methodName()`就可以了。     
  17.小程序页面跳转方法总结 
  * 利用小程序API跳转  
    ① [wx.navigateTo](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html)
    保留当前页面跳转到应用内的某个页面，该方法调用的页面会被加入堆栈，所以可以利用[wx.navigateBack](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateBack.html)返回到原来的页面。  
    ```
    wx.navigateTo({
      url: 'page/home/home?user_id=111'
    })
    ```
    可以返回上一页面可以或者多级页面，利用`getCurrentPages()`可以决定返回几层。   
    ② [wx.redirectTo](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.redirectTo.html)  
    关闭当前页面，跳转到应用内的某个页面，但不允许跳转到 tabBar 页面。   
    ③ [wx.switchTab](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.switchTab.html)    
    可以利用`wx.switchTab`跳转到tabBar页面（在app.json中注册过的tabBar页面），同时关闭其他非tabBar页面。     
    ④ [wx.reLanch](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.reLaunch.html)   
    关闭所有页面，打开到应用内的某个页面。   
  * 组件内跳转     
  可以通过navigator实现组件内跳转，同时open-type属性指明页面跳转方式。   
    ```
    // redirect 对应 API 中的 wx.redirect 方法
    <navigator url="../../redirect/redirect/redirect?title=redirect" open-type="redirect" hover-class="other-navigator-hover">在当前页打开</navigator>
    // switchTab 对应 API 中的 wx.switchTab 方法
    <navigator url="/page/index/index" open-type="switchTab" hover-class="other-navigator-hover">切换 Tab</navigator>
    // reLanch 对应 API 中的 wx.reLanch 方法
    <navigator url="../../redirect/redirect/redirect?title=redirect" open-type="redirect" hover-class="other-navigator-hover">关闭所有页面，打开到应用内的某个页面</navigator>
    // navigateBack 对应 API 中的 wx.navigateBack 方法
    <navigator url="/page/index/index" open-type="navigateBack" hover-class="other-navigator-hover">关闭当前页面，返回上一级页面或多级页面</navigator>
    ```
  18.tabs选项卡    
  首页的tabs选项卡可以通过点击选项卡实现滑动显示，也可以通过滑动内容来显示。   
  标题是通过scroll-view来实现的，内容滑动使用swiper组件来实现。     
  页面需要作处理，判断是点击了scroll-view组件还是滑动了swiper，如果是点击了scroll-view，需要作防重复点击，同时设置当前和上一个激活的index；如果是滑动了swiper，需要另外设置当前的index及先前的index。  
  19.云函数返回的数据链接里面主要不要含空格，不然会自动带上http：127.0.0.1的前缀，导致请求失败
  ![屏幕快照 2019-10-03 下午10.58.33.png](https://i.loli.net/2019/10/03/OsRMXICAUg2ctBd.png)
  20.分页云函数   
  云函数具体的操作可以参考官方文档及上面所列的视频，这里主要讲一下封装分页云函数。    
  云函数中可以设置接收参数，包括pageIndex、pageSize、filter（筛选项）、云函数名称，根据filter查询出有多少条记录，再根据pageSize计算出有多少页，对比当前pageIndex，判断是否还有数据（hasMore，由于上拉加载下拉刷新），最后把这些计算的结果返回出来。详细代码可以参考`cloudfunctions/recommendList`。    
  在小程序中调用时传入所需的参数，再处理返回的结果。   
  21.获取接口数据不能换行    
  数据库中`/n`，转json后会变成`\\n`，所以不换行，但是前端拿到的时候都是`\n`，这里需要正则转换一下：
  ```
  res.replace('/\\n/g', '\n');
  ```
  22.点赞、评论功能   
  详情页中暂时实现了点赞、评论及回复评论的功能，详情页数据是一个集合，点赞是一个集合，评论也是一个独立的集合，这里把主要的频繁改动的热数据和冷数据分开在不同的集合中，分开存储之后可以采用不同的缓存策略。    
  详情页是根据点击的_id，筛选出对应的记录。集合的字段详见`data/recommend_collection.json`。详情页内的点赞功能会根据当前的是否是已赞状态来判断是点赞还是取消赞，数据结构可以详见`data/like_collection.json`。也可以对文章进行评论或者回复评论，数据结构见`data/comment_collection.json`。评论的列表根据时间进行排序，在输入框直接输入可以进行评论，点击某条评论则对该评论进行回复，但如果点击的是自己的评论则是弹出删除对话框的操作。具体代码都可以参考`components/recommendDetail`。   
  在开发时，首页详情页评论里面的focus，两个input框使用的同一个focus变量，导致一直出现问题，排查了好久才发现两个input框不应该使用同一个变量。这个页面的代码比较多，逻辑也比较多，由于把回复的详情也放在该页面，导致页面的代码结构不是那么清晰，后面再考虑优化。    
  这里要注意一点，remove删除数据库记录，option（回调）是必要参数，否则不会成功，详见[官方文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-client-api/database/doc.remove.html)。
  23.云函数调用失败   
  如下图所示云函数调用失败，有可能有以下一些原因：
  ![屏幕快照 2019-10-05 下午2.52.36.png](https://i.loli.net/2019/10/22/uWl5empxfaK2hM9.png)
    ① 云函数没有部署，或者没有部署成功。   
    ② 创建了多个云开发环境，没有配置对应的环境id。   
    ③ 云函数有错误。   
  24.页面传递参数数据量太大   
    ```
    // 页面传递
    encodeURIComponent(JSON.stringify(obj))
    // 页面接收
    JSON.parse(decodeURIComponent(options.obj))
    ```
  25.鉴权      
  在项目中，有些功能需要用户授权完善个人信息才能继续进行，所以独立写了一个鉴权页面`pages/auth/auth`，用户授权后才会进入到后面的页面。页面效果如下图所示：  
  ![屏幕快照 2019-10-23 下午7.37.46.png](https://i.loli.net/2019/10/23/wgWOdvI23jhz4RZ.png)   
  同意授权按钮的类型为`getUserInfo`，用户点击了授权页面后，可以获取到用户信息，存到本地缓存中，方便其他页面使用。同时获取地理位置信息，存入到缓存中。都成功调用后跳转到首页。    
  之前是把鉴权页面设置为默认入口，判断是否授权，如果已授权会进入到首页，如果没有授权，则停留在授权页面，让用户授权。则但是会有一个问题，当用户授权后，第二次进入页面，会从授权页面一闪而过再进入首页。解决方法：把首页设置为默认入口，在app里面判断是否授权，未授权则跳到授权页。这样就不会用一闪而过的空白页。
## 总结
第一次做小程序，设计数据库还挺好玩的。可能有些集合或者字段的设计不是很合理，可以慢慢优化，而且这个项目还没完成，但是页面基本的功能都涉及了。除了部分页面没有完成，后面还可以加入消息提醒、发布文章、微信支付、模板消息等功能。可以做的东西还是很多的，一步步来完善吧！
