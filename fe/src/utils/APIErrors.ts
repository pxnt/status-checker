import { useToast } from '~/composables/useToast';

export function handleResponseError(err: any) {
  if (err?.response?.status === 403) {
    const { toast } = useToast();
    toast.error(
      'Access Denied',
      'You do not have permission to update this component group.'
    );
  }
}