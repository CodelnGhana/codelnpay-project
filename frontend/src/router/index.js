import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '../views/HomeView.vue';
import authRoutes from "./authRoutes";
import employeeRoutes from "./employeeRoutes";
import employerRoutes from "./employerRoutes";
import kycView from "../views/kyc/kycView.vue";
import InvoiceView from "../views/Invoices/InvoiceView.vue";
import BulkInvoiceView from "../views/Invoices/BulkInvoiceView.vue";
import Pricing from "../views/InfoPages/Pricing.vue";
import Privacy from "../views/InfoPages/Privacy.vue";
import Attributions from "../views/InfoPages/Attributions.vue"
import store from "../store/store";
import notFound from "../components/404/notFound.vue";
import { Crisp } from "crisp-sdk-web";
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomeView
        },
        {
            path: '/getVerified',
            name: 'kycView',
            component: kycView
        },
        {
            path: '/Pricing',
            name: 'Pricing',
            component: Pricing
        },
        {
            path: '/PrivacyPolicy',
            name: 'Privacy',
            component: Privacy
        },
        {
            path: '/Attributions',
            name: 'Attributions',
            component: Attributions
        },
        {
            path: '/Invoice/:invoiceId?',
            name: 'InvoiceView',
            component: InvoiceView
        },
        {
            path: '/PayrollInvoice/:invoiceId?',
            name: 'BulkInvoiceView',
            component: BulkInvoiceView
        },
        ...authRoutes,
        ...employeeRoutes,
        ...employerRoutes,
        { path: '/:pathMatch(.*)*', name: 'not-found', component: notFound }

    ],
    scrollBehavior(to, from, savedPosition) {
        // always scroll to top
        return { top: 0 }
    },
});

router.beforeEach((to, from) => {


    if (to.meta.requiresAuth && !store.getters["auth/isLoggedIn"]) {
        return {
            path: '/Login',
        }
    }

    let noCrispRoutesNames = []

    employeeRoutes.forEach(route=>noCrispRoutesNames.push(route.name))
    employerRoutes.forEach(route=>noCrispRoutesNames.push(route.name))
    if(noCrispRoutesNames.includes(to.name)){
        Crisp.chat.hide();
        noCrispRoutesNames= []
    }else {
        Crisp.chat.show();
        noCrispRoutesNames= []
    }


})
export default router;
