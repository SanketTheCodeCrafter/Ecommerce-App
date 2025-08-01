import { filterOptions } from '@/config/registerFormControls'
import { Label } from '@radix-ui/react-label'
import React from 'react'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'
import { Fragment } from 'react'

const Filter = ({filter, handleFilter}) => {
  return (
    <div className='bg-background rounded-lg shadow-sm'>
        <div className="p-4 border-b">
            <h2 className='text-lg font-extrabold'>Filters</h2>
        </div>
        <div className="p-4 space-y-4">
            {Object.keys(filterOptions).map((keyItem)=>(
                <Fragment>
                    <div>
                        <h3 className='text-base font-bold'>{keyItem}</h3>
                        <div className="grid gap-2 mt-2">
                            {filterOptions[keyItem].map((option)=> (
                                <Label className='flex font-medium items-center gap-2'>
                                    <Checkbox 
                                    checked={filter && Object.keys(filter).length > 0 && filter[keyItem] && filter[keyItem].indexOf(option.id) > -1}
                                    onCheckedChange={()=> handleFilter(keyItem, option.id)} />
                                    {option.label}
                                </Label>
                            ))}
                        </div>
                    </div>
                    <Separator />
                </Fragment>
            ))}
        </div>
    </div>
  )
}

export default Filter