const DataGrid = require('../src');

describe('DataGrid', () => {
    it('instantiates', () => {
        const grid = new DataGrid();

        expect(grid instanceof DataGrid).toBe(true);
    });

    it('instantiates from an array of key value tuple arrays', () => {
        const fakeData = [[
            ['phrase', 'Hello World'],
            ['number', 42],
        ]];
        
        const grid = new DataGrid(fakeData);

        expect(grid.data).toEqual([{
            phrase: 'Hello World',
            number: 42
        }]);
    });

    it('instantiates from array of object literals', () => {
        const fakeData = [{
            phrase: 'Hello World',
            number: 42
        }];

        const grid = DataGrid.fromObjects(fakeData);

        expect(grid.data).toEqual(fakeData);
    });

    it('instantiates from array of Map instances', () => {
        const fakeRow = [
            ['phrase', 'Hello World'],
            ['number', 42],
        ];

        const expectedData = [{
            phrase: 'Hello World',
            number: 42
        }];
        
        const grid = DataGrid.fromMaps([
            new Map(fakeRow)
        ]);

        expect(grid.data).toEqual(expectedData);
    });

    it('retrieves row as object literal', () => {
        const fakeData = [[
            ['phrase', 'Hello World'],
            ['number', 42],
        ]];

        const expected = {
            phrase: 'Hello World',
            number: 42
        }

        const grid = new DataGrid(fakeData);

        expect(grid.row(0)).toEqual(expected);
    });

    it('retrieves column as array', () => {
        const fakeData = [
            [ 
                ['phrase', 'Hello World'],
                ['number', 42], 
            ],
            [ 
                ['phrase', 'Goodbye Mars'],
                ['number', 1986],
            ],
        ];

        const expected = [
            'Hello World',
            'Goodbye Mars'
        ];

        const grid = new DataGrid(fakeData);

        expect(grid.col('phrase')).toEqual(expected);
    });

    it('retrieves cell data', () => {
        const fakeData = [
            [ 
                ['phrase', 'Hello World'],
                ['number', 42], 
            ],
            [ 
                ['phrase', 'Goodbye Mars'],
                ['number', 1986],
            ],
        ];

        const grid = new DataGrid(fakeData);

        expect(grid.get(1, 'phrase')).toEqual('Goodbye Mars');
    });
    
    test.todo('sorts data by column ascending');
    test.todo('sorts data by column descending');
    test.todo('retrieves filtered data by callback');
});