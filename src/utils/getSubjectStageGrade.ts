export function getSubjectById(id: number): string {
    switch (id){
        case 11:
            return '语文';
        case 12:
            return '数学';
        case 13:
            return '英语';
        case 14:
            return '物理';
        case 15:
            return '化学';
        case 16:
            return '历史';
        case 17:
            return '道德与法治';
        case 18:
            return '地理';
        case 19:
            return '生物';
        case 20:
            return '科学';
        case 21:
            return '历史与社会';
        case 22:
            return '政治';
        case 23:
            return '通用技术';
        case 24:
            return '理综';
        case 25:
            return '文综';
        case 26:
            return '选考科目';
        case 27:
            return '信息技术';
        case 36:
            return '体育';
        default:
            return '暂无数据';
    }
}

export function getStageById(id: number): string {
    switch (id){
        case 11:
            return '小学';
        case 12:
            return '初中';
        case 13:
            return '高中';
        default:
            return '暂无数据';
    }
}

export function getGradeById(id: number): string {
    switch (id){
        case 11:
            return '一年级';
        case 12:
            return '二年级';
        case 13:
            return '三年级';
        case 14:
            return '四年级';
        case 15:
            return '五年级';
        case 16:
            return '六年级';
        case 17:
            return '七年级';
        case 18:
            return '八年级';
        case 19:
            return '九年级';
        case 20:
            return '高一';
        case 21:
            return '高二';
        case 22:
            return '高三';
        default:
            return '暂无数据';
    }
}
