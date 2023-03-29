import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LogIn from '../components/log-in/log-in';

describe('log-in', () => {
    test('no user with email', async () => {
        render(<LogIn />);

        await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'email@gmail.com');
        await userEvent.type(screen.getByLabelText(/password/i), 'password');

        global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve({ userExists: false, passwordsMatch: true }) })
        ) as jest.Mock;

        await userEvent.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => expect(screen.queryByText('* No user with given email')!.hidden).toBeFalsy());
        expect(screen.getByText('* Incorrect Password').hidden).toBeTruthy();


    });

    test('valid user wrong password', async () => {
        render(<LogIn />);

        await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'email@gmail.com');
        await userEvent.type(screen.getByLabelText(/password/i), 'password');

        global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve({ userExists: true, passwordsMatch: false }) })
        ) as jest.Mock;

        await userEvent.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => expect(screen.getByText('* No user with given email').hidden).toBeTruthy());
        await waitFor(() => expect(screen.queryByText('* Incorrect Password')!.hidden).toBeFalsy());
    });

    test('valid user correct password', async () => {
        render(<LogIn />);

        await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'email@gmail.com');
        await userEvent.type(screen.getByLabelText(/password/i), 'password');

        global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve({ userExists: true, passwordsMatch: true }) })
        ) as jest.Mock;

        await userEvent.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => expect(screen.getByText('* No user with given email').hidden).toBeTruthy());
        await waitFor(() => expect(screen.getByText('* Incorrect Password').hidden).toBeTruthy());
    });
});
