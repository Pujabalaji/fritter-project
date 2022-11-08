import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    profiles: [],
    bookmarkFilter: null, // [profileName, keyword] to query bookmarks by ([] = show all bookmarks) 
    bookmarks: [],
    freets: [], // All freets created in the app
    followees: [],
    username: null, // Username of the logged in user
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setProfiles(state, profiles) {
      state.profiles = profiles;
    },
    addToProfiles(state, profile) {
      state.profiles.push(profile);
    },
    setFollowees(state, followees) {
      state.followees = followees;
    },
    addToFollowees(state, followee) {
      /**
       * Add a new followee to list of followees.
       */
      state.followees.push(followee);
    },
    deleteFromFollowees(state, followee) {
      const index = state.followees.indexOf(followee);
      if (index > -1) {
        state.followees.splice(index, 1);
     }
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to filter freets by
       */
      state.filter = filter;
    },
    updateBookmarkFilter(state, filter) {
      /**
       * Update the stored bookmark filter to the specified one.
       * @param filter - Profile name and keyword to filter freets by
       */
      state.bookmarkFilter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    updateBookmarks(state, bookmarks) {
      state.bookmarks = bookmarks;
    },
    async refreshFollowees(state) {
      const url = `/api/follow/followees/${state.username}`;
      const res = await fetch(url).then(async r => r.json());
      const followees = res.map(followee => followee.username);
      state.followees = followees;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/freets?author=${state.filter}` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    async refreshProfiles(state) {
      if (state.username) {
        const url = `/api/profile?username=${state.username}`;
        const res = await fetch(url).then(async r => r.json());
        const profiles = res.map(profile => profile.profileName);
        state.profiles = profiles;
      }
    },
    async refreshBookmarks(state) {
      const url = state.bookmarkFilter ? `/api/users/bookmark` : '/api/bookmark';
      const res = await fetch(url).then(async r => r.json());
      state.bookmarks = res;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
