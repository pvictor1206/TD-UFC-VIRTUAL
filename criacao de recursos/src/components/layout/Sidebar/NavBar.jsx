// NavBar.jsx

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";
import ProgressBar from "@ui/BarProgress/ProgressBar";
import UseScrollProgress from "@ui/BarProgress/UseScrollProgress";

function NavBar({ sidebar, setSidebar, modules }) {
  const showSidebar = () => setSidebar(!sidebar)

  // % de rolagem da página
  const progresso = UseScrollProgress();

  // Cor padrão do módulo
  const moduleColor = modules?.[0]?.color;
  const moduleColorProgressBar = modules?.[0]?.colorProgressBar;

  // Bloqueia o scroll quando o menu está aberto (mobile)
  useEffect(() => {
    if (window.innerWidth < 768) {
      document.body.style.overflow = sidebar ? "hidden" : "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebar]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="py-[15px] flex items-center justify-between px-4 md:px-[75px]">
          <Link to="#" onClick={showSidebar} className="flex items-center gap-2">
            <FaIcons.FaBars className="w-5 h-5" style={{ color: moduleColor }} />
            <span className="font-semibold" style={{ color: moduleColor }}> 
              {modules?.[0]?.title}   {/* Coloca o título na parte de abrir o DropDown */}
            </span>
          </Link>
        </div>
        <ProgressBar 
            porcentagem={progresso} 
            colorProgress={moduleColorProgressBar}
          />
      </div>

      {/* Backdrop apenas no mobile */}
      <div
        onClick={showSidebar}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden
          ${sidebar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden="true"
      />

      {/* Menu — sobreposto no mobile */}
      <nav
        className={`w-[298px] fixed inset-y-0 top-0 left-0 flex flex-col justify-start items-start
          transition-transform duration-300 bg-[#fff] shadow-xl/20 z-50
          ${sidebar ? "translate-x-0" : "-translate-x-full"}`}
      >
        <ul className="w-full">
          <li
              className="w-full h-[95px] flex justify-start items-center rounded-b-lg"
              style={{ backgroundColor: moduleColor }}
            >
            <Link to="#" className="flex items-start w-full">
              <h2 className="font-normal pl-[16px] pr-[32px] h-[60px] text-[#F3F3F3] text-left text-[14px] flex-grow">
                FILOSOFIA DA TECNOLOGIA EaD
              </h2>
              <AiIcons.AiOutlineClose
                onClick={showSidebar}
                className="w-[60px] h-[60px] text-white cursor-pointer pr-[16px]"
              />
            </Link>
          </li>
          <li className="flex justify-start items-center">
            <DropdownMenu module={modules} />
          </li>
        </ul>
      </nav>
    </>
  );
}

export default NavBar;
