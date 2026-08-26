"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import AddNewVehicleForm from "./AddNewVehicleForm";

export default function AddNewVehicleButton() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <button onClick={() => setOpenModal(true)}>Add new vehicle</button>
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Add Vehicle"
      >
        <AddNewVehicleForm />
      </Modal>
    </>
  );
}
