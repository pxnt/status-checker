import { NavigationGuard, useRouter } from 'vue-router';
import { useClerk, useUser } from '@clerk/vue';
import { watch } from 'vue';
import { useAuthentication } from '~/composables/useAuthentication';

export const authGuard: NavigationGuard = (to, from, next) => {
  const { isSignedIn, isLoaded } = useUser();
  const $router = useRouter();

  // Wait for Clerk to finish loading before making authentication decisions
  if (!isLoaded.value) {
    // If Clerk is still loading, wait for it to complete
    const unwatch = watch(isLoaded, (loaded: boolean) => {
      if (loaded) {
        unwatch(); // Stop watching
        // Now that Clerk has loaded, check authentication
        if (!isSignedIn.value) {
          // Check for current route
          if (from.name === 'home') {
            useAuthentication().handleLoginRedirection(to.fullPath);
            $router.replace(from.path)
            return;
          } else {
            next({ name: 'login', query: { login_redirect: to.fullPath } });
          }
        } else {
          next();
        }
      }
    });
    return; // Don't call next() yet, wait for the watcher
  }

  // Clerk has already loaded, proceed with normal auth check
  if (!isSignedIn.value) {
    // Check for current route
    if (from.name === 'home') {
      useAuthentication().handleLoginRedirection(to.fullPath);
      $router.replace(from.path)
      return;
    } else {
      next({ name: 'login', query: { login_redirect: to.fullPath } });
    }
  } else {
    next();
  }
}