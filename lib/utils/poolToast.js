import { toast, cssTransition } from 'react-toastify'

const CustomTransitions = cssTransition({
  enter: 'slideInUp',
  exit: 'slideIn',
  duration: [300, 100],
})

const DEFAULT_OPTIONS = {
  transition: CustomTransitions,
}

export const poolToast = {
  dismiss: () => {
    toast.dismiss()
  },
  success: (message, options = DEFAULT_OPTIONS) => {
    toast.dismiss()
    toast.success(message, options)
  },
  error: (message, options = DEFAULT_OPTIONS) => {
    toast.dismiss()
    toast.error(message, options)
  },
  info: (message, options = DEFAULT_OPTIONS) => {
    toast.dismiss()
    toast.info(message, options)
  },
  warn: (message, options = DEFAULT_OPTIONS) => {
    toast.dismiss()
    toast.warn(message, options)
  },
}
