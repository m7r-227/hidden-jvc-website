<template>
    <div v-if="user !== null">
        <v-row justify="center" no-gutters class="mb-4">
            <v-col cols="12" xl="9">
                <v-card>
                    <v-sheet color="#37383a" class="pa-4">
                        <v-row>
                            <v-col cols="2">
                                <v-avatar :size="180" style="position: absolute">
                                    <v-img v-if="user.ProfilePicture !== null" :src="user.ProfilePicture" />
                                    <v-img v-else src="@/assets/larry.png" />
                                </v-avatar>
                            </v-col>

                            <v-col>
                                <h1 class="mb-4">
                                    {{ user.Name }}
                                </h1>

                                <v-tooltip top v-for="badge of user.Badges" :key="badge.Id">
                                    <template v-slot:activator="{ on }">
                                        <v-chip label small class="mr-2" v-on="on"> {{ badge.Name }} </v-chip>
                                    </template>
                                    {{ badge.Description }}
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </v-sheet>

                    <v-row class="mt-4 pa-4">
                        <v-col class="py-0" offset="2">
                            <small> Membres depuis </small> <br>
                            <span class="white--text">
                                {{ user.CreationDate | toDateStr() }}
                                ({{ user.CreationDate | daysSinceDate() }} jours)
                            </span>
                        </v-col>

                        <v-col class="py-0">
                            <small> Messages </small> <br>
                            <span class="white--text"> {{ user.PostCount }} </span>
                        </v-col>

                        <v-col class="py-0">
                            <small> Dernière connexion </small> <br>
                            <span class="white--text"> 12/01/2021 </span>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-row justify="center" no-gutters>
            <v-col cols="12" xl="9">
                <v-card class="mb-4">
                    <v-tabs v-model="tabs" fixed-tabs>
                        <v-tab>
                            Topics
                        </v-tab>
                        <v-tab>
                            Messages
                        </v-tab>
                        <v-tab>
                            DDB
                        </v-tab>
                    </v-tabs>
                </v-card>

                <v-tabs-items v-model="tabs" style="background-color: transparent;">
                    <v-tab-item>
                        <v-row justify="center" no-gutters>
                            <v-col cols="8">
                                <v-card>
                                    <TopicList :topics="topics" :displayModerationTools="false" />
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-tab-item>

                    <v-tab-item>
                        <v-row justify="center" no-gutters>
                            <v-col cols="8">
                                <v-card class="transparent">
                                    <Post class="mb-4" v-for="post of posts" :key="post.Id" :post="post" />
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-tab-item>

                    <v-tab-item>
                        ddb
                    </v-tab-item>
                </v-tabs-items>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { parse } from 'hidden-jvc-jvcode';
import Post from '../components/hidden/topic/Post.vue';
import TopicList from '../components/hidden/forum/TopicList.vue';

export default {
    name: 'User',

    components: {
        Post,
        TopicList
    },

    data: () => ({
        user: null,
        topics: [],
        posts: [],
        tabs: null
    }),

    computed: {
        preview() {
            return parse(this.signature || '');
        }
    },

    methods: {
        async fetchUser() {
            try {
                this.setLoading(true);

                const { user, topics, posts, error } = await this.repos.application.getUser(this.$route.params.userName);
                if (error) {
                    this.openErrorDialog(error);
                } else {
                    this.user = user;
                    this.posts = posts;
                    this.topics = topics;
                }
            } catch (err) {
                console.error(err);
            } finally {
                this.setLoading(false);
            }
        }
    },

    created() {
        this.fetchUser();
    }
};
</script>
