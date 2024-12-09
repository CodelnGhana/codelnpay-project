import Api from './Api'

export default {
    createUsdWithdrawRequest (profile_slug,withdrawObj,auth){
        return Api().post(`apiv1/create_usd_withdrawal_request/${profile_slug}/`,withdrawObj,auth)
    },
    createLocalWithdrawRequest (profile_slug,withdrawObj,auth){
        return Api().post(`apiv1/create_local_withdrawal_request/${profile_slug}/`,withdrawObj,auth)
    },
    createWallet (profile_slug,walletObj,auth){
        return Api().post(`apiv1/create_wallet/${profile_slug}/`,walletObj,auth)
    },
    getMyWallets (profile_slug,auth){
        return Api().get(`apiv1/all_wallets/${profile_slug}/`,auth)
    },
    getforexRate(from,to,auth){
        return Api().get(`apiv1/get_forex_rate/${from}/${to}`,auth)
    },
    getforexCurrencies(auth){
        return Api().get(`apiv1/get_fx_currencies`,auth)
    },
    createForexTrade(profile_slug,forexObj,auth){
        return Api().post(`apiv1/create_forex_trade/${profile_slug}/`,forexObj,auth)
    },
    getWithdrawals(profile_slug,auth){
        return Api().get(`apiv1/all_withdrawal_requests/${profile_slug}`,auth)
    },
    getLocalWithdrawals(profile_slug,auth){
        return Api().get(`apiv1/all_local_withdrawal_requests/${profile_slug}`,auth)
    },
    getGlobalWalletWithdrawals(wallet_id,auth){
        return Api().get(`apiv1/global_wallet_details/${wallet_id}/`,auth)
    },
    getLocalWalletWithdrawals(wallet_id,auth){
        return Api().get(`apiv1/local_wallet_details/${wallet_id}/`,auth)
    },

}
