import { useUser, useClerk } from '@clerk/vue';


export function useAuthentication() {
  
  function handleLoginRedirection(redirect: string) {
    const { isSignedIn } = useUser();

    if (!isSignedIn.value) {
      const clerk = useClerk();
      clerk.value?.openSignIn({
        redirectUrl: redirect,
      });
    }
  }

  return {
    handleLoginRedirection
  }
}