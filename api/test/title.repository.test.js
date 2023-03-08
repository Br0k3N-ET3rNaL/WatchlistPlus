const titleRepository = require('../repository/title.repository');
const logger = require('../logger/api.logger');
require('../config/db.config');

// eslint-disable-next-line no-unused-vars
const db = jest.mock('../config/db.config', () => ({
    connect: jest.fn(),
}));

logger.error = jest.fn();

test('valid sortColumn', async () => {
    await titleRepository.getPageOfTitles(50, 1, 'title', '');
    expect(logger.error.mock.calls).toHaveLength(0);
});

test('invalid sortColumn', async () => {
    await titleRepository.getPageOfTitles(50, 1, 'notAColumn', '');
    expect(logger.error.mock.calls).toHaveLength(1);
    expect(logger.error.mock.calls[0][0]).toBe('Error::notAColumn does not exists in titles');
});
