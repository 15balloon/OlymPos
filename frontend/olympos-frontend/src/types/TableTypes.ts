export interface ColDef {
    header: string;
    value: string;
    ratio: number;
    extend?: boolean;
}
export interface RowData<T> {
    [key: string]: any | Extend<T>;
    // [key: string]: string | number | boolean | Extend<T> | number[] | null | undefined;
}
interface Extend<T> {
    component: T;
    slot: string | number;
}