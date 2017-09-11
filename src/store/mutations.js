
// 状态值的改变方法,操作状态值
// 提交mutations是更改Vuex状态的唯一方法

const mutations = {
  UPDATE_LOADING(state,data){
    state.loading = data;
  }
};

export default mutations;
