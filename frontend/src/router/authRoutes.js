import Login from "../views/Auth/Login.vue";
import CodelnAuthView from "../views/Auth/CodelnAuth/CodelnAuthView.vue";
import Signup from "../views/Auth/Signup.vue";
import Verify from "../views/Auth/Verify.vue";
import ProfileSelectView from "../views/Auth/ProfileSelectView.vue";
import ForgotPasswordView from "../views/Auth/PasswordChange/ForgotPasswordView.vue";
import ForgotPasswordChangeView from "../views/Auth/PasswordChange/ForgotPasswordChangeView.vue";
const authRoutes = [
    {
        path: '/Login',
        name: 'Login',
        component: Login
    },
    {
        path: '/Signup',
        name: 'Signup',
        component: Signup
    },
    {
        path: '/Verify',
        name: 'Verify',
        component: Verify,
        
    },
    {
        path: '/Register',
        name: 'Register',
        component: ProfileSelectView,

    },
    {
        path: '/CodelnLogin',
        name: 'CodelnLogin',
        component: CodelnAuthView,

    },
    {
        path: '/ForgotPassword',
        name: 'ForgotPassword',
        component: ForgotPasswordView,

    },
    {
        path: '/password_reset_confirm/:uid/:token',
        name: 'ForgotPasswordChange',
        component: ForgotPasswordChangeView,

    },


]
export default authRoutes;