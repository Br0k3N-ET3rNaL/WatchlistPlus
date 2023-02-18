const userService = require('../service/user.service');
const userRepository = require('../repository/user.repository');

userRepository.getUserByEmail = jest.fn();
userRepository.getUserByEmail
    .mockReturnValueOnce({ value: 'email@gmail.com' })
    .mockReturnValueOnce(null)
    .mockReturnValueOnce({ password: 'correctPassword' })
    .mockReturnValueOnce({ password: 'correctPassword' });

test('email validation expect false', async () => {
    const result = await userService.emailExists('notAnEmail');
    expect(result.emailExists).toBeFalsy();
});

test('valid email exists', async () => {
    const result = await userService.emailExists('email@gmail.com');
    expect(userRepository.getUserByEmail.mock.results[0].value).toEqual({ value: 'email@gmail.com' });
    expect(result.emailExists).toBeTruthy();
});

test('valid email does not exist', async () => {
    const result = await userService.emailExists('email@gmail.com');
    expect(result.emailExists).toBeFalsy();
});

test('verify passwords match', async () => {
    const result = await userService.verifyUser('email@gmail.com', 'correctPassword');
    expect(result.passwordsMatch).toBeTruthy();
});

test('verify passwords do not match', async () => {
    const result = await userService.verifyUser('email@gmail.com', 'wrongPassword');
    expect(result.passwordsMatch).toBeFalsy();
});
