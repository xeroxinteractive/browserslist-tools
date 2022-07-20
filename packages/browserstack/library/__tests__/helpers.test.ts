import * as modulerUnderTest from '../helpers';

describe('filter', () => {
  test('no filters', async () => {
    expect(modulerUnderTest.filter('test')).toBe(true);
  });
  test('empty filters', async () => {
    expect(
      modulerUnderTest.filter('test', {
        include: [],
        exclude: [],
      })
    ).toBe(true);
  });
  test('include', async () => {
    expect(
      modulerUnderTest.filter('test', {
        include: ['test', 'lorem', 'ipsum'],
      })
    ).toBe(true);
  });
  test('exclude', async () => {
    expect(
      modulerUnderTest.filter('test', {
        exclude: ['test', 'lorem', 'ipsum'],
      })
    ).toBe(false);
  });
  test('include + exclude', async () => {
    expect(
      modulerUnderTest.filter('test', {
        include: ['test'],
        exclude: ['test'],
      })
    ).toBe(false);
  });
});

describe('xor', () => {
  test('lhs true, rhs false', () => {
    expect(modulerUnderTest.xor(true, false)).toBeTruthy();
  });

  test('lhs false, rhs true', () => {
    expect(modulerUnderTest.xor(false, true)).toBeTruthy();
  });

  test('lhs true, rhs true', () => {
    expect(modulerUnderTest.xor(true, true)).toBeFalsy();
  });

  test('lhs false, rhs false', () => {
    expect(modulerUnderTest.xor(false, false)).toBeFalsy();
  });
});

describe('arraysEqual', () => {
  test('non objects', () => {
    expect(
      modulerUnderTest.arraysEqual([1, 2, 3, 4], [1, 2, 3, 4])
    ).toBeTruthy();
    expect(
      modulerUnderTest.arraysEqual(['lorem ipsum'], ['lorem ipsum'])
    ).toBeTruthy();
    expect(
      modulerUnderTest.arraysEqual([true, false], [true, false])
    ).toBeTruthy();
    expect(
      modulerUnderTest.arraysEqual([undefined, null], [undefined, null])
    ).toBeTruthy();
    expect(
      modulerUnderTest.arraysEqual([1, '2', false, null], [1, '2', false, null])
    ).toBeTruthy();
    expect(modulerUnderTest.arraysEqual([false], [null])).toBeFalsy();
    expect(
      modulerUnderTest.arraysEqual([1, 2, 3, '4'], [1, 2, 3, 4])
    ).toBeFalsy();
  });

  test('2 dimensional array', () => {
    expect(
      modulerUnderTest.arraysEqual(
        [
          [1, 2],
          [3, 4],
        ],
        [
          [1, 2],
          [3, 4],
        ]
      )
    ).toBeTruthy();
    expect(
      modulerUnderTest.arraysEqual(
        [
          [1, 2],
          [3, 4],
        ],
        [
          [2, 1],
          [3, 4],
        ]
      )
    ).toBeFalsy();
  });

  test('objects', () => {
    expect(
      modulerUnderTest.arraysEqual([{ test: 'valid' }], [{ test: 'valid' }])
    ).toBeTruthy();
    expect(
      modulerUnderTest.arraysEqual([{ test: 'invalid' }], [{ test: 'valid' }])
    ).toBeFalsy();
  });

  test('length', () => {
    expect(
      modulerUnderTest.arraysEqual([1, 2, 3, 4], [1, 2, 3, 4, 5, 6])
    ).toBeFalsy();
  });
});
