import "./MemberManage.scss";
import React, { useEffect, useState } from "react";
import {
  getAllMembers,
  createMember,
  editMember,
  deleteMember,
  getAllBuildings,
} from "../../services/userService";
import ModalEditMember from "../../component/modal/ModalEditMember";
import ModalMember from "../../component/modal/ModalMember";
import { showSuccessToast, showErrorToast } from "../../component/toast/toast";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Button from "@mui/material/Button";

function MemberManage() {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [memberEdit, setMemberEdit] = useState("");
  const [buildings, setBuildings] = useState([]);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    fetchApiMembers();
    fetchBuildings();
  }, []);

  useEffect(() => {
    fetchApiMembers(filter);
  }, [filter]);

  const fetchApiMembers = async (filter = {}) => {
    try {
      let data;
      let applyFilter = false;

      for (const key in filter) {
        if (filter[key]) {
          applyFilter = true;
          break;
        }
      }

      if (!applyFilter) {
        data = await getAllMembers();
      } else {
        data = await getAllMembers(filter);
        console.log(data);
      }

      setMembers(data.result);
    } catch (error) {
      setMembers([]);
      console.error(error);
    }
  };

  const fetchBuildings = async () => {
    try {
      const buildRes = await getAllBuildings();
      setBuildings(buildRes.result);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleModalEdit = () => {
    setIsModalEdit(!isModalEdit);
  };

  const doCreateNewUser = async (data) => {
    try {
      await createMember(data);
      showSuccessToast("Thêm thành viên thành công");
      setIsModalOpen(false);
      fetchApiMembers();
    } catch (error) {
      console.error(error);
    }
  };

  const doEditUser = async (editMemberId, data) => {
    try {
      await editMember(editMemberId, data);
      await fetchApiMembers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (user) => {
    setMemberEdit(user);
    setIsModalEdit(true);
  };

  const handleDeleteUser = async (user) => {
    try {
      if (user && user.id) {
        await deleteMember(user.id);
        showSuccessToast("Xóa thành viên thành công!");
        await fetchApiMembers();
      }
    } catch (error) {
      showErrorToast("Xóa thành viên không thành công!");
      console.error(error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  return (
    <div className="users-container" style={{ marginTop: "70px" }}>
      <div className="mx-1">
        <Button className="add-Member" variant="outlined" onClick={toggleModal}>
          <i className="fa fa-plus"></i> Thêm thành viên
        </Button>
      </div>
      <ModalMember
        isOpen={isModalOpen}
        toggleFromParent={toggleModal}
        createNewUser={doCreateNewUser}
      />
      <ModalEditMember
        isOpen={isModalEdit}
        currentUser={memberEdit}
        toggleFromParent={toggleModalEdit}
        editUser={doEditUser}
      />
      <div className="users-table mt-3 mx-2">
        <table id="customers">
          <tbody>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th style={{ display: "flex", alignItems: "center" }}>
                <div style={{ marginLeft: "auto", marginRight: "10px" }}>
                  Giới tính
                </div>
                <FormControl variant="standard" sx={{ minWidth: 0 }}>
                  <InputLabel id="gender-filter-label"></InputLabel>
                  <Select
                    labelId="gender-filter-label"
                    id="gender-filter"
                    name="gender"
                    value={filter.gender || ""}
                    onChange={handleFilterChange}
                    label="Giới tính"
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="male">Nam</MenuItem>
                    <MenuItem value="female">Nữ</MenuItem>
                    <MenuItem value="other">Khác</MenuItem>
                  </Select>
                </FormControl>
              </th>
              <th>Hình ảnh</th>
              <th style={{ display: "flex", alignItems: "center" }}>
                <div style={{ marginLeft: "auto", marginRight: "10px" }}>
                  Tòa nhà
                </div>
                <FormControl variant="standard" sx={{ minWidth: 0 }}>
                  <InputLabel id="building-filter-label"></InputLabel>
                  <Select
                    labelId="building-filter-label"
                    id="building-filter"
                    name="buildingId"
                    value={filter.buildingId || ""}
                    onChange={handleFilterChange}
                    label="Tòa"
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    {buildings.map((building) => (
                      <MenuItem key={building.id} value={building.id}>
                        {building.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </th>
              <th>Số điện thoại</th>
              <th>Hoạt động</th>
            </tr>
            {members.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.gender}</td>
                <td>
                  <img
                    width={50}
                    height={50}
                    src={item.image}
                    alt={item.name}
                  />
                </td>
                <td>{item.buildingName}</td>
                <td>{item.phoneNumber}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(item)}>
                    <i className="fa fa-pencil"></i>
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteUser(item)}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MemberManage;
