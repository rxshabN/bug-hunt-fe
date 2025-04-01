import Image from "next/image";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between w-full px-10 h-[20vh]">
      <Image src="/siam-black.png" width={300} height={300} alt="siam logo" />
      <h1 className="text-6xl">Bug Hunt 2.0</h1>
    </div>
  );
};

export default Navbar;
