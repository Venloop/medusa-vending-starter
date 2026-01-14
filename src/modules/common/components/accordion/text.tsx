import { getTranslations } from "next-intl/server"


const Text = async ({ text }: { text: string }) => {
    const t = await getTranslations()
    return (
      <div className="text-small-regular py-8">
        <div className="grid grid-cols-1 gap-x-8">
          <div className="text-sm [&>p]:mb-4">
            {text}
          </div>
        </div>
      </div>
    )
  }
  
  export default Text