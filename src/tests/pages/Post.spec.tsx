import { render, screen } from "@testing-library/react"
import { mocked } from "jest-mock"
import { getSession } from "next-auth/client"
import Post, { getServerSideProps } from "../../pages/posts/[slug]"
import { getPrismicClient } from '../../services/prismic'
const post =
{
    slug: 'slug',
    title: 'title',
    content: '<p>Post excerpt</p>',
    updatedAt: '10 de abril'
}



jest.mock('../../services/prismic')
jest.mock('next-auth/client')

describe('Post page', () => {
    it('renders correctly', () => {
        render(<Post post={post} />)

        expect(screen.getByText("title")).toBeInTheDocument()
        expect(screen.getByText("Post excerpt")).toBeInTheDocument()

    })

    it('redirect user if no subscription is found', async () => {
        const getSessionMocked = mocked(getSession)

        getSessionMocked.mockResolvedValueOnce(null)

        const response = await getServerSideProps({ params: { slug: 'slug' } } as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/'
                })
            })
        )
    })

    it('loads initial data', async () => {
        const getSessionMocked = mocked(getSession)
        const getPrismicClientMocked = mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: 'heading', text: 'new post' }
                    ],
                    content: [
                        { type: 'paragraph', text: 'post excerpt' }
                    ],
                },
                last_publication_date: '04-01-2021'
            })
        } as any)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any);


        const response = await getServerSideProps({ params: { slug: 'slug' } } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'slug',
                        title: 'new post',
                        content: '<p>post excerpt</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                }
            })
        )

    })
})