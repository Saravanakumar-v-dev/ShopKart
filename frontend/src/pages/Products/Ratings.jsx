import { FiStar } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Ratings = ({ value, text, size = "default" }) => {
  const sizeMap = {
    small: 12,
    default: 14,
    large: 18,
  };

  const iconSize = sizeMap[size] || sizeMap.default;

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(value);
    const hasHalfStar = value - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <FaStar key={i} className="text-warning" style={{ fontSize: iconSize }} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-warning" style={{ fontSize: iconSize }} />
        );
      } else {
        stars.push(
          <FaRegStar key={i} className="text-muted" style={{ fontSize: iconSize }} />
        );
      }
    }
    return stars;
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {renderStars()}
      </div>
      {text && (
        <span className="text-secondary text-sm ml-1">{text}</span>
      )}
    </div>
  );
};

export default Ratings;
