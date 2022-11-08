<template>
    <div>
      <button class="btn btn--primary mx-auto" @click="$refs.selectProfileModal.openModal()">View All Profiles</button>

      <Modal ref="selectProfileModal">
        <template v-slot:header>
          <h1>Your Profiles</h1>
        </template>
  
        <template v-slot:body>
            <div v-for="profile in allProfiles" v-bind:key="profile.profileName">
                <div v-if="checkFreetBookmarkedInProfile(profile.profileName)">
                    {{ profile.profileName }}  <button @click="deleteBookmark(profile.profileName)"> Unsave </button>
                </div>
                <div v-else>
                    {{ profile.profileName }}  <button @click="addToBookmark(profile.profileName)"> Save </button>
                </div>
            </div>
        </template>
  
        <template v-slot:footer>
          <div class="d-flex align-items-center justify-content-between">
            <button class="btn btn--secondary" @click="$refs.selectProfileModal.closeModal()">Close</button>
          </div>
        </template>
      </Modal>

      <section class="alerts">
            <article
                v-for="(status, alert, index) in alerts"
                :key="index"
                :class="status"
            >
                <p>{{ alert }}</p>
            </article>
        </section>
    </div>
</template>

<script lang="ts">
import Modal from "@/components/common/Modal.vue"

export default {
    name: "SelectProfileModal",
    components: {
        Modal
    },
    props: {
        freet: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            allProfiles: this.getAllProfiles(),
            alerts: {} // Displays success/error messages encountered during bookmarking
        }
    }, 
    methods: {
        checkFreetBookmarkedInProfile(profileName) {
            console.log("store bookmarks" + typeof this.$store.state.bookmarks);
            console.log(this.$store.state.bookmarks);
            for (const bookmark of this.$store.state.bookmarks) {
                console.log("checking " + bookmark.profileName + " " + bookmark.author + " " + bookmark.freetId._id);
                console.log('against ' + profileName + " " + this.$store.state.username + " " + this.freet._id);
                if (bookmark.profileName === profileName && bookmark.author === this.$store.state.username && bookmark.freetId._id === this.freet.freetId._id ) {
                    console.log("this bookmark has already been added");
                    return true
                }
            }
            return false;
        },
        findBookmarkWithFreetIdAndProfileName(profileName) {
            /**
             * returns bookmark id of bookmark with matching freet id and profile name
             */
            for (const bookmark of this.$store.state.bookmarks) {
                if (bookmark.profileName === profileName && bookmark.author === this.$store.state.username && bookmark.freetId._id === this.freet._id ) {
                    return bookmark._id;
                }
            }
        },
        async deleteBookmark(profileName) {
            /**
             * Deletes bookmark.
             */
            console.log("deleting bookmark!");
            const params = {
                method: "DELETE",
                callback: () => {
                    const message = 'Successfully deleted freet from bookmarks in ' + profileName;
                    this.$set(this.alerts, message, 'success');
                    setTimeout(() => this.$delete(this.alerts, message), 3000);
                },
            };
            const bookmarkId = this.findBookmarkWithFreetIdAndProfileName(profileName)
            this.request(params, false, true, bookmarkId);
        },
        async addToBookmark(profileName) {
            const params = {
                method: 'POST',
                body: JSON.stringify({profileName: profileName, freetId: this.freet._id}),
                callback: () => {
                    const message = 'Successfully added freet to bookmarks in ' + profileName;
                    this.$set(this.alerts, message, 'success');
                    setTimeout(() => this.$delete(this.alerts, message), 3000);
                }
            };
            this.request(params, true, false);

        },
        async getAllProfiles() {
            /** 
             * Gets list of profiles that belong to this user.
             * GET /api/profile?username=username
            */
            this.$store.commit('refreshBookmarks', true);
            const params = {
                method: 'GET'
            }
            const response = await this.request(params, false, false);
            this.allProfiles = response;
        },
        async request(params, addingBookmark, deleteBookmark, bookmarkId = null) {
            /**
             * Submits a request to the freet's endpoint
             * @param params - Options for the request
             * @param params.body - Body for the request, if it exists
             * @param params.callback - Function to run if the the request succeeds
             */
            const options = {
                method: params.method, headers: {'Content-Type': 'application/json', 'Cache-Control': 'no-cache'}
            };
            if (params.body) {
                options.body = params.body;
            }

            try {
                let r;
                if (deleteBookmark) {
                    r = await fetch(`/api/bookmark/${bookmarkId}`, options);
                } else if (!addingBookmark) {
                    r = await fetch(`/api/profile?username=${this.$store.state.username}`, options);
                } else {
                    r = await fetch(`/api/bookmark`, options);
                }
                if (!r.ok) {
                    const res = await r.json();
                    throw new Error(res.error);
                    return res;
                }                
                const response = await r.json();
                console.log("response in select profile modal request");
                console.log(response);
                if (params.callback) {
                    params.callback();
                }
                this.$store.commit('refreshBookmarks', true);
                return response;
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
}
</script>

