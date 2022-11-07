<template>
    <div>
      <button class="btn btn--primary mx-auto" @click="$refs.selectProfileModal.openModal()">View All Profiles</button>

      <Modal ref="selectProfileModal">
        <template v-slot:header>
          <h1>Your Profiles</h1>
        </template>
  
        <template v-slot:body>
            <div v-for="profile in allProfiles" v-bind:key="profile.profileName">
                <button @click="addToBookmark(profile.profileName)"> {{ profile.profileName }} </button>
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
        async addToBookmark(profileName) {
            console.log("freet in SelectProfileModal");
            console.log(this.freet);
            const params = {
                method: 'POST',
                body: JSON.stringify({profileName: profileName, freetId: this.freet._id}),
                callback: () => {
                    console.log("profileName" + profileName);
                    const message = 'Successfully added freet to bookmarks in ' + profileName;
                    this.$set(this.alerts, message, 'success');
                    this.$store.commit('refreshBookmarks', true);
                    setTimeout(() => this.$delete(this.alerts, message), 3000);
                }
            };
            this.request(params, true);

        },
        async getAllProfiles() {
            /** 
             * Gets list of profiles that belong to this user.
             * GET /api/profile?username=username
            */
            const params = {
                method: 'GET'
            }
            const response = await this.request(params, false);
            this.allProfiles = response;
        },
        async request(params, addingBookmark) {
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
                console.log(options.body);
            }

            try {
                let r;
                if (!addingBookmark) {
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
                return response;
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
}
</script>

