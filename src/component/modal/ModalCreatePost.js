import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { getAllYards } from "../../services/userService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages, faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import {
  faPenToSquare,
  faClock,
  faPerson,
  faPersonShelter,
  faSignsPost,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function ModalCreatePost({ isOpen, toggle, createPost }) {
  const imageFile = useRef(null)
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
    image: '',
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
    if(id === 'image' && imageFile){
      uploadCloudinary(imageFile.current?.files[0])
    }
    setFormData({
      ...formData,
      [id]: event.target.value,
    });
    if (id === "yardName") {
      const selectedYard = yards.find(
        (yard) => yard.name === event.target.value
      );
      setYardId(selectedYard.id);
    }
  };

  const uploadCloudinary = async (image) => {
    const formDataImage = new FormData();
    formDataImage.append('api_key', '665652388645534');
    formDataImage.append('upload_preset','upload-image');
    formDataImage.append('file', image);
    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/upload-image/image/upload',formDataImage);
      setTimeout(()=> {
        setFormData({
            ...formData,
            image: response.data.url
        })
      },500)
      console.log('Upload cloudinary successfully', response);
    } catch (error) {
      console.log('Error upload cloudinary:', error);
    }
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
    const hour = `${i < 10 ? "0" : ""}${i}:00`;
    hours.push(hour);
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <FontAwesomeIcon icon={faSignsPost} /> Create a New Post
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="description">
            <FontAwesomeIcon icon={faPenToSquare} /> Description
          </Label>
          <Input
            type="textarea"
            id="description"
            onChange={(event) => handleOnChangeInput(event, "description")}
            value={formData.description}
            placeholder="Bạn viết gì đi...."
          />
        </FormGroup>
        <FormGroup>
          <Label for="date">
            <FontAwesomeIcon icon={faCalendarDays} /> Date
          </Label>
          <Input
            type="date"
            id="date"
            onChange={(event) => handleOnChangeInput(event, "date")}
            value={formData.date}
          />
        </FormGroup>
        <FormGroup>
          <Label for="startTime">
            <FontAwesomeIcon icon={faClock} /> Start Time
          </Label>
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
          <Label for="endTime">
            {" "}
            <FontAwesomeIcon icon={faClock} /> End Time
          </Label>
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
          <Label for="currentMember">
            <FontAwesomeIcon icon={faPerson} /> Current Member
          </Label>
          <Input
            type="number"
            id="currentMember"
            onChange={(event) => handleOnChangeInput(event, "currentMember")}
            value={formData.currentMember}
          />
        </FormGroup>
        <FormGroup>
          <Label for="requiredMember">
            <FontAwesomeIcon icon={faPerson} /> Required Member
          </Label>
          <Input
            type="number"
            id="requiredMember"
            onChange={(event) => handleOnChangeInput(event, "requiredMember")}
            value={formData.requiredMember}
          />
        </FormGroup>
        <FormGroup>
          <Label for="yardName">
            <FontAwesomeIcon icon={faPersonShelter} /> Yard Name
          </Label>
          <Input
            type="select"
            id="yardName"
            onChange={(event) => handleOnChangeInput(event, "yardName")}
            value={formData.yardName}
          >
            <option value="">Select Yard Name</option>
            {yards.map((yard) => (
              <option key={yard.id} value={yard.name}>
                {yard.name} - {yard.areaName} - {yard.sportName}
              </option>
            ))}
          </Input>
        </FormGroup>

        <FormGroup>
          <div>
            <FontAwesomeIcon icon={faImages} style={{ fontSize: "30px" }} />
            <input
              type="file"
              ref={imageFile}
              onChange={(event) => handleOnChangeInput(event, 'image')}
            />
          </div>
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
