<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'GetBookmarksForm',
  mixins: [InlineForm],
  data() {
    return {
        value: typeof this.$store.state.bookmarkFilter === String ? this.$store.state.bookmarkFilter : null,
        profileName: null
    };
  },
  methods: {
    async submit(profileName) {
      if (typeof profileName !== "string") { profileName = null; }
      let url;
      if (profileName !== null && this.profileName !== null && this.profileName === profileName) {
        this.profileName = null; // clicking same profile
      } else if (profileName !== null && this.profileName !== null && this.profileName !== profileName) {
        this.profileName = profileName; // overwrite selected profile
      } else if (profileName !== null && this.profileName === null) {
        this.profileName = profileName; // no profile selected before
      } else if (profileName == null && this.profileName !== null) {
        this.profileName = null; // no profile name selected 
      }

      console.log("currentProfile is" + this.profileName);
      this.$emit('currentProfile', this.profileName);
      if (this.profileName !== null && this.value) {
        url = `/api/bookmark/${this.profileName}?keyword=${this.value}`;
      } else if (this.profileName !== null) {
        url = `/api/bookmark/${this.profileName}`
      } else if (this.value) {
        url = `/api/bookmark?keyword=${this.value}`
      } else {
        url = `/api/bookmark`;
      }
      console.log(url);

      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('updateBookmarkFilter', this.value);
        this.$store.commit('updateBookmarks', res);
      } catch (e) {
        if (this.value === this.$store.state.filter) {
          // This section triggers if you filter to a user but they
          // change their username when you refresh
          this.$store.commit('updateBookmarkFilter', null);
          this.value = ''; // Clear filter to show all profiles' bookmarks
          this.$store.commit('refreshBookmarks');
        } else {
          // Otherwise reset to previous fitler
          this.value = this.$store.state.filter;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
}
</script>
