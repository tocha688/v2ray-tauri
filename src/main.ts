import { createApp } from "vue";
import "./styles.scss";
import App from "./App.vue";
import { Quasar, Notify, Dialog, Loading } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

const app = createApp(App)
app.use(Quasar, {
    plugins: {
        Notify, Dialog, Loading
    },
    config: {
        notify: {
            timeout: 2000,
            position: "center"
        },
        loading:{
            delay: 50
        }
    }
})
app.mount("#app");
