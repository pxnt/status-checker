import { computed } from 'vue'
import { CheckCircle, AlertTriangle, XCircle, Clock, AlertCircle } from 'lucide-vue-next'
import { ServiceStatus, ServiceStatusName } from '~/types/Status'

interface StatusConfig {
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  icon: any
  className: string
}

const statusConfig: Record<ServiceStatus, StatusConfig> = {
  operational: {
    label: ServiceStatusName.Operational,
    variant: 'default',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100'
  },
  performance: {
    label: ServiceStatusName.Performance,
    variant: 'secondary',
    icon: AlertCircle,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100'
  },
  partial: {
    label: ServiceStatusName.Partial,
    variant: 'secondary',
    icon: AlertTriangle,
    className: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100'
  },
  major: {
    label: ServiceStatusName.Major,
    variant: 'destructive',
    icon: XCircle,
    className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100'
  },
  unknown: {
    label: ServiceStatusName.Unknown,
    variant: 'outline',
    icon: Clock,
    className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100'
  }
}

export function useStatusStyling(status: ServiceStatus) {
  const statusName = computed(() => statusConfig[status]?.label || ServiceStatusName.Operational)
  
  const statusIcon = computed(() => statusConfig[status]?.icon || CheckCircle)
  
  const statusVariant = computed(() => statusConfig[status]?.variant || 'default')
  
  const statusClasses = computed(() => statusConfig[status]?.className || statusConfig.operational.className)

  return {
    statusName,
    statusIcon,
    statusVariant,
    statusClasses,
    statusConfig: statusConfig[status] || statusConfig.operational
  }
}

export function useReactiveStatusStyling(statusRef: import('vue').Ref<ServiceStatus>) {
  const statusName = computed(() => statusConfig[statusRef.value]?.label || ServiceStatusName.Operational)
  
  const statusIcon = computed(() => statusConfig[statusRef.value]?.icon || CheckCircle)
  
  const statusVariant = computed(() => statusConfig[statusRef.value]?.variant || 'default')
  
  const statusClasses = computed(() => statusConfig[statusRef.value]?.className || statusConfig.operational.className)

  return {
    statusName,
    statusIcon,
    statusVariant,
    statusClasses,
    statusConfig: computed(() => statusConfig[statusRef.value] || statusConfig.operational)
  }
} 