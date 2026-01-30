import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites?.length || 0;

  return favoriteCount > 0 ? (
    <span className="absolute left-7 top-5 px-2 py-0.5 text-xs font-semibold text-white bg-gradient-to-r from-accent-pink to-primary-500 rounded-full shadow-lg shadow-accent-pink/30">
      {favoriteCount}
    </span>
  ) : null;
};

export default FavoritesCount;
