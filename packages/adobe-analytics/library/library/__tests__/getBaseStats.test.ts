import getBaseStats from '../getBaseStats';

test('actual data', () => {
  expect(getBaseStats()).toMatchSnapshot();
});

test('actual ordering', () => {
  const stats = getBaseStats();
  for (const [browser, versions] of Object.entries(stats)) {
    expect(Object.keys(versions)).toMatchSnapshot(browser);
  }
});
