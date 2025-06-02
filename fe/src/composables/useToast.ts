import { ref, reactive } from 'vue'

export interface Toast {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const toasts = ref<Toast[]>([])

export function useToast() {
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast
    }
    
    toasts.value.push(newToast)
    
    // Auto remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
    
    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const toast = {
    success: (title: string, description?: string) => addToast({ title, description, type: 'success' }),
    error: (title: string, description?: string) => addToast({ title, description, type: 'error' }),
    warning: (title: string, description?: string) => addToast({ title, description, type: 'warning' }),
    info: (title: string, description?: string) => addToast({ title, description, type: 'info' }),
  }

  return {
    toasts: toasts.value,
    addToast,
    removeToast,
    toast
  }
} 