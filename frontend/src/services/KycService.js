import Api from './kycApi'

export default {
    patchEmployer (profile_slug,employer_id,patch_data,auth){
        return Api().put(`apiv1/update_employer/${profile_slug}/${employer_id}/`,patch_data,auth)
    },
    createUser (data,auth){
        return Api().post(`/api/users`,data,auth)
    },
    getUsers (auth){
        return Api().get(`/api/users`,auth)
    },
    getUser (id,auth){
        return Api().get(`/api/users/${id}`,auth)
    },
    getMagicLink (id,data,auth){
        return Api().post(`/api/users/${id}/verify-url`,data,auth)
    },
    deletetEmployer (profile_slug,employer_id,auth){
        return Api().delete(`apiv1/update_employer/${profile_slug}/${employer_id}/`,auth)
    },

}
