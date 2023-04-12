import '../styles/globals.css'
import dynamic from 'next/dynamic'
import '@solana/wallet-adapter-react-ui/styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
function MyApp({ Component, pageProps }) {
  const WalletConnectionProvider = dynamic(
    () => import('../context/WalletConnectionProvider'),
    {ssr : false},
  )

  return(
    <WalletConnectionProvider>
      <Component {...pageProps}/>
    </WalletConnectionProvider>
  )
}

export default MyApp
 