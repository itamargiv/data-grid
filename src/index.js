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

    constructor(data){
        this.#grid = data && data.map(row => new DataRow(row)) || []; 
    }

    // TODO: Find a way to represent internal data of grid in a similar fashion to valueOf
    get data(){
        return this.#grid.map(row => row.cells);
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

    static fromObjects(data){
        return new DataGrid(data.map(literal => Object.entries(literal)));
    }

    static fromMaps(data){
        return new DataGrid(data.map(rowMap => rowMap.entries()));
    }
}

module.exports = DataGrid;