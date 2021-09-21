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

        const grid = DataGrid.fromArray(fakeData);

        expect(grid.data).toEqual(expected);
    });

    describe.each([
        {
            data: 'two dimensional array and column array',
            method: 'fromArray',
            given: [
                [
                    ['Hello World', 42, true],
                    ['Goodbye Mars', 1986, false],
                ],
                ['phrase', 'number', 'isBoopy'],
            ],
        },
        {
            data: 'array of pair arrays',
            method: 'fromPairs',
            given: [
                [
                    [
                        ['phrase', 'Hello World'],
                        ['number', 42],
                        ['isBoopy', true],
                    ],
                    [
                        ['phrase', 'Goodbye Mars'],
                        ['number', 1986],
                        ['isBoopy', false],
                    ],
                ],
            ],
        },
        {
            data: 'array of object literals',
            method: 'fromObjects',
            given: [
                [
                    {
                        phrase: 'Hello World',
                        number: 42,
                        isBoopy: true,
                    },
                    {
                        phrase: 'Goodbye Mars',
                        number: 1986,
                        isBoopy: false,
                    },
                ],
            ],
        },
        {
            data: 'array of Map instances',
            method: 'fromMaps',
            given: [
                [
                    new Map([
                        ['phrase', 'Hello World'],
                        ['number', 42],
                        ['isBoopy', true],
                    ] as [any, any][]),
                    new Map([
                        ['phrase', 'Goodbye Mars'],
                        ['number', 1986],
                        ['isBoopy', false],
                    ] as [any, any][]),
                ],
            ],
        },
    ])('instantiates from:', ({ data, method, given }) => {
        test(data, () => {
            const grid = DataGrid[method](...given);

            expect(grid.data).toEqual([
                {
                    phrase: 'Hello World',
                    number: 42,
                    isBoopy: true,
                },
                {
                    phrase: 'Goodbye Mars',
                    number: 1986,
                    isBoopy: false,
                },
            ]);
        });
    });

    test.todo('instantiates from a tuple array of tuple arrays');
    test.todo('instantiates from an object literal of object literals');
    test.todo('instantiates from a Map of Map instances');
    test.todo('throws a TypeError on any unaccepted type');

    it('retrieves entries as an iterator', () => {
        const fakeData = [['Hello World', 42]];
        const grid = DataGrid.fromArray(fakeData, ['phrase', 'number']);

        expect(Array.from(grid.entries())).toEqual([
            [
                0,
                [
                    ['phrase', 'Hello World'],
                    ['number', 42],
                ],
            ],
        ]);
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
            {
                phrase: 'Hello World',
                number: 42,
                isBoopy: true,
            },
            {
                phrase: 'Goodbye Mars',
                number: 1986,
                isBoopy: false,
            },
        ];

        const grid = DataGrid.fromObjects(fakeData);

        const callback = (a, b) => a.phrase.localeCompare(b.phrase);

        expect(grid.sort()).toEqual(fakeData.sort(callback));
    });

    it('sorts data descending', () => {
        const fakeData = [
            {
                phrase: 'Hello World',
                number: 42,
                isBoopy: true,
            },
            {
                phrase: 'Goodbye Mars',
                number: 1986,
                isBoopy: false,
            },
        ];

        const grid = DataGrid.fromObjects(fakeData);

        const callback = (a, b) => -a.phrase.localeCompare(b.phrase);

        expect(grid.sort('desc')).toEqual(fakeData.sort(callback));
    });

    it('sorts data with callback', () => {
        const fakeData = [
            {
                phrase: 'Hello World',
                number: 42,
                isBoopy: true,
            },
            {
                phrase: 'Goodbye Mars',
                number: 1986,
                isBoopy: false,
            },
        ];

        const grid = DataGrid.fromObjects(fakeData);

        const callback = (a, b) => a.number - b.number;

        expect(grid.sortWith(callback)).toEqual(fakeData.sort(callback));
    });

    it('sorts data by column', () => {
        const fakeData = [
            {
                phrase: 'Hello World',
                number: 42,
                isBoopy: true,
            },
            {
                phrase: 'Goodbye Mars',
                number: 1986,
                isBoopy: false,
            },
        ];

        const grid = DataGrid.fromObjects(fakeData);
        const callback = (a, b) => a.number - b.number;

        expect(grid.sortBy('number')).toEqual(fakeData.sort(callback));
    });

    it('sorts data by column descending', () => {
        const fakeData = [
            {
                phrase: 'Hello World',
                number: 42,
                isBoopy: true,
            },
            {
                phrase: 'Goodbye Mars',
                number: 1986,
                isBoopy: false,
            },
        ];

        const grid = DataGrid.fromObjects(fakeData);
        const callback = (a, b) => -(a.number - b.number);

        expect(grid.sortBy('number', 'desc')).toEqual(fakeData.sort(callback));
    });

    it('sorts data by column with callback', () => {
        const fakeData = [
            {
                phrase: 'Hello World',
                number: 42,
                isBoopy: true,
            },
            {
                phrase: 'Goodbye Mars',
                number: 1986,
                isBoopy: false,
            },
        ];

        const grid = DataGrid.fromObjects(fakeData);
        const callback = (a, b) => -(a.isBoopy - b.isBoopy);

        expect(grid.sortByWith('isBoopy', (a, b) => -(a - b))).toEqual(
            fakeData.sort(callback)
        );
    });

    test.todo('maps grid rows');
    test.todo('reduces grid rows');
    test.todo('retrieves filtered data by callback');
});
