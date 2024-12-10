'use client'
import { role } from "../lib/data";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "../store/authStore";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/dashboard/admin",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/teacher.png",
        label: "Profesores",
        href: "/dashboard/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "Miembros de la Iglesia",
        href: "/dashboard/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/parent.png",
        label: "Grupos",
        href: "/dashboard/list/groups",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/subject.png",
        label: "Cursos",
        href: "/dashboard/list/subjects",
        visible: ["admin"],
      },
      {
        icon: "/result.png",
        label: "Resultados",
        href: "/dashboard/list/results",
        visible: ["admin", "teacher", "student", "parent"],
      },

      {
        icon: "/calendar.png",
        label: "Events",
        href: "/dashboard/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/finance.png",
        label: "Pagos",
        href: "/dashboard/list/pago",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/logout.png",
        label: "Logout",
        href: "#", // Evitar enlace directo para manejar el logout
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/create.png",
        label: "Registrar Usuario ",
        href: "/register", // Evitar enlace directo para manejar el logout
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = () => {
  const logout = useAuthStore((state) => state.logout); // Obtener función logout
 // Usar router para redirigir después del logout

  const handleLogout = () => {
    logout(); // Llamar al logout para limpiar el token
    window.location.href = "/"; // Redirigir al login o página principal
  };

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                  onClick={item.label === "Logout" ? handleLogout : undefined} // Manejar el logout
                >
                  <Image src={item.icon} alt="" width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;