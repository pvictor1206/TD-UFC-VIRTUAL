import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const DropdownMenu = ({ module }) => {
  const [openIndex, setOpenIndex] = useState(null); // abre/fecha "Módulo 1", etc.
  const [openGroup, setOpenGroup] = useState({});   // abre/fecha grupos (#1.3)
  const location = useLocation();

  const toggleModule = (index) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  const toggleGroup = (key) =>
    setOpenGroup((prev) => ({ ...prev, [key]: !prev[key] }));

  const activeClass =
    "bg-[#EFF6FF] border border-[#93C5FD] border-l-[5px] border-l-[#93C5FD]";
  const idleClass = "bg-white border border-transparent";

  return (
    <div className="w-full text-black">
      {module.map((mod, index) => (
        <div key={index} className="mb-2">
          {/* Cabeçalho do módulo */}
          <button
            onClick={() => toggleModule(index)}
            className={`font-semibold w-full text-left text-[14px] py-[16px] px-[16px] transition flex justify-between items-center ${
              openIndex === index ? "" : "border-b"
            } border-gray-300`}
            aria-expanded={openIndex === index}
          >
            {mod.title}
            <FontAwesomeIcon
              icon={openIndex === index ? faChevronUp : faChevronDown}
              className="ml-2"
            />
          </button>

          {openIndex === index && (
            <div className="border-b border-gray-300 rounded-md mt-2">
              {/* descrição do módulo */}
              <ul className="ps-4 space-y-2 text-left text-[14px] text-[#0C1E33]">
                {mod.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>

              {/* páginas e grupos */}
              {mod.title.includes("Módulo") && (
                <ul className="mt-4 space-y-2">
                  {mod.SidebarData?.map((item, i) => {
                    const isActive = item.path && location.pathname === item.path;

                    // Grupo expande só por clique (não por rota ativa)
                    const isExpanded = Array.isArray(item.children)
                      ? !!openGroup[item.title]
                      : false;

                    return (
                      <li key={i} className="w-full list-none">
                        {Array.isArray(item.children) ? (
                          <>
                            {/* Botão do grupo (#1.3) - SEM highlight, mesmo expandido */}
                            <button
                              type="button"
                              onClick={() => toggleGroup(item.title)}
                              aria-expanded={isExpanded}
                              className={`flex items-center justify-between w-full h-12 px-4 rounded ${idleClass} hover:bg-[#F5F8FF]`}
                            >
                              <span className="text-[#0C1E33] text-[14px]">
                                {item.title}
                              </span>
                              <FontAwesomeIcon
                                icon={isExpanded ? faChevronUp : faChevronDown}
                              />
                            </button>

                            {isExpanded && (
                              // sem padding no UL para o highlight ocupar 100%
                              <ul className="mt-1 space-y-1">
                                {item.children.map((child, j) => {
                                  const isChildActive =
                                    location.pathname === child.path;

                                  return (
                                    <li key={j} className="w-full list-none">
                                      <Link
                                        to={child.path}
                                        // alinhamento vertical + recuo menor à esquerda
                                        className={`flex items-center w-full h-12 rounded pl-6 pr-4 ${
                                          isChildActive ? activeClass : idleClass
                                        }`}
                                      >
                                        <span className="text-[#0C1E33] text-[14px]">
                                          {child.title}
                                        </span>
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </>
                        ) : (
                          // ITEM SIMPLES (#1.0, #1.1, #1.2, #1.4)
                          <Link
                            to={item.path}
                            className={`flex items-center w-full h-12 px-4 rounded ${
                              isActive ? activeClass : idleClass
                            }`}
                          >
                            <span className="text-[#0C1E33] text-[14px]">
                              {item.title}
                            </span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DropdownMenu;
