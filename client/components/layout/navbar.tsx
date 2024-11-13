'use client'

import wave from '@assets/wave.svg'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { type CSSProperties, type FC } from 'react'
import { FiPlus } from 'react-icons/fi'
import { GoHome, GoHomeFill, GoPlus } from 'react-icons/go'
import { HiOutlineUser, HiPencil, HiUser } from 'react-icons/hi2'
import {
  IoCalendarClear,
  IoCalendarClearOutline,
  IoSettings,
  IoSettingsOutline,
} from 'react-icons/io5'
import type { IconType } from 'react-icons/lib'

const NavItem: FC<{
  selectedTab: string
  title: string
  icon: IconType
  iconFill: IconType
  iconStyle?: CSSProperties
  href: string
  match?: string[]
}> = ({
  selectedTab,
  title,
  icon: Icon,
  iconFill: IconFill,
  iconStyle,
  href,
  match = [],
}) => {
  const matches = match.length
    ? match.find((i) => i === selectedTab || selectedTab.startsWith(i))
    : selectedTab === href
  return (
    <Link
      href={href}
      className="w-[25%] h-full flex justify-center items-center"
    >
      <div
        className={clsx(
          'size-fit text-white transition-all',
          matches && 'translate-y-[-4vh] md:translate-y-[-24px]',
        )}
      >
        <Icon
          style={iconStyle}
          className={clsx('size-6 absolute', matches && 'opacity-0')}
        />
        <IconFill
          style={iconStyle}
          className={clsx('size-6', !matches && 'opacity-0')}
        />
      </div>
      <div
        className={clsx(
          'absolute top-[50%] md:top-[60%] transition-all text-sm',
          !matches && 'opacity-0',
        )}
      >
        {title}
      </div>
    </Link>
  )
}

const Navbar = () => {
  const pos = [
    { href: '/calendar', position: '29.5%' },
    { href: '/view', position: '29.5%' },
    { href: '/add', position: '50%' },
    { href: '/edit', position: '50%' },
    { href: '/account', position: '70.5%' },
    { href: '/settings', position: '90.75%' },
    { href: '/', position: '9.25%' },
  ]
  const pathname = usePathname()
  return (
    <nav className="h-[9vh] bg-primary-md w-[100vw] md:w-[40vw] md:bottom-[5vh] md:rounded-lg fixed bottom-0 left-[50%] translate-x-[-50%] flex items-center gap-2">
      <Image
        src={wave}
        alt="wave"
        className="absolute top-0 size-[7rem] h-fit translate-x-[-50%] transition-all"
        style={{
          left:
            pos.find((i) => pathname === i.href || pathname.startsWith(i.href))
              ?.position || '-1000%',
        }}
        priority
      />
      <div
        className="absolute size-12 rounded-full bg-[#03b5fb] top-0 translate-y-[-40%] translate-x-[-50%] transition-all"
        style={{
          left:
            pos.find((i) => pathname === i.href || pathname.startsWith(i.href))
              ?.position || '-1000%',
        }}
      />
      <NavItem
        selectedTab={pathname}
        title="Home"
        iconFill={GoHomeFill}
        icon={GoHome}
        iconStyle={{
          width: '1.75rem',
          height: '1.75rem',
        }}
        href="/"
      />
      <NavItem
        selectedTab={pathname}
        title="Calendar"
        iconFill={IoCalendarClear}
        icon={IoCalendarClearOutline}
        href="/calendar"
        match={['/calendar', '/view']}
      />
      {pathname.split('/')[1] === 'edit' ? (
        <NavItem
          selectedTab={pathname}
          title="Edit"
          iconFill={HiPencil}
          icon={HiPencil}
          iconStyle={{
            width: '1.25rem',
            height: '1.25rem',
          }}
          href={pathname}
        />
      ) : (
        <NavItem
          selectedTab={pathname}
          title="Add"
          iconFill={FiPlus}
          icon={GoPlus}
          iconStyle={{
            width: '1.75rem',
            height: '1.75rem',
          }}
          href="/add"
        />
      )}
      <NavItem
        selectedTab={pathname}
        title="Account"
        iconFill={HiUser}
        icon={HiOutlineUser}
        href="/account"
      />
      <NavItem
        selectedTab={pathname}
        title="Settings"
        iconFill={IoSettings}
        icon={IoSettingsOutline}
        href="/settings"
      />
    </nav>
  )
}

export default Navbar
