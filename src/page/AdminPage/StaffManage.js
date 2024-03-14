import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import { getAllStaffs, createStaff, editStaff, deleteStaff } from '../../services/staffService';
import ModalStaff from '../../component/modal/ModalStaff';
import ModalEditStaff from '../../component/modal/ModalEditStaff';
import { showErrorToast, showSuccessToast } from '../../component/toast/toast';

function StaffManage() {
  const [staffList, setStaffList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState(null);

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      const data = await getAllStaffs();
      setStaffList(data.result);
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

  const createNewStaff = async (formData) => {
    try {
      await createStaff(formData);
      showSuccessToast("Tạo thêm nhân viên thành công")
      fetchStaffList();
    } catch (error) {
        showErrorToast("Tạo thêm viên viên thất bại")
      console.error(error);
    }
  };

  const editStaffInfo = async (staffId, formData) => {
    try {
      await editStaff(staffId, formData);
      showSuccessToast('Cập nhập nhân viên thành công')
      fetchStaffList();
    } catch (error) {
        showErrorToast('Cập nhập nhân viên thất bại');
      console.error(error);
    }
  };

  const deleteStaffInfo = async (staffId) => {
    try {
      await deleteStaff(staffId);
      showSuccessToast('Xóa nhân viên thành công')
      fetchStaffList();
    } catch (error) {
        showErrorToast('Xóa nhân viên thất bại');
      console.error(error);
    }
  };

  const handleEditStaff = (staff) => {
    setStaffToEdit(staff);
    setIsModalEdit(true);
  };

  return (
    <div className="users-container" style={{ marginTop: '70px' }}>
      <div className="mx-1">
        <Button className="btn btn-primary px-3" onClick={toggleModal}>
          <i className="fa fa-plus"></i>
          Thêm nhân viên
        </Button>
      </div>
      <ModalStaff isOpen={isModalOpen} toggleFromParent={toggleModal} createNewStaff={createNewStaff} />
      <ModalEditStaff isOpen={isModalEdit} toggleFromParent={toggleModalEdit} currentStaff={staffToEdit} editStaff={editStaffInfo} />
      <div className="users-table mt-3 mx-2">
        <table id="customers">
          <tbody>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Giới tính</th>
              <th>Hình ảnh</th>
              <th>Hành động</th>
            </tr>
            {staffList.map((staff, index) => {
                if(staff.status && staff.status === 1) {
                    return (
                      <tr key={index}>
                        <td>{staff.name}</td>
                        <td>{staff.email}</td>
                        <td>{staff.gender}</td>
                        <td><img width={50} height={50} src={staff.image} alt={staff.name} /></td>
                        <td>
                          <button className="btn-edit" onClick={() => handleEditStaff(staff)}>
                            <i className="fa fa-pencil"></i>
                          </button>
                          <button className="btn-delete" onClick={() => deleteStaffInfo(staff.id)}>
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                    </tr>
                    )
                }
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StaffManage;
