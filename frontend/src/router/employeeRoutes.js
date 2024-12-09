import DashBoard from "../views/Employees/DashBoardView.vue";
import CreateInvoice from "../views/Employees/CreateInvoiceView.vue";
import ManageEmployers from "../views/Employees/ManageEmployersView.vue";
import AllInvoices from "../views/Employees/AllInvoicesView.vue";
import AccountsManager from "../views/Employees/BankAccountsView.vue";
import PaymentInvitationsView from "../views/Employees/PaymentInvitationsView.vue";
import EmployeeProfileView from "../views/Employees/EmployeeProfileView.vue";
import WalletView from "../views/Wallets/WalletView.vue";
import AllWithdrawals from "../views/Employees/AllWithdrawals.vue";
import CryptoAccountView from "../views/Employees/CryptoAccountView.vue";
const employeeRoutes =[
    {
        path: '/DashBoard',
        name: 'DashBoard',
        component: DashBoard,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/CreateInvoice',
        name: 'CreateInvoice',
        component: CreateInvoice,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/ManageEmployers',
        name: 'ManageEmployers',
        component: ManageEmployers,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/AllInvoices',
        name: 'AllInvoices',
        component: AllInvoices,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/AccountsManager',
        name: 'AccountsManager',
        component: AccountsManager,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/PaymentInvitations',
        name: 'PaymentInvitations',
        component: PaymentInvitationsView,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/ProfileManager',
        name: 'ProfileManager',
        component: EmployeeProfileView,
        meta: {
            requiresAuth: true
        },

    },
    {
        path: '/ManageWallet/:WalletType',
        name: 'ManageWallet',
        component: WalletView,
        meta: {
            requiresAuth: true
        },

    },
    {
        path: '/AllWithdrawals',
        name: 'AllWithdrawals',
        component: AllWithdrawals,
        meta: {
            requiresAuth: true
        },

    },
    {
        path: '/CryptoWallets',
        name: 'CryptoWallets',
        component: CryptoAccountView,
        meta: {
            requiresAuth: true
        },

    }

]
export default employeeRoutes