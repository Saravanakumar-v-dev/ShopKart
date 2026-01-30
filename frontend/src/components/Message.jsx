import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";

const Message = ({ variant = "info", children }) => {
  const variants = {
    success: {
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      text: "text-green-400",
      icon: <FaCheckCircle className="w-5 h-5" />
    },
    danger: {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      text: "text-red-400",
      icon: <FaExclamationCircle className="w-5 h-5" />
    },
    warning: {
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      text: "text-orange-400",
      icon: <FaExclamationTriangle className="w-5 h-5" />
    },
    info: {
      bg: "bg-primary-500/10",
      border: "border-primary-500/30",
      text: "text-primary-400",
      icon: <FaInfoCircle className="w-5 h-5" />
    }
  };

  const style = variants[variant] || variants.info;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border ${style.bg} ${style.border} ${style.text} animate-fade-in`}
    >
      <span className="flex-shrink-0 mt-0.5">{style.icon}</span>
      <p className="text-sm leading-relaxed">{children}</p>
    </div>
  );
};

export default Message;
