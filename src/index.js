class DataRow extends Map {
    constructor(data){
        super(data);
    }

    get cells(){
        return Array.from(this)
            .reduce((literal, [key, val]) => ({
                [key]: val,
                ...literal
            }), {});
    }
}

class DataGrid {
    #grid = null;
    #columns = [];
    #collator = null;
    #locale;

    constructor(data, locale = 'en'){
        this.#grid = data && data.map(row => new DataRow(row)) || [];
        this.#columns = this.#grid[0] && Array.from(this.#grid[0].keys()) || [];

        this.#locale = locale;
        this.#collator = new Intl.Collator(this.#locale, {
            numeric: true
        });
    }

    // TODO: Find a way to represent internal data of grid in a similar fashion to valueOf
    get data(){
        return this.#grid.map(row => row.cells);
    }

    #defaultSortFor(column, order){
        return (a, b) => {
            const ordering = this.#collator.compare(a[column], b[column]);
            return order == 'desc' ? -ordering : ordering;
        }
    }

    row(r) {
        return this.#grid[r].cells;
    }

    col(c) {
        return this.#grid.map(row => row.get(c));
    }

    get(r,c){
        return this.#grid[r].get(c);
    }

    sort(order = 'asc'){
        return this.data.sort(this.#defaultSortFor(this.#columns[0], order));
    }

    sortWith(cb){
        return this.data.sort(cb);
    }

    sortBy(column, order){
        return this.sortWith(this.#defaultSortFor(column, order));
    }

    sortByWith(column, cb){
        return this.sortWith((a, b) => cb(a[column], b[column]));
    }

    static fromObjects(data){
        return new DataGrid(data.map(literal => Object.entries(literal)));
    }

    static fromMaps(data){
        return new DataGrid(data.map(rowMap => rowMap.entries()));
    }
}

module.exports = DataGrid;