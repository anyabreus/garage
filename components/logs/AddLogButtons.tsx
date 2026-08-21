"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import AddFuelLogForm from "./AddFuelLogForm";
import AddMaintenanceLogForm from "./AddMaintenanceLogForm";

export default function AddLogButtons() {
  const [openModal, setOpenModal] = useState<"fuel" | "maintenance" | null>(
    null,
  );

  return (
    <>
      <button onClick={() => setOpenModal("fuel")}>Log Fuel</button>
      <button onClick={() => setOpenModal("maintenance")}>Log Service</button>

      <Modal
        isOpen={openModal === "fuel"}
        onClose={() => setOpenModal(null)}
        title="Add Fuel Log"
      >
        <AddFuelLogForm />
      </Modal>

      <Modal
        isOpen={openModal === "maintenance"}
        onClose={() => setOpenModal(null)}
        title="Add Maintenance Log"
      >
        <AddMaintenanceLogForm />
      </Modal>
    </>
  );
}
