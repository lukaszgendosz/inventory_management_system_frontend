import { Modal } from "antd";

interface DeleteModalProps {
    isModalOpen: boolean
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    selectedItem: String | null
    onConfirm: () => void
}

const DeactivateModal: React.FC<DeleteModalProps> = ( { isModalOpen, setIsModalOpen, selectedItem, onConfirm }) => {
   
    return (
        <Modal
        title={<strong>Confirm deactivation</strong>}
        open={isModalOpen}
        onOk={onConfirm}
        onCancel={() => setIsModalOpen(false)}
        okText="Yes"
        okType="danger"
        cancelText="No"
        centered
        style={{ top: window.innerHeight < 600 ? 20  : -250 }}
      >
        <p>Are you sure you want to deactivate <strong>{selectedItem}</strong>?</p>
      </Modal>
    )
}

export default DeactivateModal