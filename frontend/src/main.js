import { createApp } from 'vue'

import App from './App.vue'
import Antd from 'ant-design-vue';
import router from './router'
import store from "./store/store";

import './style.css'

import 'ant-design-vue/dist/reset.css';
import * as Sentry from "@sentry/vue";
import { Crisp } from "crisp-sdk-web";

Crisp.configure('c6d46591-a795-4f41-be26-5ab17b1a240f');

const app = createApp(App)
app.use(Antd)
app.use(store)
app.use(router)

if (import.meta.env.NODE_ENV === 'production') {

    Sentry.init({
        app,
        dsn: "https://a7cb5d2c4acb44899894094af37b1320@o4504637988667392.ingest.sentry.io/4505483301486592",
        integrations: [
            new Sentry.BrowserTracing({
                // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
                tracePropagationTargets: ['localhost', /^\//],
                routingInstrumentation: Sentry.vueRouterInstrumentation(router),
            }),
            new Sentry.Replay(),
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
        // Session Replay
        replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
}

app.mount('#app')
