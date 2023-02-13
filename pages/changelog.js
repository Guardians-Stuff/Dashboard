import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import Head from 'next/head';

import styles from '@/styles/Changelog.module.css';
import Navbar from '@/components/Navbar';

import { changes } from '../changes';

export default function Commands() {
  const router = useRouter();
  const { data: session } = useSession();
  if(session) router.push('/dashboard');

  const testPrint = () => {
    Object.keys(changes).map(date => {
      console.log(date)
      Object.keys(changes[date]).map(category => {
        console.log(category)
        changes[date][category].map(change => {
          console.log(change)
        })
      })
    })
  }

  return(
    <>
      <Head>
        <title>Guardian Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <Navbar />
        <div className={styles.grid}>
          <div></div>
          <div className={styles.center}>
            <div className={styles.body}>
              <h1 className={styles.header} onClick={() => { testPrint() }}>Changelog</h1>
              {Object.keys(changes).map((date) => (
                <>
                  <h2 className={styles.date}>{date}</h2>
                  <ul>
                  {Object.keys(changes[date]).map((category) => (
                    <>
                      <h3 style={{ marginTop: 20 }}>{category}</h3>
                      {changes[date][category].map((change) => (
                        <li style={{ marginLeft: 40 }}>{change}</li>
                      ))}
                    </>
                  ))}
                  </ul>
                </>
              ))}
            </div>
          </div>
          <div></div>
        </div>
        <div className={styles.footer}>
          
        </div>
      </main>
    </>
  )
}
