jest.mock('../getAllCapabilities');
import getAllCapabilities from '../getAllCapabilities';

test('capability retrival', async () => {
    await expect(getAllCapabilities()).resolves.toMatchSnapshot();
});