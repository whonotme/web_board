import { GoX } from "react-icons/go";

function Modal({ isOpen, onClose, children, ...props }) {
    const { title } = props;
  return (
    <div className={`modal-my-overlay ${isOpen ? "show" : ""}`}>
      <div className="modal-slide">
        <header className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>
            <GoX size={'30px'} />
          </button>
        </header>

        <div className="modal-content">
            {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;