// MainLayout.js
import { useState } from "react";
import NavBar from "./NavBar";

function MainLayout({ children, modules }) {
  const [sidebar, setSidebar] = useState(false);

  return (
    <div className="flex">
      <NavBar
        sidebar={sidebar}
        setSidebar={setSidebar}
        modules={modules}
      />

      <main
        className={`flex-1 transition-all duration-[450ms] px-[5px] ${
          sidebar ? "md:ml-[320px]" : "md:ml-[57px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
