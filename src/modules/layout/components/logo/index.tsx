import clsx from "clsx"

interface LogoProps {
  className?: string 
  width?: number
  height?: number
}

export const Logo = ({ className = '', width = 150, height = 50 }: LogoProps) => {
  return (
    <img 
      src="/images/store-logo.png" 
      alt="Logo" 
      width={width} 
      height={height}
      className={clsx(className, "w-[5.5rem] h-[1.6rem] md:w-[7.5rem] md:h-[2rem]")}
    />
  )
}
