import React, { useRef, useState } from "react";
import MemberManage from "./MemberManage";
import StaffManage from "./StaffManage";
import ClubManage from "./ClubManage";
import { handleLogOut } from "../../services/userService";
import "./AdminPage.scss";
import HeaderAdmin from "../../component/Header/HeaderAdmin";
import SportManage from "./SportManage";
import ApprovalManage from "./Approval";
import Yard from "./Yard/Yard";
import Building from "./Building.js/Building";

const menuItems = [
  {
    name: "ADMIN",
    // icon: "settings",
    items: ["Thành viên", "Nhân viên", "Câu lạc bộ", "Môn thể thao", "Sân", "Tòa nhà", "Phê duyệt"],
  },
  {
    name: "Đăng xuất",
    // icon: "favorite",
  },
  // {
  //   name: "Đăng xuất",
  //   // icon: "favorite",
  // },
];

const componentsMap = {
  "Thành viên": <MemberManage />,
  "Nhân viên": <StaffManage />,
  "Câu lạc bộ": <ClubManage />,
  "Môn thể thao": <SportManage />,

  "Sân": <Yard />,
  "Tòa nhà": <Building />,
  "Phê duyệt": <ApprovalManage />,
};

const Icon = ({ icon }) => (
  <span className="material-symbols-outlined">{icon}</span>
);

const NavButton = ({ onClick, name, icon, isActive, hasSubNav }) => (
  <button
    type="button"
    onClick={() => onClick(name)}
    className={isActive ? "active" : ""}
  >
    {icon && <Icon icon={icon} />}
    <span>{name}</span>
    {hasSubNav}
  </button>
);

const SubMenu = ({ item, activeItem, handleClick }) => {
  const navRef = useRef(null);

  const isSubNavOpen = (item, items) =>
    items.some((i) => i === activeItem) || item === activeItem;

  return (
    <div
      className={`sub-nav ${isSubNavOpen(item.name, item.items) ? "open" : ""}`}
      style={{
        height: !isSubNavOpen(item.name, item.items)
          ? 0
          : navRef.current?.clientHeight,
      }}
    >
      <div ref={navRef} className="sub-nav-inner">
        {item?.items.map((subItem, index) => (
          <NavButton
            key={index}
            onClick={handleClick}
            name={subItem}
            isActive={activeItem === subItem}
          />
        ))}
      </div>
    </div>
  );
};

function AdminPage() {
  const [activeItem, setActiveItem] = useState("");

  const handleClick = async (item) => {
    console.log(item);
    try {
      if (item && item === "LOGOUT") {
        await handleLogOut();
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        window.location.href = "/";
      } else {
        setActiveItem(item !== activeItem ? item : "");
      }
    } catch (error) {
      console.error("Đăng xuất thất bại", error);
    }
  };

  return (
    <div>
      <HeaderAdmin />
      <aside
        className="sidebar col-2"
        style={{
          float: "left",
          width: "300px",
          padding: "20px",
          marginTop: "70px",
        }}
      >
        {menuItems.map((item) => (
          <div key={item.name}>
            {!item.items && (
              <NavButton
                onClick={handleClick}
                name={item.name}
                icon={item.icon}
                isActive={activeItem === item.name}
                hasSubNav={!!item.items}
              />
            )}
            {item.items && (
              <>
                <NavButton
                  onClick={handleClick}
                  name={item.name}
                  icon={item.icon}
                  isActive={activeItem === item.name}
                  hasSubNav={!!item.items}
                />
                <SubMenu
                  activeItem={activeItem}
                  handleClick={handleClick}
                  item={item}
                />
              </>
            )}
          </div>
        ))}
      </aside>
      <div className="content" style={{ marginLeft: "300px", padding: "20px" }}>
        {componentsMap[activeItem]}
      </div>
    </div>
  );
}

export default AdminPage;
