import LogIn from '../components/log-in/log-in';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('no user with email', async () => {
    render(<LogIn />);

    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'email@gmail.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password');

    global.fetch = jest.fn(async () =>
        Promise.resolve({ json: async () => Promise.resolve({ userExists: false, passwordsMatch: true }) })
    ) as jest.Mock;

    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    setTimeout(() => {
        expect(screen.queryByText('* No user with given email')!.hidden).toBeFalsy();
        expect(screen.getByText('* Incorrect Password').hidden).toBeTruthy();
    }, 1000);
});

test('valid user wrong password', async () => {
    render(<LogIn />);

    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'email@gmail.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password');

    global.fetch = jest.fn(async () =>
        Promise.resolve({ json: async () => Promise.resolve({ userExists: true, passwordsMatch: false }) })
    ) as jest.Mock;

    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    setTimeout(() => {
        expect(screen.getByText('* No user with given email').hidden).toBeTruthy();
        expect(screen.queryByText('* Incorrect Password')!.hidden).toBeFalsy();
    }, 1000);
});

test('valid user correct password', async () => {
    render(<LogIn />);

    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'email@gmail.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password');

    global.fetch = jest.fn(async () =>
        Promise.resolve({ json: async () => Promise.resolve({ userExists: true, passwordsMatch: true }) })
    ) as jest.Mock;

    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    setTimeout(() => {
        expect(screen.getByText('* No user with given email').hidden).toBeTruthy();
        expect(screen.getByText('* Incorrect Password').hidden).toBeTruthy();
    }, 1000);
});
