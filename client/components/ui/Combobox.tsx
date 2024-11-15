'use client'

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@components/command'
import { Popover, PopoverContent, PopoverTrigger } from '@components/popover'
import useAPI from '@hooks/useAPI'
import { cn } from '@lib/utils'
import type { ICategory } from '@type/task'
import React, { useState, type FC } from 'react'
import { IoIosArrowDown, IoIosArrowUp, IoIosCheckmark } from 'react-icons/io'
import useSWR from 'swr'
import { Button } from './button'

const Combobox: FC<{
  value?: string
  setValue?: (value: string) => void
}> = ({ value, setValue }) => {
  const { fetcher } = useAPI()
  const { data: categories } = useSWR<ICategory[]>('/task/category', fetcher, {
    revalidateOnFocus: false,
  })
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = useState('')
  const [searchSelected, setSearchSelected] = useState('')
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-primary-md border-transparent rounded-xl h-14 mb-5 text-base"
        >
          {value ? (
            categories?.find((framework) => framework.id === value)?.name ||
            searchSelected
          ) : (
            <span className="opacity-50">Select category</span>
          )}
          <div className="flex flex-col text-sm">
            <IoIosArrowUp className="opacity-50 text-white -mb-0.5" />
            <IoIosArrowDown className="opacity-50 text-white -mt-0.5" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[90vw] p-0 border-transparent rounded-t-xl">
        <Command className="border-transparent">
          <CommandInput
            placeholder="Search framework..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandGroup>
              {categories?.map((framework) => (
                <CommandItem
                  key={framework.id}
                  value={framework.id}
                  onSelect={(currentValue) => {
                    setValue?.(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  {framework.name}
                  <IoIosCheckmark
                    className={cn(
                      'ml-auto',
                      value === framework.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
              {search &&
                search !== searchSelected &&
                categories?.filter((framework) =>
                  framework.name.toLowerCase().includes(search.toLowerCase()),
                ).length === 0 && (
                  <CommandItem
                    value={search}
                    onSelect={() => {
                      setValue?.(search)
                      setSearchSelected(search)
                      setOpen(false)
                    }}
                  >
                    {search}
                    <IoIosCheckmark
                      className={cn(
                        'ml-auto',
                        value === search ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                )}
              {searchSelected && (
                <CommandItem
                  value={searchSelected}
                  onSelect={(currentValue) => {
                    setValue?.(
                      currentValue === searchSelected ? '' : currentValue,
                    )
                    setSearchSelected(
                      currentValue === searchSelected ? '' : currentValue,
                    )
                    setOpen(false)
                  }}
                >
                  {searchSelected}
                  <IoIosCheckmark
                    className={cn(
                      'ml-auto',
                      value === searchSelected ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Combobox
