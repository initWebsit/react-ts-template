export const lazyFunc = <T>(callback: () => Promise<T>) => {
    return () => new Promise((resolve: (props: Promise<T>) => void) => {
        setTimeout(() => {
            resolve(callback());
        }, 2000);
    }).then((promiseFunc) => {
        return promiseFunc;
    });
}