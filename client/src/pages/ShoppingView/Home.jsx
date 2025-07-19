import React, { useEffect, useState } from 'react'
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, ShirtIcon, CloudLightning, BabyIcon, WatchIcon, UmbrellaIcon, Shirt, WashingMachine, ShoppingBasket, Airplay, Images, Heater } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts } from '@/store/shop/product-slice';
import ShoppingProductTile from '@/components/ShoppingView/ShoppingProductTile';
import { useNavigate } from 'react-router-dom';

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [bannerOne, bannerTwo, bannerThree]
  const dispatch = useDispatch();
  const { productList } = useSelector(state => state.shopProducts)
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({
      filterParams: {},
      sortParams: 'price-lowtohigh',
    }))
  }, [dispatch])

  function handleNavigateToListingPage (getCurrentItem, section){
    sessionStorage.removeItem('filter');
    const currentFilter = {
      [section] : [getCurrentItem.id],
    };
    sessionStorage.setItem('filter', JSON.stringify(currentFilter));
    navigate('/shop/listing');
  }
  // console.log(productList)
  return (
    <div className='flex flex-col min-h-screen'>
      <div className="relative w-full h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <img src={slide} key={index}
            className={`absolute top-0 left-0 w-full h-full object-cover ${index === currentSlide ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`} />
        ))}
        <Button variant={'outline'} className={'absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80'}
          onClick={() => setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)}
        >
          <ChevronLeftIcon className='w-6 h-6' />
        </Button>
        <Button variant={'outline'} className={'absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80'}
          onClick={() => setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length)}
        >
          <ChevronRightIcon className='w-6 h-6' />
        </Button>
      </div>

      <section className='py-12 bg-gray-50'>
        <div className="container mx-auto px-4">
          <h2 className='text-3xl font-bold text-center mb-8'>
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={()=>handleNavigateToListingPage(categoryItem, 'category')}
                className={'cursor-pointer hover:shadow-lg transition-shadow duration-300'}
              >
                <CardContent className={'flex flex-col items-center justify-center p-6'}>
                  <categoryItem.icon className='w-12 h-12 mb-4 text-primary' />
                  <span className='font-bold'>{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className='py-12'>
        <div className="container mx-auto px-4">
          <h2 className='text-3xl font-bold text-center mb-8'>
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                <ShoppingProductTile
                  // handleGetProductDetails={handleGetProductDetails}
                  product={productItem}

                />
              ))
              : <div className='text-center text-gray-500'>
                No products found
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home