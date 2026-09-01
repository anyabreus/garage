"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import AddReminderForm from "../reminders/AddReminderForm";

export default function AddLogButtons() {
  const [openModal, setOpenModal] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const openWithReset = () => {
    setFormKey((k) => k + 1);
    setOpenModal(true);
  };

  return (
    <>
      <button onClick={openWithReset}>Add Reminder</button>

      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Add Reminder"
      >
        <AddReminderForm key={formKey} onSuccess={() => setOpenModal(false)} />
      </Modal>
    </>
  );
}
