import { FaDiscord } from "react-icons/fa"


export function Discord() {
  return (
    <a
      className="
      flex flex-row items-center justify-center
      h-10
      no-underline
      animation-all duration-150 ease-in-out
      text-stone-700 hover:text-stone-950 scale-95 hover:scale-100"
      href="https://discord.gg/AEruz9B92B"
      target="_blank">
      <div><FaDiscord size={24} /></div>
      <div className="text-sm ml-1.5">Discord</div>
    </a>
  )
}