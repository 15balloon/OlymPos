import DefaultAxios from '@/apis/DefaultApi'
import { push } from 'notivue';
import { API_CODE } from '@/constants/ApiCodeConstant';
import router from '@/router';

interface LoginValue {
    userId: string;
    userPw: string;
}

const LoginApi = {
    async login(args: LoginValue) {
        const notification = push.promise({
            title: '로그인 중...',
            duration: undefined
        });

        const params = {
            user_id: args.userId,
            user_pwd: args.userPw
        }
        return await DefaultAxios.post('/admin-login', params)
            .then(res => {
                if (res.data.code === 100 && res.data.result === "Success") {
                    return { accessToken: res.data.access_token };
                }
                else {
                    throw new Error(res.data.code);
                }
            })
            .catch(err => {
                notification.reject({
                    title: API_CODE[err.message] || '로그인 실패',
                    duration: undefined
                });
            });
    },
    async logout() {
        return await DefaultAxios.post('/admin-logout', {}, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
            }
        })
            .then(res => {
                if (res.data.code === 100 && res.data.result === "Success") {
                    sessionStorage.clear();
                    router.push('/login');
                }
                else {
                    throw new Error(res.data.code);
                }
            })
    }
}
export default LoginApi;