import Api from './Api'

export default {

    createCryptoWallet (profile_slug,cryptoWalletObj,auth){
        return Api().post(`apiv1/create_crypto_account/${profile_slug}/`,cryptoWalletObj,auth)
    },
    updateCryptoWallet (profile_slug,wallet_id,patch_data,auth){
        return Api().put(`apiv1/update_crypto_account/${profile_slug}/${wallet_id}/`,patch_data,auth)
    },
    getMyCryptoWallet(profile_slug,auth){
        return Api().get(`apiv1/all_crypto_accounts/${profile_slug}/`,auth)
    },
    getCryptoPaymentLink(invoice_id,auth){
        return Api().get(`apiv1/create_payment_page/${invoice_id}/`,auth)
    },
    getCryptoPaymentTemplate(invoice_id,auth){
        return Api().get(`apiv1/create_template_page/${invoice_id}/`,auth)
    },


}
