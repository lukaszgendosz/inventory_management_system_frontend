import { Modal } from "antd";

interface DeleteModalProps {
    isModalOpen: boolean
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    selectedItem: String | null
    onConfirm: () => void
}

const DeleteModal: React.FC<DeleteModalProps> = ( { isModalOpen, setIsModalOpen, selectedItem, onConfirm }) => {
   
    return (
        <Modal
        title={<strong>Confirm Deletion</strong>}
        open={isModalOpen}
        onOk={onConfirm}
        onCancel={() => setIsModalOpen(false)}
        okText="Yes"
        okType="danger"
        cancelText="No"
        centered
        style={{ top: window.innerHeight < 600 ? 20  : -250 }}
      >
        <p>Are you sure you want to delete <strong>{selectedItem}</strong>?</p>
      </Modal>
    )
}

export default DeleteModal