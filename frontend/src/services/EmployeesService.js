import Api from './Api'

export default {
    patchEmployer (profile_slug,employer_id,patch_data,auth){
        return Api().put(`apiv1/update_employer/${profile_slug}/${employer_id}/`,patch_data,auth)
    },
    createEmployer (profile_slug,data,auth){
        return Api().post(`apiv1/create_employer/${profile_slug}/`,data,auth)
    },
    getMyEmployers (profile_slug,auth){
        return Api().get(`apiv1/all_employers/${profile_slug}/`,auth)
    },
    deletetEmployer (profile_slug,employer_id,auth){
        return Api().delete(`apiv1/update_employer/${profile_slug}/${employer_id}/`,auth)
    },

}
