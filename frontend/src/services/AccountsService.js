import Api from './Api'

export default {
    patchAccount (profile_slug,account_id,patch_data,auth){
        return Api().put(`apiv1/update_account/${profile_slug}/${account_id}/`,patch_data,auth)
    },
    createAccount (profile_slug,data,auth){
        return Api().post(`apiv1/create_account/${profile_slug}/`,data,auth)
    },
    getMyAccounts (profile_slug,auth){
        return Api().get(`apiv1/all_accounts/${profile_slug}/`,auth)
    },

}
