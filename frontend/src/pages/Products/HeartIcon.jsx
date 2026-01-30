import { useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorites/favoriteSlice";

import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../Utils/localStorage";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites) || [];
  const isFavorite = favorites.some((p) => p._id === product._id);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, [dispatch]);

  const toggleFavorites = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      addFavoriteToLocalStorage(product);
    }
  };

  return (
    <button
      onClick={toggleFavorites}
      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card border border-default flex items-center justify-center transition-all hover:shadow-md"
      title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      {isFavorite ? (
        <FaHeart size={16} className="text-error" />
      ) : (
        <FiHeart size={16} className="text-muted" />
      )}
    </button>
  );
};

export default HeartIcon;
