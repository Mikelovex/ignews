import { render, screen } from '@testing-library/react'
import { SignInButton } from '.'
import { useSession } from 'next-auth/client'
import { mocked } from 'jest-mock'

jest.mock('next-auth/client')

describe('SignInButton Component', () => {

    it('renders correctly when user is not authenticated', () => {

        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([null, false])

        render(
            <SignInButton />
        )

        expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument()
    })

    it('renders correctly when user is authenticated', () => {
        const useSessionMocked = mocked(useSession)

        useSessionMocked.mockReturnValueOnce([{ user: { name: 'John Doe', email: "john@email.com" }, expires: 'fake-expries' }, false])

        render(
            <SignInButton />
        )

        expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

})

