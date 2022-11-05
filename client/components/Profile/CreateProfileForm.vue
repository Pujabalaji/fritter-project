<!-- Form for to create a profile (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateProfileForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/profile',
      method: 'POST',
      hasBody: true,
      setProfileName: true,
      fields: [
        {id: 'profileName', label: 'Profile Name', value: ''},
      ],
      title: 'Create profile',
      callback: () => {
        const message = 'Successfully created a profile!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
