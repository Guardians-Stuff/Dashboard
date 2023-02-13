import { useRouter } from "next/router"
import Link from "next/link"
import { Button } from "@mui/material"
import DiscordIcon from "./icons/DiscordIcon"

export default function Navbar() {

  const router = useRouter()

  return (
    <div className="nav">
      <div className="navView">
        <ul className="actions">
          <li className="action">
            <h3 style={{marginRight: 10}} onClick={() => { router.push('/') }}>Home</h3>
          </li>
          <li className="action">
            <h3 style={{marginRight: 10}} onClick={() => { router.push('/commands') }}>Commands</h3>
          </li>
          <li className="action">
            <h3 onClick={() => { router.push('/changelog') }}>Changelog</h3>
          </li>
          <li style={{ marginLeft: 'auto' }}>
            <Link href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_HOST)}%2Fapi%2Fauth%2Fcallback%2Fdiscord&response_type=code&scope=identify%20guilds`}>
              <Button variant="contained" color="blurple" startIcon={<DiscordIcon />}>Login with Discord</Button>
            </Link>
          </li>
        </ul>
      </div> 
    </div>
  )
}