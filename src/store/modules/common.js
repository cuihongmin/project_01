import {
  setStore,
  getStore,
  removeStore
} from '@/utils/store'
const common = {
  state: {
    language: getStore({name: 'language'}) || 'zh',
    isCollapse: false,
    },
    mutations: {
        SET_COLLAPSE: (state) => {
            state.isCollapse = !state.isCollapse;
          },
    }
}
export default common