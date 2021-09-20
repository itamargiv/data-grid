type Index = number | string;
type Pair<a, b> = readonly [a, b];
type KeyPair<Type> = Pair<Index, Type>;
type KeyPairArray<Type> = readonly KeyPair<Type>[];
type Order = 'asc' | 'desc';
type Sorter<Type> = (a: Type, b: Type) => number;
type Reducer<From, To> = (acc: To, val: From) => To;

type GridParams = [readonly any[][], readonly Index[]];

class DataRow {
    #columns: readonly Index[];
    #map: ReadonlyMap<Index, any>;

    constructor(data: readonly any[], columns: readonly Index[] = []) {
        this.#columns = columns;
        const pairs = data.map((value: any, i: number) => [
            this.#columns[i] ? this.#columns[i] : i,
            value,
        ]) as KeyPair<any>[];

        this.#map = new Map(pairs);
    }

    get cells(): Object {
        return Array.from(this.#map).reduce(
            (literal: Object, [key, val]: KeyPair<any>) => ({
                [key]: val,
                ...literal,
            }),
            {}
        );
    }

    get(c: Index) {
        return this.#map.get(c);
    }
}

export default class DataGrid {
    #grid: readonly DataRow[];
    #columns: readonly Index[];
    #collator: Intl.Collator;
    #locale: string;

    constructor(
        data: readonly any[][] = [],
        columns: readonly Index[] = [],
        locale: string = 'en'
    ) {
        this.#grid = data.map((row: any[]) => new DataRow(row, columns));
        this.#columns = columns;
        this.#locale = locale;
        this.#collator = new Intl.Collator(this.#locale, {
            numeric: true,
        });
    }

    /**
     * TODO: Find a way to represent internal data of grid in a similar fashion
     *       to valueOf
     */
    get data(): Object[] {
        return this.#grid.map((row) => row.cells);
    }

    #defaultSortFor(column: Index, order: Order): Sorter<Object> {
        return (a, b) => {
            const ordering = this.#collator.compare(a[column], b[column]);
            return order == 'desc' ? -ordering : ordering;
        };
    }

    row(r: number): Object {
        return this.#grid[r].cells;
    }

    col(c: Index): any[] {
        return this.#grid.map((row) => row.get(c));
    }

    get(r: number, c: Index): any {
        return this.#grid[r].get(c);
    }

    sort(order: Order = 'asc'): Object[] {
        return this.data.sort(this.#defaultSortFor(this.#columns[0], order));
    }

    sortWith(cb: Sorter<Object>): Object[] {
        return this.data.sort(cb);
    }

    sortBy(column: Index, order: Order = 'asc'): Object[] {
        return this.sortWith(this.#defaultSortFor(column, order));
    }

    sortByWith(column: Index, cb: Sorter<any>): Object[] {
        return this.sortWith((a, b) => cb(a[column], b[column]));
    }

    static fromPairs(data: readonly KeyPairArray<any>[]): DataGrid {
        const pairReducer: Reducer<KeyPairArray<any>, GridParams> = (
            acc,
            row
        ) => {
            const headers = row.map((pair) => pair[0]);
            const values = row.map((pair) => pair[1]);

            return [
                acc[0].concat([values]),
                acc[1].length < headers.length ? headers : acc[1],
            ];
        };

        const args = data.reduce(pairReducer, [[], []]);
        return new DataGrid(...args);
    }

    static fromObjects(data: readonly Object[]): DataGrid {
        return DataGrid.fromPairs(
            data.map((literal) => Object.entries(literal))
        );
    }

    static fromMaps(data: ReadonlyMap<Index, any>[]): DataGrid {
        return DataGrid.fromPairs(
            data.map((rowMap) => Array.from(rowMap.entries()))
        );
    }
}
