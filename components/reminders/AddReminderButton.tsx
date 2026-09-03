"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import AddReminderForm from "../reminders/AddReminderForm";
import Button from "../ui/Button";

export default function AddLogButtons() {
  const [openModal, setOpenModal] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const openWithReset = () => {
    setFormKey((k) => k + 1);
    setOpenModal(true);
  };

  return (
    <>
      <Button variant="secondary" onClick={openWithReset}>
        Add Reminder
      </Button>

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
