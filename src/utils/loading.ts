export class CloseClassType {
    elementId: string;
    constructor(props: {id: string}) {
        this.elementId = props.id;
    }
    close():void {
        if (document.getElementById(this.elementId)) {
            let element = document.getElementById(this.elementId) as HTMLElement;
            element.remove();
        }
    }
}
interface LoadingType  {
    // @ts-ignore
    service: ({target}: {target: Element}) => CloseClassType;
}
export const Loading: LoadingType = {
    service: (params) => {
        let id = `loading-${new Date().getTime()}`;
        let element = document.createElement('div');
        element.style.width = '100%';
        element.style.height = '100%';
        element.style.position = 'absolute';
        element.style.zIndex = '1000';
        element.style.top = '0';
        element.style.left = '0';
        element.className = 'loadingBox';
        element.id = id;
        let backgroundElement = document.createElement('div');
        backgroundElement.style.background = 'rgba(255, 255, 255, 0.6)';
        backgroundElement.style.width = '100%';
        backgroundElement.style.height = '100%';
        let span = document.createElement('span');
        span.setAttribute('class', 'iconfont iconxuanzhuan loadingIcon');
        element.appendChild(backgroundElement);
        element.appendChild(span);
        params.target.appendChild(element);
        return new CloseClassType({id: id});
    }
}