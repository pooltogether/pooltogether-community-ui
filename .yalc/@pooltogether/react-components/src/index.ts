// TODO:
// Loader
// Panel
// Table
// Tabs

// ------- Component Groups -------

// Buttons
export { AddTokenToMetamaskButton } from './components/Buttons/AddTokenToMetamaskButton'

export {
  SquareButtonTheme,
  SquareButtonSize,
  SquareButton,
  SquareLink,
  SquareButtonProps
} from './components/Buttons/SquareButton'
export { Button } from './components/Buttons/Button'

// Containers
export { Amount } from './components/Containers/Amount'
export { Banner, BannerTheme } from './components/Containers/Banner'
export { BasicTable } from './components/Containers/BasicTable'
export { Card, CardTheme, CardProps } from './components/Containers/Card'
export { Chip } from './components/Containers/Chip'
export { Collapse } from './components/Containers/Collapse'
export { CountBadge } from './components/Containers/CountBadge'
export { Tabs, Tab, Content, ContentPane } from './components/Containers/Tabs'
export { TicketRow } from './components/Containers/TicketRow'
export { TipBanner } from './components/Containers/TipBanner'
export { overrideToolTipPosition, Tooltip } from './components/Containers/Tooltip'

// Icons
export { CopyIcon } from './components/Icons/CopyIcon'
export { LinkIcon } from './components/Icons/LinkIcon'
export { TokenIcon } from './components/Icons/TokenIcon'
export { PoolIcon } from './components/Icons/PoolIcon'
export { NetworkIcon } from './components/Icons/NetworkIcon'

// Input
export { CheckboxInputGroup } from './components/Input/CheckboxInputGroup'
export { DropdownInputGroup } from './components/Input/DropdownInputGroup'
export { DropdownList } from './components/Input/DropdownList'
export { InputLabel } from './components/Input/InputLabel'
export { TextInputGroup } from './components/Input/TextInputGroup'
export { SimpleInput, RoundInput, RectangularInput } from './components/Input/TextInputs'
export { Switch } from './components/Input/Switch'

// Layout
export { DefaultLayout, SimpleLayout } from './components/Layout/PageLayout'
export { NotificationBannerContainer } from './components/Layout/NotificationBannerContainer'
export {
  notificationBannerVisibleAtom,
  NotificationBannerList
} from './components/Layout/NotificationBannerList'
export { Tagline } from './components/Layout/Tagline'

// Links
export { ButtonLink } from './components/Links/ButtonLink'
export {
  BlockExplorerLink,
  formatBlockExplorerTxUrl,
  formatBlockExplorerAddressUrl
} from './components/Links/BlockExplorerLink'
export { ExternalLink, LinkTheme } from './components/Links/ExternalLink'
export { InternalLink } from './components/Links/InternalLink'

// Loading
export { LoadingLogo } from './components/Loading/LoadingLogo'
export { LoadingScreen } from './components/Loading/LoadingScreen'
export { ThemedClipSpinner } from './components/Loading/ThemedClipSpinner'
export { LoadingDots } from './components/Loading/LoadingDots'

// Modal
export { Modal, ModalProps } from './components/Modal/Modal'

// Navigation
export { BottomNavContainer } from './components/Navigation/BottomNavContainer'
export {
  BottomNavLink,
  BottomVoteIcon,
  BottomAccountIcon,
  BottomPodsIcon,
  BottomRewardsIcon,
  BottomPoolsIcon
} from './components/Navigation/BottomNavLink'
export { SideNavContainer } from './components/Navigation/SideNavContainer'
export {
  SideNavLink,
  SideVoteIcon,
  SideAccountIcon,
  SideRewardsIcon,
  SidePodsIcon,
  SidePoolsIcon
} from './components/Navigation/SideNavLink'
export { SocialLinks } from './components/Navigation/SocialLinks'
export { NavPoolBalance } from './components/Navigation/NavPoolBalance'

// PageHeader
export { SettingsContainer } from './components/PageHeader/Settings/SettingsContainer'
export { ThemeSettingsItem } from './components/PageHeader/Settings/ThemeSettingsItem'
export { TestnetSettingsItem } from './components/PageHeader/Settings/TestnetSettingsItem'
export { SettingsItem } from './components/PageHeader/Settings/SettingsItem'
export { HeaderLogo } from './components/PageHeader/HeaderLogo'
export { LanguagePickerDropdown } from './components/PageHeader/LanguagePickerDropdown'
export { NetworkSelector } from './components/PageHeader/NetworkSelector'
export { PageHeaderContainer } from './components/PageHeader/PageHeaderContainer'
export { Account } from './components/PageHeader/Account/index'

// Prizes
export { WeeklyPrizeAmountCard } from './components/Prizes/WeeklyPrizeAmountCard'
export { PrizeCountdown } from './components/Prizes/PrizeCountdown'
export { SimpleCountDown } from './components/Prizes/SimpleCountdown'
export { Time } from './components/Prizes/Time'

// TransactionStatusChecker
export { TransactionStatusChecker } from './components/TransactionStatusChecker'

// Components
export { Accordion, ContentWrapper } from './components/Accordion'
export { ErrorsBox } from './components/ErrorsBox'
export { PageTitleAndBreadcrumbs } from './components/PageTitleAndBreadcrumbs'
export { PoolCurrencyIcon } from './components/PoolCurrencyIcon'
export { PrizeFrequencyChip } from './components/PrizeFrequencyChip'
export { ThemeContext, ThemeContextProvider, ColorTheme } from './components/ThemeContextProvider'
export { TxRefetchListener } from './components/TxRefetchListener'
export { TxStatus } from './components/TxStatus'

// Toasts 🍞
export { ToastContainer } from 'react-toastify'
export { poolToast } from './services/poolToast'

// MetaMask Functionality
export { addTokenToMetamask } from './services/addTokenToMetamask'

// Utils
export { getLegacyButtonClassNames } from './utils/getLegacyButtonClassNames'

// Styles
import './styles/tailwind.css'

import './styles/utils.css'
import './styles/toast-blur.css'
import './styles/layout.css'
import './styles/loader.css'
import './styles/themes.css'

import './styles/typography.css'
import './styles/tables.css'
import './styles/pool.css'
import './styles/pool-toast.css'
import './styles/animations.css'
import './styles/transitions.css'

import './styles/interactable-cards.css'
import './styles/forms.css'
import './styles/tabs.css'
import './styles/tickets.css'

import './styles/bnc-onboard--custom.css'
import './styles/reach--custom.css'
import './styles/vx--custom.css'

import './styles/SquareButton.css'
