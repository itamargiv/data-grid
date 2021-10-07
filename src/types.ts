export enum Order {
    ASC = 'asc',
    DESC = 'desc',
};

/** @enum {Order} */
export const ORDER = {
    ASC: Order.ASC,
    DESC: Order.DESC,
};

export type Index = string | number;

type Pair<a, b> = [a, b];
export type Keyed<T> = Pair<Index, T>;

export interface Row {
    [key: Index]: any;
}
