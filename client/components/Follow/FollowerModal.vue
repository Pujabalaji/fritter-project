<template>
    <div>
      <button class="btn btn--primary mx-auto" @click="$refs.followerModal.openModal()">Followers</button>

      <Modal ref="followerModal">
        <template v-slot:header>
          <h1>View Followers</h1>
        </template>
  
        <template v-slot:body>
            <div v-for="follower in followers">
                {{ follower.username }}
            </div>
        </template>
  
        <template v-slot:footer>
          <div class="d-flex align-items-center justify-content-between">
            <button class="btn btn--secondary" @click="$refs.followerModal.closeModal()">Close</button>
          </div>
        </template>
      </Modal>
    </div>
</template>

<script>
import Modal from "@/components/common/Modal.vue"

export default {
    name: "FollowerModal",
    components: {
        Modal
    },
    data() {
        return {
            followers: this.getAllFollowers(),
        }
    }, 
    methods: {
        async getAllFollowers() {
            /** 
             * Gets list of users who follow this user.
             * GET /api/follow/followers/:username?
            */
            const params = {
                method: 'GET'
            }
            const response = await this.request(params);

            this.followers = response;
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
                const r = await fetch(`/api/follow/followers/${this.$store.state.username}`, options);
                if (!r.ok) {
                const res = await r.json();
                throw new Error(res.error);
                return res;
                }

                const response = await r.json();
                console.log(response);
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
}
</style>