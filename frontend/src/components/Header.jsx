import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">Failed to load products</p>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-dark-50 to-dark-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-pink/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex justify-around items-start gap-8 py-8 px-4">
        {/* Featured Products Grid */}
        <div className="xl:block lg:hidden md:hidden sm:hidden">
          <h2 className="text-2xl font-bold mb-6 animate-fade-in">
            <span className="text-gradient">Trending Now</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {data.map((product, index) => (
              <div
                key={product._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Main Carousel */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <ProductCarousel />
        </div>
      </div>
    </section>
  );
};

export default Header;
