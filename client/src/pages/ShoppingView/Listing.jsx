import Filter from '@/components/ShoppingView/Filter'
import ShoppingProductTile from '@/components/ShoppingView/ShoppingProductTile'
import { Button } from '@/components/ui/button'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { sortOptions } from '@/config/registerFormControls'
import { fetchAllFilteredProducts } from '@/store/shop/product-slice'
import { DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { ArrowUpDownIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Listing = () => {
  const dispatch = useDispatch()
  const { productList } = useSelector((state) => state.shopProducts)
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState(null);


  function handleSort(value) {
    console.log(value)
    setSort(value)
  }

  function handleFilter(getSectionId, getCurrentOption){
    let cpyFilter = {...filter};
    const indexOfCurrentSection = Object.keys(cpyFilter).indexOf(getSectionId);

    if(indexOfCurrentSection === -1){
      cpyFilter = {
        ...cpyFilter,
        [getSectionId]: [getCurrentOption]
      };
    }else{
      const indexOfCurrentOption =
      cpyFilter[getSectionId].indexOf(getCurrentOption);

      if(indexOfCurrentOption === -1){
        cpyFilter[getSectionId].push(getCurrentOption);
      }else{
        cpyFilter[getSectionId].splice(indexOfCurrentOption, 1);
        if(cpyFilter[getSectionId].length === 0){
          delete cpyFilter[getSectionId];
        }
      }
    }

    setFilter(cpyFilter);
    sessionStorage.setItem("filter", JSON.stringify(cpyFilter));
  }

  console.log(filter, "filter")


  useEffect(() => {
    setSort('price-lowtohigh');
    setFilter(JSON.parse(sessionStorage.getItem('filter')) || {})
  }, [])

  useEffect(() => {
    dispatch(fetchAllFilteredProducts())
  }, [dispatch])

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 p-3 md:p-4 bg-muted/30">
      <Filter filter={filter} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-md shadow border border-muted/40">
        <div className="p-3 border-b border-muted/30 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground/90">All Products</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground/80">{productList.length} Products</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-foreground/80"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="text-xs">Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[180px] m-2 shadow-md border border-muted/30 p-4 rounded-md z-50 bg-white"
              >
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem, idx) => (
                    <React.Fragment key={sortItem.id}>
                      <DropdownMenuRadioItem
                        value={sortItem.id}
                        className="text-sm px-2 py-2 rounded cursor-pointer hover:bg-gray-100 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                      {/* Add separator except after the last item */}
                      {idx < sortOptions.length - 1 && (
                        <div className="my-1 h-px bg-gray-200" />
                      )}
                    </React.Fragment>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {
            productList && productList.length > 0 ? (
              productList.map((productItem) => (
                <ShoppingProductTile product={productItem} key={productItem._id} />
              ))
            ) : null
          }
        </div>

      </div>
    </div>
  )
}

export default Listing