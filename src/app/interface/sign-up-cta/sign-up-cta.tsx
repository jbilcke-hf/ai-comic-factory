import { useOAuth } from "@/lib/useOAuth"
import { cn } from "@/lib/utils"

function SignUpCTA() {
  const { login, isLoggedIn } = useOAuth({ debug: false })
  if (isLoggedIn) { return null }
  return (
    <div className={cn(
      `print:hidden`,
      `fixed flex flex-col items-center bottom-24 top-28 right-2 md:top-17 md:right-6 z-10`,
    )}>
      <div className="font-bold text-sm pb-2 text-stone-600 bg-stone-50  dark:text-stone-600 dark:bg-stone-50 p-1 rounded-sm">
        anonymous users can generate 1 comic.<br/> <span
          onClick={login}
          className="underline underline-offset-2 cursor-pointer  text-sky-800 dark:text-sky-800 hover:text-sky-700 hover:dark:text-sky-700"
        >Sign-up to Hugging Face</span> to make more!
      </div>
    </div>
  )
}

export default SignUpCTA