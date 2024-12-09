import Api from './Api'

export default {
    patchProfile (user_id,patch_data,auth){
        return Api().put(`apiv1/profile/${user_id}/`,patch_data,auth)
    },
    getProfile (profile_slug,auth){
        return Api().get(`apiv1/profile/${profile_slug}/`,auth)
    },

}
