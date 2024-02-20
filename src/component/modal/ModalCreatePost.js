import React, { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from "reactstrap";
import { getAllYards } from "../../services/userService";

function ModalCreatePost({ isOpen, toggle, createPost }) {
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    memberPostId: "",
    currentMember: 0,
    requiredMember: 0,
    yardName: "",
    clubId: "",
    description: "",
  });

  const [yards, setYards] = useState([]);
  const [yardId, setYardId] = useState("");

  useEffect(() => {
    const fetchYards = async () => {
      try {
        const yards = await getAllYards();
        setYards(yards.result);
      } catch (error) {
        console.error("Error fetching yards:", error);
      }
    };

    fetchYards();
  }, []);

  const handleOnChangeInput = (event, id) => {
    if (id === "yardName") {
      const selectedYard = yards.find(yard => yard.name === event.target.value);
      setYardId(selectedYard.id);
    }
    setFormData({
      ...formData,
      [id]: event.target.value,
    });
  };

  const handleAddNewPost = () => {
    const postData = {
      ...formData,
      yardId: yardId,
    };
    createPost(postData);
    toggle();
  };

  const hours = [];
  for (let i = 5; i <= 21; i++) {
    const hour = `${i < 10 ? '0' : ''}${i}:00`;
    hours.push(hour);
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Create a New Post</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input
            type="textarea"
            id="description"
            onChange={(event) => handleOnChangeInput(event, "description")}
            value={formData.description}
          />
        </FormGroup>
        <FormGroup>
          <Label for="date">Date</Label>
          <Input
            type="date"
            id="date"
            onChange={(event) => handleOnChangeInput(event, "date")}
            value={formData.date}
          />
        </FormGroup>
        <FormGroup>
          <Label for="startTime">Start Time</Label>
          <Input
            type="select"
            id="startTime"
            onChange={(event) => handleOnChangeInput(event, "startTime")}
            value={formData.startTime}
          >
            <option value="">Select Start Time</option>
            {hours.map((hour, index) => (
              <option key={index} value={hour}>
                {hour}
              </option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="endTime">End Time</Label>
          <Input
            type="select"
            id="endTime"
            onChange={(event) => handleOnChangeInput(event, "endTime")}
            value={formData.endTime}
          >
            <option value="">Select End Time</option>
            {hours.map((hour, index) => (
              <option key={index} value={hour}>
                {hour}
              </option>
            ))}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="currentMember">Current Member</Label>
          <Input
            type="number"
            id="currentMember"
            onChange={(event) => handleOnChangeInput(event, "currentMember")}
            value={formData.currentMember}
          />
        </FormGroup>
        <FormGroup>
          <Label for="requiredMember">Required Member</Label>
          <Input
            type="number"
            id="requiredMember"
            onChange={(event) => handleOnChangeInput(event, "requiredMember")}
            value={formData.requiredMember}
          />
        </FormGroup>
        <FormGroup>
          <Label for="yardName">Yard Name</Label>
          <Input
            type="select"
            id="yardName"
            onChange={(event) => handleOnChangeInput(event, "yardName")}
            value={formData.yardName}
          >
            <option value="">Select Yard Name</option>
            {yards.map((yard) => (
              <option key={yard.id} value={yard.name}>
                {yard.name}
              </option>
            ))}
          </Input>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleAddNewPost}>
          Add Post
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalCreatePost;
