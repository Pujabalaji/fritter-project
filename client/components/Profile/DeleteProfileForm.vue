<!-- Form for deleting profile (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'DeleteProfileForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/profile',
      method: 'DELETE',
      hasBody: true,
      title: 'Delete profile',
      fields: [
        {id: 'profileName', label: 'Profile Name', value: ''},
      ],
      content: 'Deleting a profile is permanent and irreversible. You will lose the bookmarks within the profile. Proceed only if you understand these consequences.',
      callback: () => {
            this.$store.commit('alert', {
          message: 'Your profile has been deleted!', status: 'success'
        });
      }
    };
  }
};
</script>
