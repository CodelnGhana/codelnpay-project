import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";
import auth from './modules/auth'
import wallet from "./modules/wallet";
import utils from "./modules/utils"
export default createStore({
    modules:{
        auth,
        wallet,
        utils

    },
    plugins:[
        createPersistedState()
    ]
})