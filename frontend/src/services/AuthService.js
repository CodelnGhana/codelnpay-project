import Api from './Api'

export default {
    register (credentials){
        return Api().post('api-auth/registration/',credentials)
    },
    login (credentials){
        return Api().post('auth/login/',credentials)
    },
    verifyCode(credentials){
        return Api().post('auth/login/code/',credentials)
    },
    forgot (email){
        return Api().post('api-auth/password/reset/',email)
    },
    reset (credentials){
        return Api().post('api-auth/password/reset/confirm/',credentials)
    }
}
