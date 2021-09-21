type Index = number | string;

type Pair<a, b> = readonly [a, b];
type KeyPair<Type> = Pair<Index, Type>;
type KeyPairArray<Type> = readonly KeyPair<Type>[];

type Order = 'asc' | 'desc';

type Sorter<Type> = (a: Type, b: Type) => number;
type Reducer<From, To> = (acc: To, val: From) => To;

type Row = ReadonlyMap<Index, any> | DataRow;
type Grid = ReadonlyMap<Index, Row> | DataGrid;

class DataRow {
    #columns: readonly Index[];
    #row: ReadonlyMap<Index, any>;

    constructor(row: Row) {
        this.#row = new Map(row.entries());
        this.#columns = Array.from(this.#row.keys());
    }

    get columns(): readonly Index[] {
        return this.#columns;
    }

    get cells(): Object {
        return Array.from(this.#row).reduce(
            (literal: Object, [key, val]: KeyPair<any>) => ({
                [key]: val,
                ...literal,
            }),
            {}
        );
    }

    entries(): KeyPairArray<any> {
        return Array.from(this.#row.entries());
    }

    get(c: Index): any {
        return this.#row.get(c);
    }

    static fromArray(
        data: readonly any[],
        columns: readonly Index[] = []
    ): DataRow {
        const pairs = data.map((value: any, i: number) => [
            columns[i] ? columns[i] : i,
            value,
        ]) as KeyPairArray<any>;

        return new DataRow(new Map(pairs));
    }
}

export default class DataGrid {
    #grid: ReadonlyMap<Index, DataRow>;
    #columns: readonly Index[];
    #collator: Intl.Collator;
    #locale: string;

    constructor(grid: Grid = new Map(), locale: string = 'en') {
        this.#grid = new Map(this.#parseRows(grid));
        this.#columns = Array.from(this.#parseColumns());
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
        return Array.from(this.#grid).map(([_, row]) => row.cells);
    }

    #parseColumns(): ReadonlySet<Index> {
        const columnsReducer: Reducer<DataRow, Set<Index>> = (columns, row) => {
            row.columns.forEach((column) => columns.add(column));

            return columns;
        };

        return Array.from(this.#grid.values()).reduce(
            columnsReducer,
            new Set()
        );
    }

    #parseRows(map: Grid): KeyPairArray<DataRow> {
        return Array.from(map.entries()).map(([key, value]) => [
            key,
            new DataRow(value),
        ]);
    }

    #defaultSortFor(column: Index, order: Order): Sorter<Object> {
        return (a, b) => {
            const ordering = this.#collator.compare(a[column], b[column]);
            return order == 'desc' ? -ordering : ordering;
        };
    }

    row(r: Index): Object {
        return this.#grid.get(r).cells;
    }

    col(c: Index): any[] {
        return Array.from(this.#grid.values()).map((row) => row.get(c));
    }

    get(r: number, c: Index): any {
        return this.#grid.get(r).get(c);
    }

    entries(): KeyPairArray<any> {
        return Array.from(this.#grid).map(([key, row]) => [key, row.entries()]);
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

    static fromArray(
        data: readonly any[][],
        columns: readonly Index[] = []
    ): DataGrid {
        const map = new Map(
            data.map((row, i) => [i, DataRow.fromArray(row, columns)])
        );

        return new DataGrid(map);
    }

    static fromPairs(data: readonly KeyPairArray<any>[]): DataGrid {
        const grid = new Map(data.map((pairs, i) => [i, new Map(pairs)]));

        return new DataGrid(grid);
    }

    static fromObjects(data: readonly Object[]): DataGrid {
        const grid = new Map(
            data.map((literal, i) => [i, new Map(Object.entries(literal))])
        );

        return new DataGrid(grid);
    }

    static fromMaps(data: ReadonlyMap<Index, any>[]): DataGrid {
        const grid = new Map(data.map((map, i) => [i, map]));

        return new DataGrid(grid);
    }
}
