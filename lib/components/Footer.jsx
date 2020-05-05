import React from 'react'

import MailFooterIcon from 'assets/images/mail-footer.svg'
import MediumFooterLogo from 'assets/images/medium-footer.svg'
import GithubFooterLogo from 'assets/images/github-footer.svg'
import DiscordLogo from 'assets/images/discord-footer.svg'
import TwitterFooterLogo from 'assets/images/twitter-footer.svg'

export const Footer = () => {
  let mailHref = 'mailto:hello@pooltogether.com'
  let twitterHref = 'https://twitter.com/PoolTogether_'
  
  return <footer
    className='footer w-full text-purple-700 text-sm'
  >
    <div className='nav-and-footer-container'>
      <div
        className='flex flex-col sm:flex-row justify-between mt-3 sm:mt-4 lg:mt-6 pb-5 lg:pb-8'
      >
        <div className=''>
          <span className='mb-2 sm:mb-0 invisible sm:visible block sm:inline'>
            &copy; {new Date().getFullYear()} <a href='https://www.pooltogether.com'>
              PoolTogether Inc.
            </a>
          </span>

          <a
            title='faq'
            className='trans mr-4 sm:ml-8'
            href='https://www.pooltogether.com/faq'
          >
            faq
          </a>
          {/* <a
          title='readTheFAQ'
          className='trans mr-4'
          href='https://www.pooltogether.com/faq'
        >
          faq
        </a>

        <a
          title='seeStats'
          className='trans mr-4'
          href='https://www.pooltogether.com/#stats'
        >
          stats
        </a> */}
          <a
            title='readTerms'
            className='trans mr-4'
            href='https://www.pooltogether.com/terms'
          >
            terms
          </a>
          <a
            title='auditAndSecurityInfo'
            className='trans mr-4'
            href='https://www.pooltogether.com/audits'
          >
            audits
          </a>
          <a
            title='getAnswers'
            className='trans mr-4'
            href='https://help.pooltogether.com'
          >
            help
          </a>

          <span className='block mb-2 sm:mb-0 text-purple-900'>
            Pool icon by <a
              href='https://www.flaticon.com/authors/freepik'
              title='Freepik'
              target='_blank'
              className='text-purple-900 hover:text-purple-800'
            >
              Freepik
            </a>
          </span>

          
        </div>

        <div className='mt-3 sm:mt-0 mb-2 sm:mb-0'>
          <nav
            className='flex sm:justify-between w-full'
          >
            <a
              className='inline-block trans mr-3 lg:mr-0 lg:ml-4 w-5 h-5 '
              href={twitterHref}
              target='_blank'
              rel='noreferrer noopener'
            >
              <img
                alt='twitter logo'
                src={TwitterFooterLogo}
                className='pt-1'
              />
            </a>

            <a
              className='inline-block trans mr-3 lg:mr-0 lg:ml-4 w-5 h-5 '
              href='https://discord.gg/hxPhPDW'
              target='_blank'
              rel='noreferrer noopener'
            >
              <img
                alt='discord logo'
                src={DiscordLogo}
                className='pt-1'
              />
            </a>

            <a
              className='inline-block trans mr-3 lg:mr-0 lg:ml-4 w-5 h-5 '
              href='https://github.com/pooltogether'
              target='_blank'
              rel='noreferrer noopener'
            >
              <img
                alt='github logo'
                src={GithubFooterLogo}
                className='pt-1'
              />
            </a>

            <a
              className='inline-block trans mr-3 lg:mr-0 lg:ml-4 w-5 h-5 '
              href='https://medium.com/pooltogether'
              target='_blank'
              rel='noreferrer noopener'
            >
              <img
                alt='medium logo'
                src={MediumFooterLogo}
                className='pt-1'
              />
            </a>

            <a
              className='inline-block trans lg:ml-4 w-5 h-5 '
              href={mailHref}
              target='_blank'
              rel='noreferrer noopener'
            >
              <img
                alt='email icon'
                src={MailFooterIcon}
                className='h-3 relative'
                style={{
                  top: 6
                }}
              />
            </a>
          </nav>
        </div>
      </div>
    </div>
  </footer>
}
