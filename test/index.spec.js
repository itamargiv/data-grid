import DataGrid from '../src';

describe('DataGrid', () => {
    it('instantiates', () => {
        const grid = new DataGrid();

        expect(grid instanceof DataGrid).toBe(true);
    });

    it('instantiates from array of object literals', () => {
        const fakeData = [
            {
                phrase: 'Hello World',
                number: 42,
            },
        ];

        const grid = new DataGrid(fakeData);

        expect(grid.data).toEqual(fakeData);
    });

    it('instantiates from an array of arrays', () => {
        const fakeData = [
            ['Hello World', 42, true],
            ['Goodbye Mars', 1986, false],
            ['So Long Venus', 1984, false],
            ['Bonjour Mercury', 35, true],
        ];

        const expected = fakeData.map((row) =>
            row.reduce(
                (literal, value, i) => ({
                    ...literal,
                    [i]: value,
                }),
                {}
            )
        );

        const grid = DataGrid.fromArray(fakeData);

        expect(grid.data).toEqual(expected);
    });

    it('instantiates from an array of arrays with column names', () => {
        const fakeData = [
            ['Hello World', 42, true],
            ['Goodbye Mars', 1986, false],
            ['So Long Venus', 1984, false],
            ['Bonjour Mercury', 35, true],
        ];

        const fakeColumns = ['phrase', 'number', 'isBoopy'];

        const expected = fakeData.map((row) =>
            row.reduce(
                (literal, value, i) => ({
                    ...literal,
                    [fakeColumns[i]]: value,
                }),
                {}
            )
        );

        const grid = DataGrid.fromArray(fakeData, fakeColumns);

        expect(grid.data).toEqual(expected);
    });

    it('retrieves row as object literal', () => {
        const fakeData = [['Hello World', 42]];

        const expected = {
            phrase: 'Hello World',
            number: 42,
        };

        const grid = DataGrid.fromArray(fakeData, ['phrase', 'number']);

        expect(grid.row(0)).toEqual(expected);
    });

    it('retrieves column as array', () => {
        const fakeData = [
            ['Hello World', 42],
            ['Goodbye Mars', 1986],
        ];

        const expected = ['Hello World', 'Goodbye Mars'];

        const grid = DataGrid.fromArray(fakeData, ['phrase']);

        expect(grid.col('phrase')).toEqual(expected);
    });

    it('retrieves cell data', () => {
        const fakeData = [
            ['Hello World', 42],
            ['Goodbye Mars', 1986],
        ];

        const grid = DataGrid.fromArray(fakeData, ['phrase', 'number']);

        expect(grid.get(1, 'phrase')).toEqual('Goodbye Mars');
    });

    it('sorts data', () => {
        const fakeData = [
            ['Hello World', 42, true],
            ['Goodbye Mars', 1986, false],
            ['So Long Venus', 1984, false],
            ['Bonjour Mercury', 35, true],
        ];

        const grid = DataGrid.fromArray(fakeData, [
            'phrase',
            'number',
            'isBoopy',
        ]);
        const callback = (a, b) => a.phrase.localeCompare(b.phrase);
        const sorted = grid.sort();

        expect(sorted.data).toEqual(grid.data.sort(callback));
    });

    it('sorts data descending', () => {
        const fakeData = [
            ['Hello World', 42, true],
            ['Goodbye Mars', 1986, false],
            ['So Long Venus', 1984, false],
            ['Bonjour Mercury', 35, true],
        ];

        const grid = DataGrid.fromArray(fakeData, [
            'phrase',
            'number',
            'isBoopy',
        ]);
        const callback = (a, b) => -a.phrase.localeCompare(b.phrase);
        const sorted = grid.sort('desc');

        expect(sorted.data).toEqual(grid.data.sort(callback));
    });

    it('sorts data with callback', () => {
        const fakeData = [
            ['Hello World', 42, true],
            ['Goodbye Mars', 1986, false],
            ['So Long Venus', 1984, false],
            ['Bonjour Mercury', 35, true],
        ];

        const grid = DataGrid.fromArray(fakeData, [
            'phrase',
            'number',
            'isBoopy',
        ]);
        const callback = (a, b) => a.number - b.number;
        const sorted = grid.sortWith(callback);

        expect(sorted.data).toEqual(grid.data.sort(callback));
    });

    it('sorts data by column', () => {
        const fakeData = [
            ['Hello World', 42, true],
            ['Goodbye Mars', 1986, false],
            ['So Long Venus', 1984, false],
            ['Bonjour Mercury', 35, true],
        ];

        const grid = DataGrid.fromArray(fakeData, [
            'phrase',
            'number',
            'isBoopy',
        ]);
        const callback = (a, b) => a.number - b.number;
        const sorted = grid.sortBy('number');

        expect(sorted.data).toEqual(grid.data.sort(callback));
    });

    it('sorts data by column descending', () => {
        const fakeData = [
            ['Hello World', 42, true],
            ['Goodbye Mars', 1986, false],
            ['So Long Venus', 1984, false],
            ['Bonjour Mercury', 35, true],
        ];

        const grid = DataGrid.fromArray(fakeData, [
            'phrase',
            'number',
            'isBoopy',
        ]);
        const callback = (a, b) => -(a.number - b.number);
        const sorted = grid.sortBy('number', 'desc');

        expect(sorted.data).toEqual(grid.data.sort(callback));
    });

    it('sorts data by column with callback', () => {
        const fakeData = [
            ['Hello World', 42, true],
            ['Goodbye Mars', 1986, false],
            ['So Long Venus', 1984, false],
            ['Bonjour Mercury', 35, true],
        ];

        const grid = DataGrid.fromArray(fakeData, [
            'phrase',
            'number',
            'isBoopy',
        ]);
        const callback = (a, b) => -(a.isBoopy - b.isBoopy);
        const sorted = grid.sortByWith('isBoopy', (a, b) => -(a - b));

        expect(sorted.data).toEqual(grid.data.sort(callback));
    });

    it('maps grid rows', () => {
        const fakeData = [
            ['Hello World', 42, true],
            ['Goodbye Mars', 1986, false],
            ['So Long Venus', 1984, false],
            ['Bonjour Mercury', 35, true],
        ];

        const grid = DataGrid.fromArray(fakeData, [
            'phrase',
            'number',
            'isBoopy',
        ]);
        const callback = (row) => ({
            ...row,
            phrase: row.phrase + '!',
        });
        const mapped = grid.map(callback);

        expect(mapped.data).toEqual(grid.data.map(callback));
    });

    it('reduces grid rows', () => {
        const fakeData = [
            ['Hello World', 42, true],
            ['Goodbye Mars', 1986, false],
            ['So Long Venus', 1984, false],
            ['Bonjour Mercury', 35, true],
        ];

        const grid = DataGrid.fromArray(fakeData, [
            'phrase',
            'number',
            'isBoopy',
        ]);

        const callback = (acc, row) => acc + row.number;

        expect(grid.reduce(callback, 0)).toEqual(grid.data.reduce(callback, 0));
    });

    it('reduces from implied initial value of first row and first column', () => {
        const fakeData = [
            ['Hello World', 42, true],
            ['Goodbye Mars', 1986, false],
            ['So Long Venus', 1984, false],
            ['Bonjour Mercury', 35, true],
        ];

        const grid = DataGrid.fromArray(fakeData, [
            'phrase',
            'number',
            'isBoopy',
        ]);

        const callback = (acc, row) => `${row.phrase}, ${acc}`;

        expect(grid.reduce(callback)).toEqual(
            grid.data.slice(1).reduce(callback, fakeData[0][0])
        );
    });

    test.todo('retrieves filtered data by callback');
});
