// TODO: Re-examine instantiation api. For MVP only support array of arrays, array of objects, object of objects.

// @ts-check

import { ORDER } from './types';

/**
 * @typedef { import('./types').Index } Index
 * @typedef { import('./types').Keyed<any> } KeyedValue
 * @typedef { import('./types').Order } Order
 * @typedef { import('./types').Row } Row
 */

class DataRow {
    /**
     * @type {Index[]}
     */
    #columns;

    /**
     * @type {ReadonlyMap<Index, any>}
     */
    #map;

    /**
     * DataRow represents a row of data in a data grid.
     * Each piece of data is keyed by it's respective column header.
     *
     * @param {any[]} data An array of the row's data
     * @param {Index[]} columns An array of column headers
     */
    constructor(data, columns = []) {
        this.#columns = columns;

        /**
         * @type {Iterable<KeyedValue>}
         */
        const pairs = data.map((value, i) => [
            this.#columns[i] ? this.#columns[i] : i,
            value,
        ]);

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
     * @param {any[][]} data A two dimensional array containing values per row
     * @param {Index[]} columns An array of column headers
     * @param {string} locale A string representing a language locale, such as
     *                        `he`, `fr` or `en-GB`
     */
    constructor(data = [], columns = [], locale = 'en') {
        this.#grid = data.map((row) => new DataRow(row, columns));
        this.#columns = columns;
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
     * Returns the data of the grid, sorted by a given order
     * for the first column.
     *
     * @param {Order} order The order in which to sort by
     * @returns {Row[]}
     */
    sort(order = ORDER.ASC) {
        return this.sortWith(this.#defaultSortFor(this.#columns[0], order));
    }

    /**
     * Returns the data of the grid, as sorted by a given sorting function.
     *
     * @param {(a: any, b: any) => number} cb A callback to determine the sort
     *                                        order of two values in the grid
     * @returns {Row[]}
     */
    sortWith(cb) {
        return this.data.sort(cb);
    }

    /**
     * Returns the data of the grid, as sorted by a given column with the
     * default sorting function.
     *
     * @param {Index} column A column to sort the data by
     * @param {Order} order The order in which to sort by
     * @returns {Row[]}
     */
    sortBy(column, order) {
        return this.sortWith(this.#defaultSortFor(column, order));
    }

    /**
     * Returns the data of the grid, as sorted by a given column with the
     * provided sorting function.
     *
     * @param {Index} column A column to sort the data by
     * @param {(a: any, b: any) => number} cb A callback to determine the sort
     *                                        order of two values in the grid
     * @returns {Row[]}
     */
    sortByWith(column, cb) {
        return this.sortWith((a, b) => cb(a[column], b[column]));
    }

    /**
     * Instantiates a data grid from an array of object literals
     *
     * @param {Object[]} data An array of objects where the object keys
     *                        represent the grid columns
     * @returns DataGrid
     */
    static fromObjects(data) {
        const args = data.reduce(
            ([grid, cols], literal) => {
                const headers = Object.keys(literal);
                const values = Object.values(literal);

                return [
                    [...grid, values],
                    Array.from(new Set(cols.concat(headers))),
                ];
            },
            [[], []]
        );

        return new DataGrid(...args);
    }
}
