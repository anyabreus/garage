"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import AddFuelLogForm from "./AddFuelLogForm";
import AddMaintenanceLogForm from "./AddMaintenanceLogForm";
import Button from "../ui/Button";

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
      <Button variant="secondary" onClick={() => openWithReset("fuel")}>
        Log Fuel
      </Button>
      <Button variant="secondary" onClick={() => openWithReset("maintenance")}>
        Log Service
      </Button>

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
