export interface PersonList {
    name: string,
    id: number
}

export interface TableList {
    collectStatus?: boolean,
    key: number,
    id: number,
    personId: number,
    personName: string,
    moduleName: string
}