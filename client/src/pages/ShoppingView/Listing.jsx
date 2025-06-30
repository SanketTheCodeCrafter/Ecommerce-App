import Filter from '@/components/ShoppingView/Filter'
import ShoppingProductTile from '@/components/ShoppingView/ShoppingProductTile'
import { Button } from '@/components/ui/button'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { sortOptions } from '@/config/registerFormControls'
import { fetchAllFilteredProducts } from '@/store/shop/product-slice'
import { DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { ArrowUpDownIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Listing = () => {
  const dispatch = useDispatch()
  const { productList } = useSelector((state) => state.shopProducts)

  useEffect(()=>{
    dispatch(fetchAllFilteredProducts())
  }, [dispatch])

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 p-3 md:p-4 bg-muted/30">
      <Filter />
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
              <DropdownMenuContent align="end" className="w-[180px] m-2 shadow-md border border-muted/30 p-4 rounded-md">
                <DropdownMenuRadioGroup>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id} className="text-sm">
                      {sortItem.label}
                    </DropdownMenuRadioItem>
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