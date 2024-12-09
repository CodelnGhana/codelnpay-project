const state = {
    trulyUsd: {
        id: 1,
        provider: 'truly',
        currency: '$',
        balance: 900
    },
    trulyEuro: {
        id: 2,
        provider: 'truly',
        currency: '€',
        balance: 12000
    },
    trulyPound: {
        id: 3,
        provider: 'truly',
        currency: '£',
        balance: 0
    },
    vertoUsd: {
        id: 4,
        provider: 'verto',
        currency: '$',
        balance: 220
    },
    vertoEuro: {
        id: 5,
        provider: 'verto',
        currency: '€',
        balance: 0
    },
    vertoPound: {
        id: 6,
        provider: 'verto',
        currency: '£',
        balance: 0
    },


};


const getters = {};

const mutations = {
    setToken(state, token) {
        state.token = token;
    },


};

const actions = {
    setToken({commit}, token) {
        commit('setToken', token);
    },

};


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};