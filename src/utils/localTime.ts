/* 时间格式转换方法 */
function timeType (m: number): string {
    return m < 10 ? '0' + m : '' + m;
}
/* 获取本地时间(区别UTC时区) */
export function getLocalTime(timeNumber: number, type?: string): string {
    /* timeNumber是整数，否则要parseInt转换 */
    let time = new Date(timeNumber);
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let mm = time.getMinutes();
    let s = time.getSeconds();
    if (type === 'hmm') {
        return timeType(h) + ':' + timeType(mm);
    } else if(type === 'ymdhmm') {
        return y + '-' + timeType(m) + '-' + timeType(d) + ' ' + timeType(h) + ':' + timeType(mm);
    } else if(type === 'ym') {
        return y + '-' + timeType(m);
    } else if(type === 'ymd') {
        return y + '-' + timeType(m) + '-' + timeType(d);
    } else {
        return y + '-' + timeType(m) + '-' + timeType(d) + ' ' + timeType(h) + ':' + timeType(mm) + ':' + timeType(s);
    }
}
