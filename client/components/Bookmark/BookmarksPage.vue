<template>
  <main>
    <section>
      <header>
        <div class="left">
          <h2>
            Your Bookmarks
            <span v-if="$store.state.bookmarkFilter">
            with {{ $store.state.bookmarkFilter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetBookmarksForm @currentProfile="updateCurrentProfile"
            ref="getBookmarksForm"
            value="keyword"
            placeholder="🔍 Filter by keyword (optional)"
            button="🔄 Get bookmarks"
          />
        </div>
      </header>
      <div class="profileButtons">
          <!-- Select profile to filter bookmarks by -->
          <!-- <button v-for="profileName in $store.state.profiles" v-bind:key="profileName" @click="filterBookmarksBy(profileName)" @currentProfile="setCurrentProfile($event)"> {{ profileName }} </button> -->

          <button v-for="profileName in $store.state.profiles" v-bind:key="profileName" @click="filterBookmarksBy(profileName)" :class="{ active: profileName === currentProfile }"> {{ profileName }} </button>
      </div>
      </section>
      <section
        v-if="$store.state.bookmarks.length"
      >
        <FreetComponent
          v-for="bookmark in $store.state.bookmarks"
          :key="bookmark.id"
          :freet="bookmark"
        />
      </section>
      <article
        v-else
      >
        <h3>No bookmarks found.</h3>
      </article>
    </section>
  </main>
</template>


<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import GetBookmarksForm from '@/components/Bookmark/GetBookmarksForm.vue';

export default {
  name: 'BookmarksPage',
  components: {
    GetBookmarksForm,
    FreetComponent
  },
  data() {
    return {
      currentProfile: null,
    };
  },
  mounted() {
    this.$refs.getBookmarksForm.submit(this.currentProfile);
    console.log("on bookmarks page");
    console.log(this.$store.state.bookmarks);
  },
  methods: {
    updateCurrentProfile(prof) {
      console.log("im updating");
      this.currentProfile = prof;
    },
    filterBookmarksBy(profileName) {
      console.log("currentProfile on bookmarksPage" + this.currentProfile);
      this.currentProfile = profileName;
      this.$refs.getBookmarksForm.submit(profileName);
    }
  }
};
</script>


<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.profileButtons {
  display: flex;
  justify-content: space-evenly;
  height: 1.8em;
  margin: 0.2em;
}

.profileButtons .active {
  background-color: blanchedalmond;  
}

button {
  margin-right: 10px;
  background-color: floralwhite;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>