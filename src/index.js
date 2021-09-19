class DataRow {
    #columns = null;
    #map = null;

    constructor(data, columns = []) {
        this.#columns = columns;
        const pairs = data.map((value, i) => [
            this.#columns[i] ? this.#columns[i] : i,
            value,
        ]);

        this.#map = new Map(pairs);
    }

    get cells() {
        return Array.from(this.#map).reduce(
            (literal, [key, val]) => ({
                [key]: val,
                ...literal,
            }),
            {}
        );
    }

    get(c) {
        return this.#map.get(c);
    }
}

class DataGrid {
    #grid = null;
    #columns = [];
    #collator = null;
    #locale;

    constructor(data = [], columns, locale = 'en') {
        this.#grid = data.map((row) => new DataRow(row, columns));
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
    get data() {
        return this.#grid.map((row) => row.cells);
    }

    #defaultSortFor(column, order) {
        return (a, b) => {
            const ordering = this.#collator.compare(a[column], b[column]);
            return order == 'desc' ? -ordering : ordering;
        };
    }

    row(r) {
        return this.#grid[r].cells;
    }

    col(c) {
        return this.#grid.map((row) => row.get(c));
    }

    get(r, c) {
        return this.#grid[r].get(c);
    }

    sort(order = 'asc') {
        return this.data.sort(this.#defaultSortFor(this.#columns[0], order));
    }

    sortWith(cb) {
        return this.data.sort(cb);
    }

    sortBy(column, order) {
        return this.sortWith(this.#defaultSortFor(column, order));
    }

    sortByWith(column, cb) {
        return this.sortWith((a, b) => cb(a[column], b[column]));
    }

    static fromPairs(data) {
        const pairReducer = (acc, row) => {
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

    static fromObjects(data) {
        return DataGrid.fromPairs(
            data.map((literal) => Object.entries(literal))
        );
    }

    static fromMaps(data) {
        return DataGrid.fromPairs(
            data.map((rowMap) => Array.from(rowMap.entries()))
        );
    }
}

module.exports = DataGrid;
