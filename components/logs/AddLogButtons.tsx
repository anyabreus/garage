"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import AddFuelLogForm from "./AddFuelLogForm";
import AddMaintenanceLogForm from "./AddMaintenanceLogForm";

export default function AddLogButtons() {
  const [openModal, setOpenModal] = useState<"fuel" | "maintenance" | null>(
    null,
  );
  const [formKey, setFormKey] = useState(0);

  const openWithReset = (modal: "fuel" | "maintenance") => {
    setFormKey((k) => k + 1);
    setOpenModal(modal);
  };

  return (
    <>
      <button onClick={() => openWithReset("fuel")}>Log Fuel</button>
      <button onClick={() => openWithReset("maintenance")}>Log Service</button>

      <Modal
        isOpen={openModal === "fuel"}
        onClose={() => setOpenModal(null)}
        title="Add Fuel Log"
      >
        <AddFuelLogForm key={formKey} />
      </Modal>

      <Modal
        isOpen={openModal === "maintenance"}
        onClose={() => setOpenModal(null)}
        title="Add Maintenance Log"
      >
        <AddMaintenanceLogForm key={formKey} />
      </Modal>
    </>
  );
}
