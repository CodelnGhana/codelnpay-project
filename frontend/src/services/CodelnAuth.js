import Api from './CodelnApi'

export default {

    login (data){
        return Api().post(`rest-auth/codelnpay_login/`,data)
    },


}