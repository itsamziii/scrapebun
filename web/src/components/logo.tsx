import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo = ({
  className = "",
  width = 40,
  height = 40,
}: LogoProps) => {
  return (
    <Image
      src="/logo.png"
      alt="ScrapeBun Logo"
      width={width}
      height={height}
      priority
      className={`object-contain ${className}`}
    />
  );
};

export default Logo;
