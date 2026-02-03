import { getSearchResults, resetSearchResults } from '@/store/shop/search-slice';
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { toast } from 'sonner';
import { fetchProductDetails } from '@/store/shop/product-slice';
import ProductDetails from './ProductDetails';
import { Input } from '@/components/ui/input';
import ShoppingProductTile from '@/components/ShoppingView/ShoppingProductTile';
import { Search as SearchIcon, X, TrendingUp, Clock, ShoppingBag, Shirt, Baby, Footprints, Watch, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Popular categories for suggestions
const popularCategories = [
  { id: 'men', label: 'Men', icon: Shirt, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
  { id: 'women', label: 'Women', icon: Sparkles, color: 'bg-pink-50 text-pink-600 hover:bg-pink-100' },
  { id: 'kids', label: 'Kids', icon: Baby, color: 'bg-green-50 text-green-600 hover:bg-green-100' },
  { id: 'footwear', label: 'Footwear', icon: Footprints, color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
  { id: 'accessories', label: 'Accessories', icon: Watch, color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
];

// Trending search suggestions
const trendingSearches = ['Summer dress', 'Nike shoes', 'Casual shirts', 'Jeans', 'Sneakers'];

// Helper to get recent searches from localStorage
function getRecentSearches() {
  try {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Helper to save recent search to localStorage
function saveRecentSearch(keyword) {
  if (!keyword || keyword.trim().length < 2) return;
  try {
    const recent = getRecentSearches();
    const filtered = recent.filter(s => s.toLowerCase() !== keyword.toLowerCase());
    const updated = [keyword, ...filtered].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }
}

// Skeleton loader component
function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="bg-white rounded-xl border overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-50" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
            <div className="h-8 bg-slate-200 rounded w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

const Search = () => {
  const [keyword, setKeyword] = useState('');
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [recentSearches, setRecentSearches] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const { searchResults, isLoading } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const cartItemsArray = cartItems?.items || [];

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (keyword && keyword.trim().length > 0) {
      debounceRef.current = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
        setHasSearched(true);
        saveRecentSearch(keyword.trim());
        setRecentSearches(getRecentSearches());
      }, 400);
    } else {
      setSearchParams(new URLSearchParams(''));
      dispatch(resetSearchResults());
      setHasSearched(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [keyword, dispatch, setSearchParams]);

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    const getCartItems = cartItemsArray;

    if (getCartItems.length) {
      const indexOfCurrentCartItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentCartItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
        if (typeof getTotalStock === 'number' && getQuantity + 1 > getTotalStock) {
          toast.warning(`Only ${getQuantity} items left in stock`)
          return;
        }
      }
    }

    dispatch(addToCart({
      userId: user?.id,
      productId: getCurrentProductId,
      quantity: 1,
    })).then(data => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success('Product added to cart!');
      } else {
        if (data?.payload?.message) {
          toast.error(data?.payload?.message);
        } else {
          toast.error('Something went wrong!');
        }
      }
    })
  }

  function handleGetProductDetails(productId) {
    dispatch(fetchProductDetails(productId))
  }

  function handleCategoryClick(categoryId) {
    sessionStorage.setItem('filter', JSON.stringify({ category: [categoryId] }));
    navigate('/shop/listing');
  }

  function handleSuggestionClick(suggestion) {
    setKeyword(suggestion);
  }

  function clearSearch() {
    setKeyword('');
    dispatch(resetSearchResults());
    setHasSearched(false);
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  const showEmptyState = !hasSearched && !keyword.trim();
  const showNoResults = hasSearched && !isLoading && searchResults.length === 0 && keyword.trim();
  const showResults = hasSearched && !isLoading && searchResults.length > 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto md:px-6 px-4 py-8">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            Search Products
          </h1>
          <p className="text-slate-500 text-sm md:text-base">
            Find exactly what you're looking for
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon className="h-5 w-5" />
            </div>
            <Input
              value={keyword}
              name="keyword"
              onChange={(event) => setKeyword(event.target.value)}
              className="pl-12 pr-12 py-6 text-base rounded-xl border-slate-200 shadow-sm focus:shadow-md focus:border-blue-300 transition-all bg-white"
              placeholder="Search for products, brands, categories..."
            />
            {keyword && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && <SearchSkeleton />}

        {/* Empty State - Before Searching */}
        {showEmptyState && (
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Popular Categories */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="h-5 w-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-800">Popular Categories</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {popularCategories.map((cat) => {
                  const IconComponent = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-transparent transition-all duration-200 ${cat.color}`}
                    >
                      <IconComponent className="h-6 w-6" />
                      <span className="text-sm font-medium">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trending Searches */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-800">Trending Searches</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSuggestionClick(term)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-slate-600" />
                  <h2 className="text-lg font-semibold text-slate-800">Recent Searches</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSuggestionClick(term)}
                      className="px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-600 hover:bg-slate-200 transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Results State */}
        {showNoResults && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
              <SearchIcon className="h-10 w-10 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              No results for "{keyword}"
            </h2>
            <p className="text-slate-500 mb-6">
              We couldn't find any products matching your search. Try different keywords or browse our categories.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularCategories.slice(0, 3).map((cat) => (
                <Button
                  key={cat.id}
                  variant="outline"
                  onClick={() => handleCategoryClick(cat.id)}
                  className="rounded-full"
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Results State */}
        {showResults && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600">
                Found <span className="font-semibold text-slate-800">{searchResults.length}</span> products for "{keyword}"
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {searchResults.map((item) => (
                <ShoppingProductTile
                  key={item._id}
                  handleAddToCart={handleAddToCart}
                  product={item}
                  handleGetProductDetails={handleGetProductDetails}
                />
              ))}
            </div>
          </div>
        )}

        {/* Product Details Dialog */}
        <ProductDetails
          open={openDetailsDialog}
          setOpen={setOpenDetailsDialog}
          productDetails={productDetails}
        />
      </div>
    </div>
  );
}

export default Search