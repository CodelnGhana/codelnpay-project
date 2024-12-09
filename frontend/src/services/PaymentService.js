import Api from './Api'

export default {
    patchPayment (profile_slug,payment_id,patch_data,auth){
        return Api().patch(`apiv1/update_payment/${profile_slug}/${payment_id}/`,patch_data,auth)
    },
    patchBulkPayment (profile_slug,bulk_payment_id,patch_data,auth){
        return Api().patch(`apiv1/update_bulk_payment/${profile_slug}/${bulk_payment_id}/`,patch_data,auth)
    },
    createPayment (profile_slug,data,auth){
        return Api().post(`apiv1/create_payment/${profile_slug}/`,data,auth)
    },
    createBulkPayment (profile_slug,data,auth){
        return Api().post(`apiv1/create_bulk_payment/${profile_slug}/`,data,auth)
    },
    getMyPayments (profile_slug,auth){
        return Api().get(`apiv1/all_payments/${profile_slug}/`,auth)
    },
    getMyBulkPayments (profile_slug,auth){
        return Api().get(`apiv1/all_bulk_payments/${profile_slug}/`,auth)
    },
    getMyBulkPayment (payment_id){
        return Api().get(`apiv1/get_bulk_payment/${payment_id}/`)
    },
    getMyPayment (payment_id,auth){
        return Api().get(`apiv1/get_payment/${payment_id}/`,auth)
    },
    getMyInvitations (email,auth){
        return Api().get(`apiv1/get_invitations/${email}/`,auth)
    },
    deletePayout (profile_slug,payment_id,auth){
        return Api().delete(`apiv1/update_payment/${profile_slug}/${payment_id}/`,auth)
    },
    deleteBulkPayout (profile_slug,payment_id,auth){
        return Api().delete(`apiv1/update_bulk_payment/${profile_slug}/${payment_id}/`,auth)
    },

}
