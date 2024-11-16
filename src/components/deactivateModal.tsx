import { Modal } from "antd";

interface DeleteModalProps {
    isModalOpen: boolean
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    selectedItem: String | null
    onConfirm: () => void
    title: string
    message: string
}

const DeactivateModal: React.FC<DeleteModalProps> = ( { isModalOpen, setIsModalOpen, selectedItem, onConfirm, title, message }) => {
   
    return (
        <Modal
        title={<strong>{title}</strong>}
        open={isModalOpen}
        onOk={onConfirm}
        onCancel={() => setIsModalOpen(false)}
        okText="Yes"
        okType="danger"
        cancelText="No"
        centered
        style={{ top: window.innerHeight < 600 ? 20  : -250 }}
      >
        <p>{message} <strong>{selectedItem}</strong>?</p>
      </Modal>
    )
}

export default DeactivateModal