"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import AddNewVehicleForm from "./AddNewVehicleForm";

export default function AddNewVehicleButton() {
  const [openModal, setOpenModal] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const openWithReset = () => {
    setFormKey((k) => k + 1);
    setOpenModal(true);
  };

  return (
    <>
      <button onClick={openWithReset}>Add new vehicle</button>
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
