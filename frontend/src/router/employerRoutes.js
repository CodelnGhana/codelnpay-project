import EmployerDashboardView from "../views/Employers/EmployerDashboardView.vue";
import PayrollManagerView from "../views/Employers/PayrollManagerView.vue";
import RecentPayoutsView from "../views/Employers/RecentPayoutsView.vue";
import EmployeeManagerView from "../views/Employers/EmployeeManagerView.vue";
import InitiatePaymentView from "../views/Employers/InitiatePaymentView.vue";
import PaymentReviewView from "../views/Employers/PaymentReviewView.vue";
import EmployerProfileView from "../views/Employers/EmployerProfileView.vue";
import store from "../store/store";
const employerRoutes = [
    {
        path: '/EmployerDashBoard',
        name: 'EmployerDashBoard',
        component: EmployerDashboardView,
        meta: {
            requiresAuth: true
        },
        beforeEnter: (to, from) => {
            if(!store.getters['auth/isEmployer']){
                return{
                    path: '/DashBoard',
                }
            }

        },
    },
    {
        path: '/EmployeeManager',
        name: 'PayrollManager',
        component: PayrollManagerView,
        meta: {
            requiresAuth: true
        },
        beforeEnter: (to, from) => {
            if(!store.getters['auth/isEmployer']){
                return{
                    path: '/DashBoard',
                }
            }

        },

    },
    {
        path: '/EmployeeManager',
        name: 'EmployeeManager',
        component: EmployeeManagerView,
        meta: {
            requiresAuth: true
        },
        beforeEnter: (to, from) => {
            if(!store.getters['auth/isEmployer']){
                return{
                    path: '/DashBoard',
                }
            }

        },
    },
    {
        path: '/RecentPayouts',
        name: 'RecentPayouts',
        component: RecentPayoutsView,
        meta: {
            requiresAuth: true
        },
        beforeEnter: (to, from) => {
            if(!store.getters['auth/isEmployer']){
                return{
                    path: '/DashBoard',
                }
            }

        },
    },
    {
        path: '/InitiatePayment',
        name: 'InitiatePayment',
        component: InitiatePaymentView,
        meta: {
            requiresAuth: true
        },
        beforeEnter: (to, from) => {
            if(!store.getters['auth/isEmployer']){
                return{
                    path: '/DashBoard',
                }
            }

        },
    },
    {
        path: '/PaymentReview/:invoiceId?',
        name: 'PaymentReview',
        component: PaymentReviewView,
        meta: {
            requiresAuth: true
        },
        beforeEnter: (to, from) => {
            if(!store.getters['auth/isEmployer']){
                return{
                    path: '/DashBoard',
                }
            }

        },
    },
    {
        path: '/MyProfile',
        name: 'MyProfile',
        component: EmployerProfileView,
        meta: {
            requiresAuth: true
        },

    }

]
export default employerRoutes