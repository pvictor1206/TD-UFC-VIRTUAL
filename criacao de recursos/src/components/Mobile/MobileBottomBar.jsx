import { Link } from "react-router-dom";
import { GrLinkNext } from "react-icons/gr";

export default function MobileBottomBar({ 
  to, 
  text = "Próximo",
  bgColor = "#1e3a8a"   // cor padrão
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 md:hidden z-50">
      
      <div className="bg-white px-4 py-3 rounded-t shadow-lg">
        <div className="flex justify-end">
          <Link
            to={to}
            className="inline-flex items-center justify-center gap-2
                       rounded-full text-white px-5 py-2
                       shadow-md active:scale-[0.99] transition"
            style={{ backgroundColor: bgColor }}   // 👈 aqui
          >
            <span className="text-[14px] font-medium">{text}</span>
            <GrLinkNext className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="bg-white h-[env(safe-area-inset-bottom)]" />
    </div>
  );
}
