<script setup lang="ts">
import Joi from 'joi';
import { ref, onUnmounted } from 'vue';
import router from '@/router';
import { Notivue, Notification, push } from 'notivue';


import InputLogin from '@/components/inputs/InputLogin.vue';
import ValidateMessage from '@/components/validates/ValidateMessage.vue';
import ValidateLogin from '@/validations/ValidateLogin';
import { newValidateObj, initValidateObj } from '@/validations/ValidateCommon';

import LogoText from '@/components/logo/LogoText.vue';
import ButtonBig from '@/components/buttons/ButtonBig.vue';

import LoginApi from '@/apis/LoginApi'

const loginValue = ref({
    userId: '',
    userPw: ''
});
const memorizeId = ref(false);
const getCookie = (name = 'memorizeId') => {
    const matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    if (matches) {
        memorizeId.value = true;
        loginValue.value.userId = matches[1];
    }
    else {
        memorizeId.value = false;
    }
}
getCookie();

const cookieInfo = ref({
    cookieName: 'memorizeId',
    cookieValue: '',

})
const changeCookieSetting = () => {
    cookieInfo.value.cookieValue = loginValue.value.userId;
}
const setCookieForMemorizeId = () => {
    if (memorizeId.value) {
        const offset = 1000 * 60 * 60 * 9;
        let date: string | Date = new Date(Date.now() + offset + 86400e3 * 7);
        date = date.toUTCString();
        document.cookie = `${cookieInfo.value.cookieName}=${cookieInfo.value.cookieValue}; expires=${date}`;
    }
    else {
        document.cookie = `${cookieInfo.value.cookieName}=${cookieInfo.value.cookieValue}; max-age=0`;
    }
}

const schema = Joi.object({
    isErrorLoginId: Joi.string().required(),
    isErrorLoginPw: Joi.string().required()
});
let validateObj = ref(newValidateObj({
    isErrorLoginId: false,
    isErrorLoginPw: false
}));
const validate = () => {
    return schema.validate({ isErrorLoginId: loginValue.value.userId, isErrorLoginPw: loginValue.value.userPw }, { abortEarly: false });
}
const isLoginLoading = ref(false);

const login = async () => {
    if (isLoginLoading.value) return;

    isLoginLoading.value = true;

    initValidateObj(validateObj.value);

    const validateResult = validate();
    if (validateResult.error) {
        handlerValidateError(validateResult.error.details);

        isLoginLoading.value = false;
        return;
    }

    try {
        const res = await LoginApi.login(loginValue.value);
        if (res?.accessToken) {
            handleSuccessfulLogin(res.accessToken)
        }

    } catch (err: any) {
        push.error({
            title: '에러',
            message: err.message || 'server error',
        });
    }
    finally {
        isLoginLoading.value = false;
    }
}
const handlerValidateError = (errorDetails: any[]) => {
    errorDetails.forEach(element => {
        if (element?.context?.key) {
            validateObj.value[element.context.key] = true;
        }
    });
}
const handleSuccessfulLogin = (accessToken: string) => {
    if (memorizeId.value) {
        changeCookieSetting()
        setCookieForMemorizeId();
    }

    sessionStorage.setItem('access_token', accessToken);

    router.push({ path: '/store' });
}

onUnmounted(() => {
    push.destroyAll();
});
</script>

<template>
    <main>
        <Notivue v-slot="item">
            <Notification :item="item" />
        </Notivue>

        <div class="login-wrapper">
            <LogoText />

            <div class="login-box">
                <h2 class="login-title">로그인</h2>
                <h4 class="login-sub-title">아이디와 비밀번호를 입력하세요.</h4>
                <form @submit.prevent>
                    <div class="form-row login-id">
                        <InputLogin :type="'text'" :placeholder="'아이디'" v-model="loginValue.userId" />
                        <ValidateMessage v-if="validateObj?.isErrorLoginId" :error-msg="ValidateLogin.userId" />
                    </div>
                    <div class="form-row login-pw">
                        <InputLogin :type="'password'" :placeholder="'비밀번호'" v-model="loginValue.userPw"
                            @keyup.enter="login" />
                        <ValidateMessage v-if="validateObj?.isErrorLoginPw" :error-msg="ValidateLogin.userPw" />
                    </div>
                </form>
                <div class="memorize-id">
                    <input type="checkbox" id="memorize-id" v-model="memorizeId">
                    <label for="memorize-id">아이디 저장</label>
                </div>
                <ButtonBig @click="login">로그인</ButtonBig>
            </div>
            <span class="create-id"><router-link :to="{ path: '/sign-up/user-name' }">계정 만들기</router-link></span>
        </div>
    </main>
</template>

<style scoped>
main {
    margin: 0 auto;
    width: 50%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--main-black);
}

.logo {
    text-align: center;
}

.login-title,
.login-sub-title {
    text-align: center;
}

.login-sub-title {
    margin-top: 14px;
}

.login-box {
    margin: 23px 0;
    padding: 51px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 450px;
    height: auto;
    min-height: 500px;
    border: 1px solid #CACACA;
    border-radius: 5px;
}

.login-box form {
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    width: -webkit-fill-available;
    gap: 23px;
}

.form-row {
    position: relative;
}

.button-big {
    padding: 13px 15px;
    width: -webkit-fill-available;
    height: 52px;
    font-size: 17px;
    border-radius: 5px;
}

.memorize-id input {
    border: 1px solid var(--main-gray-3);
}

.button-big {
    margin-top: 45px;
    border: 0;
    background-color: var(--main);
    color: var(--main-white);
}

.memorize-id {
    margin-top: 13px;
    display: flex;
    align-items: center;
}

.memorize-id input[type="checkbox"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 3px;
    cursor: pointer;
    height: 16px;
    outline: 0;
    width: 16px;
}

.memorize-id input[type="checkbox"]::after {
    border: solid #fff;
    border-width: 0 2px 2px 0;
    content: '';
    display: none;
    height: 60%;
    left: 37%;
    position: relative;
    top: 10%;
    transform: rotate(45deg);
    width: 35%;
}

.memorize-id input[type="checkbox"]:checked {
    background: var(--main-success);
}

.memorize-id input[type="checkbox"]:checked::after {
    display: block;
}

.memorize-id label {
    margin-left: 9px;
    color: var(--main-black-soft);
}

.create-id {
    color: var(--main-success);
    font-size: 14px;
    font-weight: 500;
}
</style>