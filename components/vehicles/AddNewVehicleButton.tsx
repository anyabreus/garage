"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import AddNewVehicleForm from "./AddNewVehicleForm";
import Button from "../ui/Button";

export default function AddNewVehicleButton() {
  const [openModal, setOpenModal] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const openWithReset = () => {
    setFormKey((k) => k + 1);
    setOpenModal(true);
  };

  return (
    <>
      <Button onClick={openWithReset}>Add new vehicle</Button>
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Add Vehicle"
      >
        <AddNewVehicleForm key={formKey} />
      </Modal>
    </>
  );
}
