//SideBar.jsx

import * as AiIcons from "react-icons/ai";

const cNameText = "w-full flex justify-start items-center py-2 pl-4 list-none h-[48px]";

export const SidebarData = [
  { title: '#1.0', path: '/', icon: <AiIcons.AiFillHome />, cName: cNameText },
  { title: '#1.1', path: '/module_01_01', icon: <AiIcons.AiFillHome />, cName: cNameText },
  { title: '#1.2', path: '/module_01_02', icon: <AiIcons.AiFillHome />, cName: cNameText },

  // Pai colapsável (sem path)
  {
    title: '#1.3',
    icon: <AiIcons.AiFillHome />,
    cName: cNameText,
    children: [
      { title: '#1.3.1', path: '/Module_01_03_01', icon: <AiIcons.AiFillHome />, cName: cNameText },
      { title: '#1.3.2', path: '/Module_01_03_02', icon: <AiIcons.AiFillHome />, cName: cNameText },
    ]
  },

  { title: '#1.4', path: '/module_01_04', icon: <AiIcons.AiFillHome />, cName: cNameText },
];
