import { toast, cssTransition } from 'react-toastify'

const Blur = cssTransition({
  enter: `blur-enter`,
  exit: `blur-exit`,
  duration: [450, 400],
  appendPosition: true
})

const DEFAULT_OPTIONS = {
  transition: Blur
}

export const poolToast = {
  dismiss: () => {
    toast.dismiss()
  },
  rainbow: (message, options = DEFAULT_OPTIONS) => {
    toast.dismiss()
    toast(message, options)

    if (window) {
      setTimeout(toast.dismiss, 7000)
    }
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
  }
}
