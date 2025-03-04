import React from "react";

const Navbar = () => {
  return (
    <nav className="shadow-sm shadow-white bg-black flex justify-center  px-4 py-3">
      <div className="container flex justify-between items-center">
        <div className="logo font-bold text-white text-xl md:text-3xl">
          <span className="text-green-400">&lt;</span>PassManager
          <span className="text-green-400">/&gt;</span>
        </div>
        <div className="github">
            <a href="https://github.com/sagarkumar1302" target="blank">
            <img src="./icons/github.png" width={40} alt="github" />
            </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
