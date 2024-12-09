
const state ={
    ephemeral_token:null,
    token:null,
    refresh:null,
    expiration:null,
    profile:null,
    profile_type:null
}


const getters = {
    ephToken:(state)=>{
        return state.ephemeral_token

    },
    isLoggedIn: state =>{
        if(state.token && state.expiration){
            const currentTime = new Date().getTime();

            const adjExpirationTime = new Date(state.expiration).getTime()

            const remainingDuration = adjExpirationTime - currentTime


            if(remainingDuration <= 50000){
                state.ephemeral_token = null
                state.token = null
                state.refresh = null
                state.expiration = null
                state.profile = null
                return false
            }else {
                return true
            }

        }else {

            state.ephemeral_token = null
            state.token = null
            state.refresh = null
            state.expiration = null
            state.profile = null
            return false

        }

    },
    isEmployer:state =>{
        if(state.profile_type){
            return state.profile_type === 'employer';
        }else {
            return false
        }

    }
}

const mutations = {
    setToken(state, token) {
        state.token = token
    },
    setRefresh(state, token) {
        state.refresh = token
    },
    setEphToken(state, token) {
        state.ephemeral_token = token
    },
    setProfile(state, profile) {
        state.profile = profile
    },
    setExpiration(state, expiration) {
        state.expiration = expiration
    },
    setProfileType(state, profile_type) {
        state.profile_type = profile_type
    },


}

const actions = {
    setToken({commit}, token) {
        commit('setToken', token)
    },
    setRefresh({commit}, token) {
        commit('setRefresh', token)
    },
    setEphToken({commit}, token) {
        commit('setEphToken', token)
    },
    setProfile({commit}, profile) {
        commit('setProfile', profile)
    },
    setExpiration({commit}, expiration) {
        commit('setExpiration', expiration)
    },
    setProfileType({commit}, profile_type) {
        commit('setProfileType', profile_type)
    },

}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}