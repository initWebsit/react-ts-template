let baseURL: string, textURL: string;
if (process.env.VUE_APP_CURRENTMODE) {
    switch (process.env.VUE_APP_CURRENTMODE) {
        case 'dev_test':
            textURL = '//101.200.120.136:9800/v1';
            break;
        case 'zycs_test':
            textURL = '//zycs.canpoint.net/v1';
            break;
        case 'fdcs_test':
            textURL = '//fdcs.canpoint.net/v1';
            break;
        case 'fdtest_test':
            textURL = '//fdtest.canpoint.net/v1';
            break;
        case 'production':
            textURL = '//ai.canpoint.net/v1';
            break;
        default:
            textURL = '//zycs.canpoint.net/v1';
    }
} else {
    switch (process.env.NODE_ENV) {
        case 'development':
            //本地启动服务所需要的头部
            textURL = '//zycs.canpoint.net/v1'; //作业的测试地址
            break;
        default:
            textURL = '//zycs.canpoint.net/v1';
    }
}

export {
    baseURL,
    textURL
};

// baseURL axios使用，后端请求接口地址的请求头
