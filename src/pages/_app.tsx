import { AppProps } from 'next/app'
import { Header } from '../components/Header'
import { Provider as SessionProvider } from 'next-auth/client'
import '../styles/global.scss'

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
