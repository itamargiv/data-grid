import DataGrid from '../src';

describe('DataGrid', () => {
    it('instantiates', () => {
        const grid = new DataGrid();

        expect(grid instanceof DataGrid).toBe(true);
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

        const grid = new DataGrid(fakeData);

        expect(grid.data).toEqual(expected);
    });

    it('instantiates from array of object literals', () => {
        const fakeData = [
            {
                phrase: 'Hello World',
                number: 42,
            },
        ];

        const grid = DataGrid.fromObjects(fakeData);

        expect(grid.data).toEqual(fakeData);
    });

    it('retrieves row as object literal', () => {
        const fakeData = [['Hello World', 42]];

        const expected = {
            phrase: 'Hello World',
            number: 42,
        };

        const grid = new DataGrid(fakeData, ['phrase', 'number']);

        expect(grid.row(0)).toEqual(expected);
    });

    it('retrieves column as array', () => {
        const fakeData = [
            ['Hello World', 42],
            ['Goodbye Mars', 1986],
        ];

        const expected = ['Hello World', 'Goodbye Mars'];

        const grid = new DataGrid(fakeData, ['phrase']);

        expect(grid.col('phrase')).toEqual(expected);
    });

    it('retrieves cell data', () => {
        const fakeData = [
            ['Hello World', 42],
            ['Goodbye Mars', 1986],
        ];

        const grid = new DataGrid(fakeData, ['phrase', 'number']);

        expect(grid.get(1, 'phrase')).toEqual('Goodbye Mars');
    });

    it('sorts data', () => {
        const fakeData = [
            ['Hello World', 42, true],
            ['Goodbye Mars', 1986, false],
            ['So Long Venus', 1984, false],
            ['Bonjour Mercury', 35, true],
        ];

        const grid = new DataGrid(fakeData, ['phrase', 'number', 'isBoopy']);
        const callback = (a, b) => a.phrase.localeCompare(b.phrase);

        expect(grid.sort()).toEqual(grid.data.sort(callback));
    });

    it('sorts data descending', () => {
        const fakeData = [
            ['Hello World', 42, true],
            ['Goodbye Mars', 1986, false],
            ['So Long Venus', 1984, false],
            ['Bonjour Mercury', 35, true],
        ];

        const grid = new DataGrid(fakeData, ['phrase', 'number', 'isBoopy']);
        const callback = (a, b) => -a.phrase.localeCompare(b.phrase);

        expect(grid.sort('desc')).toEqual(grid.data.sort(callback));
    });

    it('sorts data with callback', () => {
        const fakeData = [
            ['Hello World', 42, true],
            ['Goodbye Mars', 1986, false],
            ['So Long Venus', 1984, false],
            ['Bonjour Mercury', 35, true],
        ];

        const grid = new DataGrid(fakeData, ['phrase', 'number', 'isBoopy']);
        const callback = (a, b) => a.number - b.number;

        expect(grid.sortWith(callback)).toEqual(grid.data.sort(callback));
    });

    it('sorts data by column', () => {
        const fakeData = [
            ['Hello World', 42, true],
            ['Goodbye Mars', 1986, false],
            ['So Long Venus', 1984, false],
            ['Bonjour Mercury', 35, true],
        ];

        const grid = new DataGrid(fakeData, ['phrase', 'number', 'isBoopy']);
        const callback = (a, b) => a.number - b.number;

        expect(grid.sortBy('number')).toEqual(grid.data.sort(callback));
    });

    it('sorts data by column descending', () => {
        const fakeData = [
            ['Hello World', 42, true],
            ['Goodbye Mars', 1986, false],
            ['So Long Venus', 1984, false],
            ['Bonjour Mercury', 35, true],
        ];

        const grid = new DataGrid(fakeData, ['phrase', 'number', 'isBoopy']);
        const callback = (a, b) => -(a.number - b.number);

        expect(grid.sortBy('number', 'desc')).toEqual(grid.data.sort(callback));
    });

    it('sorts data by column with callback', () => {
        const fakeData = [
            ['Hello World', 42, true],
            ['Goodbye Mars', 1986, false],
            ['So Long Venus', 1984, false],
            ['Bonjour Mercury', 35, true],
        ];

        const grid = new DataGrid(fakeData, ['phrase', 'number', 'isBoopy']);
        const callback = (a, b) => -(a.isBoopy - b.isBoopy);

        expect(grid.sortByWith('isBoopy', (a, b) => -(a - b))).toEqual(
            grid.data.sort(callback)
        );
    });

    test.todo('maps grid rows');
    test.todo('reduces grid rows');
    test.todo('retrieves filtered data by callback');
});
