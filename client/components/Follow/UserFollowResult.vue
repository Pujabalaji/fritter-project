<template>
    <div>
        {{ username }}
        <button v-if = "$store.state.username !== username && (followees.filter(followeeUsername => followeeUsername === username).length == 0) " class="btn btn--primary mx-auto" @click="followRequest">Add Follow</button>
    </div>
  </template>

<script lang="ts">

export default {
    name: "UserFollowResult",
    data() {
        return {
            followees: this.getAllFollowees(),
        }
    },
    props: {
        username: String,
    },
    methods: {
        async followRequest() {
            /** 
             * Gets list of users who follow this user.
             * POST /api/follow?username=username
            */
            const params = {
                method: 'POST'
            }
            const response = await this.requestAddFollow(params);
            console.log("response in userfollowresult");
        },
        async requestAddFollow(params) {
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
                const r = await fetch(`/api/follow?username=${this.username}`, options);
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
        },
        async getAllFollowees() {
            /** 
             * Gets list of users who follow this user.
             * GET /api/follow/followees/:username?
            */
            const params = {
                method: 'GET'
            }
            const response = await this.requestAllFollowees(params);
            this.followees = response.map(x => x.username);
            // console.log("isArray"+Array.isArray(this.followees));
        },
        async requestAllFollowees(params) {
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
                const r = await fetch(`/api/follow/followees/${this.$store.state.username}`, options);
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