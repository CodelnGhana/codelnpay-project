
const state ={
    theme:"default",

}


const getters = {
    getTheme:(state)=>{
        return state.theme
    },

}

const mutations = {
    setTheme(state, theme) {
        state.theme = theme
    },



}

const actions = {
    setTheme({commit}, theme) {
        commit('setTheme', theme)
    },


}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}