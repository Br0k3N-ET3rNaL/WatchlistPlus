import SignUp from "../components/sign-up/sign-up";
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('sign-up', () => {
    test('invalid username', async () => {
        render(<SignUp />);

        const fetchMock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve({ usernameExists: true }) })
        ) as jest.Mock;

        await userEvent.type(screen.getByRole('textbox', { name: /username/i }), 'username{enter}');

        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(fetchMock.mock.lastCall[0]).toBe('/api/users/exists/username/username');
        expect(fetchMock.mock.lastCall[1].method).toBe('GET');

        await waitFor(() => expect(screen.queryByText('* Username already exists')!.hidden).toBeFalsy());
    });

    test('invalid email', async () => {
        render(<SignUp />);

        const fetchMock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve({ emailExists: true }) })
        ) as jest.Mock;

        await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'email@gmail.com{enter}');

        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(fetchMock.mock.lastCall[0]).toBe('/api/users/exists/email/email@gmail.com');
        expect(fetchMock.mock.lastCall[1].method).toBe('GET');

        await waitFor(() => expect(screen.queryByText('* Email already exists')!.hidden).toBeFalsy());
    });

    test('passwords match', async () => {
        render(<SignUp />);

        await userEvent.type(screen.getByLabelText(/password/i), 'password{enter}');
        await userEvent.type(screen.getByLabelText(/repeat/i), 'password{enter}');

        await waitFor(() => expect(screen.getByText('* Passwords don\'t match').hidden).toBeTruthy());
    });

    test('passwords don\'t match', async () => {
        render(<SignUp />);

        await userEvent.type(screen.getByLabelText(/password/i), 'password{enter}');
        await userEvent.type(screen.getByLabelText(/repeat/i), 'different{enter}');

        await waitFor(() => expect(screen.queryByText('* Passwords don\'t match')!.hidden).toBeFalsy());
    });

    test('create user', async () => {
        const testUser = { username: 'Test User', email: 'email@gmail.com', password: 'password' };

        const login = jest.fn();

        render(<SignUp login={login}/>);

        let fetchMock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve({ usernameExists: false }) })
        ) as jest.Mock;

        await userEvent.type(screen.getByRole('textbox', { name: /username/i }), testUser.username + '{enter}');

        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        await waitFor(() => expect(screen.getByText('* Username already exists').hidden).toBeTruthy());

        fetchMock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve({ emailExists: false }) })
        ) as jest.Mock;

        await userEvent.type(screen.getByRole('textbox', { name: /email/i }), testUser.email + '{enter}');

        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        await waitFor(() => expect(screen.getByText('* Email already exists').hidden).toBeTruthy());

        await userEvent.type(screen.getByLabelText(/password/i), testUser.password + '{enter}');
        await userEvent.type(screen.getByLabelText(/repeat/i), testUser.password + '{enter}');

        await waitFor(() => expect(screen.getByText('* Passwords don\'t match').hidden).toBeTruthy());

        fetchMock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve({}) })
        ) as jest.Mock;

        await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(fetchMock.mock.lastCall[0]).toBe('/api/users/');
        expect(fetchMock.mock.lastCall[1].method).toBe('POST');
        expect(fetchMock.mock.lastCall[1].body).toContain(JSON.stringify(testUser));

        await waitFor(() => expect(login).toHaveBeenCalled());
    });
});

