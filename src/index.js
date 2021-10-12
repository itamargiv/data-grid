// TODO: Re-examine instantiation api. For MVP only support array of arrays, array of objects, object of objects.
import { ORDER } from './types';

/**
 * @typedef { import('./types').Index } Index
 * @typedef { import('./types').Keyed<any> } KeyedValue
 * @typedef { import('./types').Order } Order
 * @typedef { import('./types').Row } Row
 */

class DataRow {
    /**
     * @type {ReadonlyMap<Index, any>}
     */
    #map;

    /**
     * DataRow represents a row of data in a data grid.
     * Each piece of data is keyed by it's respective column header.
     *
     * @param {Row} data An object literal where the object keys represent the
     *                   grid columns
     */
    constructor(data) {
        /**
         * @type {Iterable<KeyedValue>}
         */
        const pairs = Object.keys(data).map((key) => [key, data[key]]);

        this.#map = new Map(pairs);
    }

    /**
     * Retrieve the data from the row as a serialized object.
     *
     * @returns {Row}
     */
    get cells() {
        return Array.from(this.#map).reduce(
            (literal, [key, val]) => ({
                [key]: val,
                ...literal,
            }),
            {}
        );
    }

    /**
     * Retrieve data from a row by it's key.
     *
     * @param {Index} c Column name or number to retrieve info from
     * @returns {any}
     */
    get(c) {
        return this.#map.get(c);
    }
}

export default class DataGrid {
    /**
     * @type {DataRow[]}
     */
    #grid;

    /**
     * @type {Index[]}
     */
    #columns;

    /**
     * @type {Intl.Collator}
     */
    #collator;

    /**
     * @type {string}
     */
    #locale;

    /**
     * DataGrid represent an immutable grid of values which can by operated on
     * in the same fashion as arrays. i.e. a grid that can be sorted, filtered,
     * mapped and reduced.
     *
     * @param {Row[]} data An array of object literals where the object keys
     *                        represent the grid columns
     * @param {string} locale A string representing a language locale, such as
     *                        `he`, `fr` or `en-GB`
     */
    constructor(data = [], locale = 'en') {
        this.#columns = data
            .map(Object.keys)
            .reduce(
                (columns, keys) => Array.from(new Set(columns.concat(keys))),
                []
            );

        this.#grid = data.map((row) => new DataRow(row));

        this.#locale = locale;
        this.#collator = new Intl.Collator(this.#locale, {
            numeric: true,
        });
    }

    // TODO: Find a way to represent internal data of grid in a similar fashion  to valueOf
    /**
     * @returns {Row[]}
     */
    get data() {
        return this.#grid.map((row) => row.cells);
    }

    /**
     * Creates a default sorting function for a given column. The default
     * sorting function will order by numeric value first, and the will compare
     * unicode values according to the provided locale.
     *
     * @param {Index} column The column name to sort
     * @param {Order} order The order in which to sort by
     * @returns {(a: any, b: any) => number}
     */
    #defaultSortFor(column, order) {
        return (a, b) => {
            const ordering = this.#collator.compare(a[column], b[column]);
            return order == 'desc' ? -ordering : ordering;
        };
    }

    /**
     * Retrieves an object serialized row from the grid.
     *
     * @param {number} r A row index in the grid to retrieve the row from
     * @returns {Row}
     */
    row(r) {
        return this.#grid[r].cells;
    }

    /**
     * Retrieves a column of values from the grid, by the column name or index.
     *
     * @param {Index} c The column to retrieve values for
     * @returns any[]
     */
    col(c) {
        return this.#grid.map((row) => row.get(c));
    }

    /**
     * Retrieves data from a particular cell in the grid.
     *
     * @param {number} r A row index in the grid to retrieve the row from
     * @param {Index} c An column index to retrieve from the specified row
     * @returns {any}
     */
    get(r, c) {
        return this.#grid[r].get(c);
    }

    /**
     * Maps the grid by it's rows, and returns a new DataGrid with mapped data
     *
     * @param {(Row) => Row} cb A callback to map each row to a new row
     * @returns {DataGrid}
     */
    map(cb) {
        return new DataGrid(this.data.map(cb));
    }

    /**
     * Returns the data of the grid, sorted by a given order
     * for the first column.
     *
     * @param {Order} order The order in which to sort by
     * @returns {DataGrid}
     */
    sort(order = ORDER.ASC) {
        return this.sortWith(this.#defaultSortFor(this.#columns[0], order));
    }

    /**
     * Returns a new grid, sorted by a given sorting function.
     *
     * @param {(a: any, b: any) => number} cb A callback to determine the sort
     *                                        order of two values in the grid
     * @returns {DataGrid}
     */
    sortWith(cb) {
        return new DataGrid(this.data.sort(cb));
    }

    /**
     * Returns a new grid, sorted by a given column with the
     * default sorting function.
     *
     * @param {Index} column A column to sort the data by
     * @param {Order} order The order in which to sort by
     * @returns {DataGrid}
     */
    sortBy(column, order) {
        return this.sortWith(this.#defaultSortFor(column, order));
    }

    /**
     * Returns a new grid, sorted by a given column with the
     * provided sorting function.
     *
     * @param {Index} column A column to sort the data by
     * @param {(a: any, b: any) => number} cb A callback to determine the sort
     *                                        order of two values in the grid
     * @returns {DataGrid}
     */
    sortByWith(column, cb) {
        return this.sortWith((a, b) => cb(a[column], b[column]));
    }

    /**
     * Instantiates a data grid from a two dimensional array
     *
     * @param {any[][]} data A two dimensional array containing values per row
     * @param {Index[]} columns An array of column headers
     */
    static fromArray(data = [], columns = []) {
        const args = data.map((row) =>
            row.reduce(
                (literal, value, i) => ({
                    ...literal,
                    [columns[i] || i]: value,
                }),
                {}
            )
        );

        return new DataGrid(args);
    }
}
