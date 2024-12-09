import Api from './Api'

export default {

    createInvoice (profile_slug,data,auth){
        return Api().post(`apiv1/create_invoice/${profile_slug}/`,data,auth)
    },
    getMyInvoices (profile_slug,auth){
        return Api().get(`apiv1/all_invoices/${profile_slug}/`,auth)
    },
    getInvoice (invoice_id){
        return Api().get(`apiv1/get_invoice/${invoice_id}/`)
    },
    otpAuth (invoice_id,data){
        return Api().post(`apiv1/get_invoice/${invoice_id}/`,data)
    },
    deleteInvoice (profile_slug,invoice_id,auth){
        return Api().delete(`apiv1/update_invoice/${profile_slug}/${invoice_id}`,auth)
    },


}
