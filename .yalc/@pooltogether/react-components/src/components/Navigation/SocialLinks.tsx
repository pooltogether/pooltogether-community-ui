import React, { useState } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'

import { Accordion } from '../Accordion'

import KnowledgeBaseIcon from '../../assets/Socials/knowledge-base.svg'
import DocsIcon from '../../assets/Socials/docs.svg'
import GovForumIcon from '../../assets/Socials/gov-forum.svg'
import TreasuryIcon from '../../assets/Socials/treasury.svg'

import MediumLogo from '../../assets/Socials/medium-logo.svg'
import DiscordLogo from '../../assets/Socials/discord-logo.svg'
import TwitterLogo from '../../assets/Socials/twitter-logo.svg'
import TelegramLogo from '../../assets/Socials/telegram-logo.svg'

const sharedClasses =
  'relative leading-none w-full flex justify-start items-center text-accent-4 hover:text-highlight-2 py-2 px-6 trans outline-none focus:outline-none active:outline-none mb-1 ml-3 lg:ml-0 h-10'

const headerClasses = 'text-lg font-bold'

const childClasses = 'text-xs'

const socialsLinkData = [
  {
    langKey: 'ecosystem',
    headerLabel: 'ecosystem',
    childLinks: [
      {
        href: 'https://www.notion.so/PoolTogether-Knowledge-Base-fa721ccefa3242eaabd125a8415acd27',
        langKey: 'knowledgeBase',
        label: 'Knowledge Base',
        icon: <img src={KnowledgeBaseIcon} className='w-4 opacity-50 mx-auto' />
      },
      {
        href: 'https://docs.pooltogether.com/',
        langKey: 'documentation',
        label: 'Documentation',
        icon: <img src={DocsIcon} className='w-3 opacity-50 mx-auto' />
      },
      {
        href: 'https://gov.pooltogether.com/',
        langKey: 'governanceForum',
        label: 'Governance forum',
        icon: <img src={GovForumIcon} className='w-4 opacity-50 mx-auto' />
      },
      {
        href: 'https://info.pooltogether.com/',
        langKey: 'treasury',
        label: 'Treasury',
        icon: <img src={TreasuryIcon} className='w-4 opacity-50 mx-auto' />
      }
    ]
  },
  {
    langKey: 'socials',
    headerLabel: 'socials',
    childLinks: [
      {
        href: 'https://twitter.com/PoolTogether_',
        label: 'Twitter',
        icon: <img src={TwitterLogo} className='w-4 opacity-50 mx-auto' />
      },
      {
        href: 'https://t.me/PoolTogetherTelegram',
        label: 'Telegram',
        icon: <img src={TelegramLogo} className='w-4 opacity-50 mx-auto hover:opacity-100 trans' />
      },
      {
        href: 'https://pooltogether.com/discord/',
        label: 'Discord',
        icon: <img src={DiscordLogo} className='w-4 opacity-50 mx-auto hover:opacity-100 trans' />
      },
      {
        href: 'https://medium.com/pooltogether',
        label: 'Medium',
        icon: <img src={MediumLogo} className='w-4 opacity-50 mx-auto hover:opacity-100 trans' />
      }
    ]
  }
]

export const SocialLinks = (props) => {
  const { t } = props

  if (!t) {
    console.error('<SocialLinks /> requires the prop t (i18n trans method)')
  }

  const [expanded, setExpanded] = useState()

  return (
    <>
      {socialsLinkData.map((linkData, index) => {
        return (
          <SocialLinkSet
            t={t}
            key={`social-link-set-${index}`}
            index={index}
            linkData={linkData}
            expanded={expanded}
            setExpanded={setExpanded}
          />
        )
      })}
    </>
  )
}

const SocialLinkSet = (props) => {
  const { linkData } = props

  const content = linkData.childLinks.map((childLink, index) => {
    return <SocialLinkChild {...props} key={`social-link-child-${index}`} childLink={childLink} />
  })

  return <SocialLinkHeader {...props}>{content}</SocialLinkHeader>
}

const SocialLinkHeader = (props) => {
  const { t } = props

  return (
    <Accordion
      openUpwards
      key={`social-link-${props.index}`}
      i={props.index}
      expanded={props.expanded}
      setExpanded={props.setExpanded}
      content={props.children}
      header={
        <a className={classnames(sharedClasses, headerClasses)}>
          <FeatherIcon
            icon='chevron-up'
            strokeWidth='0.25rem'
            className={classnames('w-4 h-4 stroke-current trans', {
              'rotate-180': props.expanded === props.index
            })}
          />
          <span className='pl-3 capitalize'>
            {t(props.linkData.langKey, props.linkData.headerLabel)}
          </span>
        </a>
      }
    />
  )
}

const SocialLinkChild = (props) => {
  const { t, childLink } = props
  const { langKey, label, icon, href, target } = childLink

  return (
    <div>
      <a href={href} target={target} className={classnames(sharedClasses, childClasses)}>
        <span className='w-4'>{icon}</span>
        <span className='pl-3 capitalize'>{langKey ? t(langKey, label) : label}</span>
      </a>
    </div>
  )
}

SocialLinkChild.defaultProps = {
  target: '_blank'
}
