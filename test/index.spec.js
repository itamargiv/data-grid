const DataGrid = require('../src');

describe('DataGrid', () => {
    it('instantiates', () => {
        const grid = new DataGrid();

        expect(grid instanceof DataGrid).toBe(true);
    });

    test.todo('instantiates from an array of arrays');

    it('instantiates from an array of tuple arrays', () => {
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

    test.todo('instantiates from a tuple array of tuple arrays');
    test.todo('instantiates from an object literal of object literals');
    test.todo('instantiates from a Map of Map instances');
    
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
    
    it('sorts data', () => {
        const fakeData = [
            [ 
                ['phrase', 'Hello World'],
                ['number', 42], 
            ],
            [ 
                ['phrase', 'Goodbye Mars'],
                ['number', 1986],
            ],
            [ 
                ['phrase', 'So Long Venus'],
                ['number', 1984],
            ],
            [ 
                ['phrase', 'Bonjour Mercury'],
                ['number', 35],
            ],
        ];

        const grid = new DataGrid(fakeData);
        const callback = (a, b) => a.phrase.localeCompare(b.phrase);

        expect(grid.sort()).toEqual(grid.data.sort(callback));
    });

    it('sorts data descending', () => {
        const fakeData = [
            [ 
                ['phrase', 'Hello World'],
                ['number', 42], 
            ],
            [ 
                ['phrase', 'Goodbye Mars'],
                ['number', 1986],
            ],
            [ 
                ['phrase', 'So Long Venus'],
                ['number', 1984],
            ],
            [ 
                ['phrase', 'Bonjour Mercury'],
                ['number', 35],
            ],
        ];

        const grid = new DataGrid(fakeData);
        const callback = (a, b) => -a.phrase.localeCompare(b.phrase);

        expect(grid.sort('desc')).toEqual(grid.data.sort(callback));
    });

    it('sorts data with callback', () => {
        const fakeData = [
            [ 
                ['phrase', 'Hello World'],
                ['number', 42], 
            ],
            [ 
                ['phrase', 'Goodbye Mars'],
                ['number', 1986],
            ],
            [ 
                ['phrase', 'So Long Venus'],
                ['number', 1984],
            ],
            [ 
                ['phrase', 'Bonjour Mercury'],
                ['number', 35],
            ],
        ];

        const grid = new DataGrid(fakeData);
        const callback = (a, b) => a.number - b.number;

        expect(grid.sortWith(callback)).toEqual(grid.data.sort(callback));
    });

    it('sorts data by column', () => {
        const fakeData = [
            [ 
                ['phrase', 'Hello World'],
                ['number', 42],
                ['isBoopy', true]
            ],
            [ 
                ['phrase', 'Goodbye Mars'],
                ['number', 1986],
                ['isBoopy', false]
            ],
            [ 
                ['phrase', 'So Long Venus'],
                ['number', 1984],
                ['isBoopy', false]
            ],
            [ 
                ['phrase', 'Bonjour Mercury'],
                ['number', 35],
                ['isBoopy', true]
            ],
        ];

        const grid = new DataGrid(fakeData);
        const callback = (a, b) => a.number - b.number;

        expect(grid.sortBy('number')).toEqual(grid.data.sort(callback));
    });

    it('sorts data by column descending', () => {
        const fakeData = [
            [ 
                ['phrase', 'Hello World'],
                ['number', 42],
                ['isBoopy', true]
            ],
            [ 
                ['phrase', 'Goodbye Mars'],
                ['number', 1986],
                ['isBoopy', false]
            ],
            [ 
                ['phrase', 'So Long Venus'],
                ['number', 1984],
                ['isBoopy', false]
            ],
            [ 
                ['phrase', 'Bonjour Mercury'],
                ['number', 35],
                ['isBoopy', true]
            ],
        ];

        const grid = new DataGrid(fakeData);
        const callback = (a, b) => -(a.number - b.number);

        expect(grid.sortBy('number', 'desc')).toEqual(grid.data.sort(callback));
    });

    it('sorts data by column with callback', () => {
        const fakeData = [
            [ 
                ['phrase', 'Hello World'],
                ['number', 42],
                ['isBoopy', true]
            ],
            [ 
                ['phrase', 'Goodbye Mars'],
                ['number', 1986],
                ['isBoopy', false]
            ],
            [ 
                ['phrase', 'So Long Venus'],
                ['number', 1984],
                ['isBoopy', false]
            ],
            [ 
                ['phrase', 'Bonjour Mercury'],
                ['number', 35],
                ['isBoopy', true]
            ],
        ];

        const grid = new DataGrid(fakeData);
        const callback = (a, b) => -(a.isBoopy - b.isBoopy);

        expect(grid.sortByWith('isBoopy', (a, b) => -(a-b)))
            .toEqual(grid.data.sort(callback));
    });

    test.todo('retrieves filtered data by callback');
});