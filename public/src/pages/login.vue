<template>
    <div class="login-page">
        <div class="login-card">
            <img src="static/logo.png" alt="Assetto Corsa Competizione" class="login-logo" />

            <h1 class="login-title">{{ $t("title") }}</h1>
            <p class="login-subtitle">{{ $t("subtitle") }}</p>

            <form v-on:submit.prevent="login" class="login-form">
                <field
                    type="password"
                    :label="$t('password_label')"
                    :placeholder="$t('password_placeholder')"
                    :error="error"
                    v-model="password"
                ></field>

                <input class="primary login-submit" type="submit" :value="$t('submit_value')" />
            </form>
        </div>

        <end></end>
        <error></error>
    </div>
</template>

<script>
import axios from "axios";
import {field, end, error} from "../components";

export default {
    components: {field, end, error},
    data() {
        return {
            password: "",
            error: ""
        };
    },
    methods: {
        login() {
            axios.post("/api/login", {password: this.password})
                .then(r => {
                    this.$store.commit("login", {
                        token: r.data.token,
                        admin: r.data.admin,
                        mod: r.data.mod,
                        read_only: r.data.read_only
                    });
                    this.$router.push("/");
                })
                .catch(() => {
                    this.error = this.$t("password_error");
                });
        }
    }
}
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    box-sizing: border-box;
}

.login-card {
    width: 100%;
    max-width: 400px;
    padding: 40px 32px 32px;
    background: linear-gradient(180deg, #121826 0%, #11172380 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.45);
    text-align: center;
    animation: login-in 350ms cubic-bezier(0.16, 1, 0.3, 1);
}

.login-logo {
    display: block;
    margin: 0 auto 24px;
    max-width: 160px;
    max-height: 160px;
    filter: drop-shadow(0 8px 24px rgba(255, 46, 77, 0.25));
}

.login-title {
    height: auto !important;
    display: block !important;
    justify-content: center;
    font-size: 26px !important;
    font-weight: 700;
    color: #e6ecf5;
    margin: 0 0 6px !important;
    letter-spacing: -0.3px;
    text-align: center;
}

.login-subtitle {
    color: #a3b1c6;
    font-size: 13px;
    margin: 0 0 28px;
}

.login-form {
    text-align: left;
}

.login-submit {
    width: 100%;
    margin-top: 14px !important;
    padding: 12px !important;
    font-size: 15px !important;
    font-weight: 600;
}

@keyframes login-in {
    from { opacity: 0; transform: translateY(12px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}

@media (max-width: 480px) {
    .login-card {
        padding: 30px 22px 22px;
        border-radius: 12px;
    }
    .login-logo { max-width: 130px; }
    .login-title { font-size: 22px !important; }
}
</style>

<i18n>
{
    "en": {
        "title": "Login",
        "subtitle": "Sign in to manage your ACC servers",
        "password_label": "Password",
        "password_placeholder": "Enter your password",
        "password_error": "Password incorrect",
        "submit_value": "Login"
    },
    "id": {
        "title": "Masuk",
        "subtitle": "Masuk untuk mengelola server ACC Anda",
        "password_label": "Kata sandi",
        "password_placeholder": "Masukkan kata sandi",
        "password_error": "Kata sandi salah",
        "submit_value": "Masuk"
    }
}
</i18n>
