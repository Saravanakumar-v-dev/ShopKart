import { Link } from "react-router-dom";
import { mockCategories } from "../Utils/mockData";

const CategoryBar = () => {
    return (
        <nav className="category-bar">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between overflow-x-auto hide-scrollbar gap-1">
                    {mockCategories.map((category) => (
                        <Link
                            key={category._id}
                            to={`/shop?category=${category._id}`}
                            className="category-item shrink-0"
                        >
                            <span className="text-2xl">{category.icon}</span>
                            <span className="text-xs whitespace-nowrap">{category.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </nav>
    );
};

export default CategoryBar;
