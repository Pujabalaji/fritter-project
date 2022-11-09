<template>
    <div>
      <button class="btn btn--primary mx-auto" @click="$refs.allProfilesModal.openModal()">View All Profiles</button>

      <Modal ref="allProfilesModal">
        <template v-slot:header>
          <h1>Your Profiles</h1>
        </template>
  
        <template v-slot:body>
            <div v-for="profileName in $store.state.profiles" v-bind:key="profileName">
                {{ profileName }}
            </div>
        </template>
  
        <template v-slot:footer>
          <div class="d-flex align-items-center justify-content-between">
            <button class="btn btn--secondary" @click="$refs.allProfilesModal.closeModal()">Close</button>
          </div>
        </template>
      </Modal>
    </div>
</template>

<script lang="ts">
import Modal from "@/components/common/Modal.vue"

export default {
    name: "AllProfilesModal",
    components: {
        Modal
    },
    mounted() {
        this.getAllProfiles();
    },
    methods: {
        async getAllProfiles() {
            /** 
             * Gets list of profiles that belong to this user.
             * GET /api/profile?username=username
            */
            const params = {
                method: 'GET'
            }
            const response = await this.request(params);
            const profiles = response.map(profile => profile.profileName);
            this.$store.commit('setProfiles', profiles);
        },
        async request(params) {
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
                const r = await fetch(`/api/profile?username=${this.$store.state.username}`, options);
                if (!r.ok) {
                const res = await r.json();
                throw new Error(res.error);
                return res;
                }

                const response = await r.json();
                return response;
            } catch (e) {
                this.$set(this.alerts, e, 'error');
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        }
    }
}
</script>

<style scoped>
button {
    background-color: floralwhite;
    margin: 1em;
    outline-color: blue;
}
</style>