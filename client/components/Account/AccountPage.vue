<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <!-- general settings section -->
    <section>
      <header>
        <h2>Welcome to the settings for @{{ $store.state.username }} </h2>
        <FollowerModal />
        <FolloweeModal />
        <AllUsersModal />
      </header>
    </section>

    <!-- profile settings section -->
    <section>
      <header>
        <h2> Profile settings </h2>
      </header>
      <AllProfilesModal />
      <CreateProfileForm />
      <DeleteProfileForm />
    </section>

    <!-- account settings section -->
    <section>
      <header>
        <h2>Account settings for @{{ $store.state.username }}</h2>
      </header>
      <ChangeUsernameForm />
      <ChangePasswordForm />
    
      <header>
        <h2>Account management</h2>
      </header>
      <LogoutForm />
      <DeleteAccountForm />
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';
import FollowerModal from '@/components/Follow/FollowerModal.vue';
import FolloweeModal from '@/components/Follow/FolloweeModal.vue';
import AllUsersModal from '@/components/Follow/AllUsersModal.vue';
import CreateProfileForm from '@/components/Profile/CreateProfileForm.vue';
import DeleteProfileForm from '@/components/Profile/DeleteProfileForm.vue';
import AllProfilesModal from '@/components/Profile/AllProfilesModal.vue';

export default {
  name: 'AccountPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
    FollowerModal,
    FolloweeModal,
    AllUsersModal,
    CreateProfileForm,
    DeleteProfileForm,
    AllProfilesModal
  }
};
</script>
