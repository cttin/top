Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    // url: {
    //   type: String,
    //   value: ''
    // }
    data: {
      type: Object,
      value: null
    }
  },
  data: {

  },
  lifetimes: {
    attached: function() {
      console.log(this.data, 'data')
    },
    // detached: function() {
    //   console.log(data, 'data1')
    // }
  }
});