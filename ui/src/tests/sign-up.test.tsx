import SignUp from "../components/sign-up/sign-up";
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('invalid username', async () => {
    render(<SignUp />);

    global.fetch = jest.fn(async () =>
        Promise.resolve({ json: async () => Promise.resolve({ usernameExists: true }) })
    ) as jest.Mock;

    await userEvent.type(screen.getByRole('textbox', { name: /username/i }), 'username');

    setTimeout(async () => {
        expect(screen.queryByText('* Username already exists')!.hidden).toBeFalsy();
    }, 2000);
});

test('invalid email', async () => {
    render(<SignUp />);

    global.fetch = jest.fn(async () =>
        Promise.resolve({ json: async () => Promise.resolve({ emailExists: true }) })
    ) as jest.Mock;

    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'email@gmail.com');

    setTimeout(async () => {
        expect(screen.queryByText('* Email already exists')!.hidden).toBeFalsy();
    }, 2000);
});

test('passwords match', async () => {
    render(<SignUp />);

    await userEvent.type(screen.getByLabelText(/password/i), 'password');
    await userEvent.type(screen.getByLabelText(/repeat/i), 'password');

    setTimeout(() => {
        expect(screen.getByText('* Passwords don\'t match').hidden).toBeTruthy();
    }, 1000);
});

test('passwords don\'t match', async () => {
    render(<SignUp />);

    await userEvent.type(screen.getByLabelText(/password/i), 'password');
    await userEvent.type(screen.getByLabelText(/repeat/i), 'different');

    setTimeout(() => {
        expect(screen.queryByText('* Passwords don\'t match')!.hidden).toBeFalsy();
    }, 1000);
});

test('create user api call', async () => {
    render(<SignUp />);

    global.fetch = jest.fn(async () =>
        Promise.resolve({ json: async () => Promise.resolve({ usernameExists: false }) })
    ) as jest.Mock;

    await userEvent.type(screen.getByRole('textbox', { name: /username/i }), 'username');

    setTimeout(async () => {
        expect(screen.getByText('* Username already exists').hidden).toBeTruthy();
    }, 1000);

    global.fetch = jest.fn(async () =>
        Promise.resolve({ json: async () => Promise.resolve({ emailExists: false }) })
    ) as jest.Mock;

    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'email@gmail.com');

    setTimeout(async () => {
        expect(screen.getByText('* Email already exists').hidden).toBeTruthy();
    }, 1000);

    await userEvent.type(screen.getByLabelText(/password/i), 'password');
    await userEvent.type(screen.getByLabelText(/repeat/i), 'password');

    jest.resetAllMocks();

    const mock = global.fetch = jest.fn(async () =>
        Promise.resolve({ json: async () => Promise.resolve({}) })
    ) as jest.Mock;

    setTimeout(async () => {
        expect(screen.getByText('* Passwords don\'t match').hidden).toBeTruthy();
    }, 1000);

    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    setTimeout(async () => {
        expect(mock.mock.calls).toHaveLength(1);
    }, 1000);
})
