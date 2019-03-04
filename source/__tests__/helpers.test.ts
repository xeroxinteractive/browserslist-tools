import * as modulerUnderTest from '../helpers';

describe('filter', () => {
    test('no filters', async() => {
        expect(modulerUnderTest.filter('test')).toBe(true);
    });
    test('empty filters', async() => {
        expect(modulerUnderTest.filter('test', {
            include: [],
            exclude: []
        })).toBe(true);
    });
    test('include', async() => {
        expect(modulerUnderTest.filter('test', {
            include: [
                'test',
                'lorem',
                'ipsum'
            ]
        })).toBe(true);
    });
    test('exclude', async() => {
        expect(modulerUnderTest.filter('test', {
            exclude: [
                'test',
                'lorem',
                'ipsum'
            ]
        })).toBe(false);
    });
    test('include + exclude', async() => {
        expect(modulerUnderTest.filter('test', {
            include: [
                'test'
            ],
            exclude: [
                'test'
            ]
        })).toBe(false);
    });
});