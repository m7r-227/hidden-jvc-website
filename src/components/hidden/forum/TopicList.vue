<template>
    <div>
        <v-simple-table id="forum-table" v-if="!$vuetify.breakpoint.mobile" dense>
            <template v-slot:default>
                <thead>
                    <tr>
                        <th style="width:1%"> </th>
                        <th style="width: 65%"> SUJET </th>
                        <th> AUTEUR </th>
                        <th> NB </th>
                        <th> DERNIER MSG </th>
                        <th v-if="displayModerationTools">
                            <!-- <v-checkbox dense /> -->
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="topic of topics" :key="topic.Id">
                        <td>
                            <router-link :to="getTopicUrl(topic)" class="d-block">
                                <v-icon :color="getIconInfo(topic).color" small> {{ getIconInfo(topic).icon }} </v-icon>
                            </router-link>
                        </td>

                        <td>
                            <router-link :to="getTopicUrl(topic)" class="d-block">
                                {{ topic.Title }}

                                <template v-if="$store.state.settings.displayTopicTags">
                                    <v-chip class="ml-2" v-for="tag of topic.Tags" :key="tag.Name" :color="tag.Color" label small>
                                        {{ tag.Name }} <v-icon v-if="tag.Locked" x-small right> fas fa-lock </v-icon>
                                    </v-chip>
                                </template>
                            </router-link>
                        </td>

                        <td>
                            <router-link :to="`/users/${topic.User.Name}`" class="d-block no-text-decoration" :class="getUserClass(topic.User)">
                                {{ topic.User.Name }}
                            </router-link>
                        </td>

                        <td>
                            <router-link :to="getTopicUrl(topic)" class="d-block no-text-decoration white--text">
                                {{ topic.PostCount - 1 }}
                            </router-link>
                        </td>

                        <td>
                            <router-link :to="getTopicLastPage(topic)">
                                {{ topic.LastPostCreationDate | topicLastPostDate() }}
                            </router-link>
                        </td>

                        <td v-if="displayModerationTools">
                            <v-checkbox v-model="selectedTopics" :value="topic.Id" @change="$emit('input', selectedTopics)" dense />
                        </td>
                    </tr>

                    <tr v-if="topics.length === 0">
                        <td colspan="6" class="text-center">
                            Aucun topic
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>

        <v-list id="forum-list" v-if="this.$vuetify.breakpoint.mobile" dense>
            <v-list-item v-for="topic of topics" :key="topic.Id" :to="getTopicUrl(topic)">
                <v-list-item-icon>
                    <v-icon :color="getIconInfo(topic).color" small> {{ getIconInfo(topic).icon }} </v-icon>
                </v-list-item-icon>

                <v-list-item-content class="pb-2">
                    <v-list-item-title class="mb-4">
                        <router-link :to="getTopicUrl(topic)">
                            {{ topic.Title }}
                        </router-link>
                        <span style="color: #748491">
                            ({{ topic.PostCount - 1 }})
                        </span>
                    </v-list-item-title>

                    <v-list-item-subtitle>
                        <span :class="getUserClass(topic.User)">
                            {{ topic.User.Name }}
                        </span>

                        <span class="float-right mr-4">
                            {{ topic.LastPostCreationDate | topicLastPostDate() }}
                        </span>
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-list>

        <v-divider />
    </div>
</template>

<script>
import textToUrl from '../../../helpers/textToUrl';

export default {
    name: 'TopicList',

    props: {
        value: {},
        topics: { required: true, type: Array },
        displayModerationTools: { require: true, type: Boolean }
    },

    data: () => ({
        selectedTopics: []
    }),

    methods: {
        getUserClass(user) {
            if (user === null) {
                return 'anonymous-user';
            } else if (user.IsAdmin) {
                return 'admin-user';
            } else if (user.IsModerator) {
                return 'moderator-user';
            } else {
                return 'registered-user';
            }
        },

        getIconInfo(topic) {
            if (topic.Pinned) {
                if (topic.Locked) {
                    return { color: 'red', icon: 'fas fa-thumbtack' };
                } else {
                    return { color: 'green', icon: 'fas fa-thumbtack' };
                }
            } else {
                if (topic.Locked) {
                    return { color: 'blue-grey', icon: 'fas fa-lock' };
                } else if (topic.PostCount >= 20) {
                    return { color: 'red', icon: 'fas fa-folder' };
                } else {
                    return { color: 'yellow darken-1', icon: 'fas fa-folder' };
                }
            }
        },

        getTopicUrl(topic) {
            const title = textToUrl(topic.Title);
            return `/forums/${topic.JVCForumId}/hidden/${topic.Id}-` + title;
        },

        getTopicLastPage(topic) {
            let lastPage = Math.ceil(topic.PostCount / 20);
            if (lastPage === 0 || isNaN(lastPage)) {
                lastPage = 1;
            }
            const topicUrl = this.getTopicUrl(topic);
            return `${topicUrl}?page=${lastPage}`;
        }
    }
};
</script>

<style lang="scss" scoped>
.admin-user {
    color: red;
}

.moderator-user {
    color: rgb(14, 167, 14);
}

.registered-user {
    color: #4baeff;
}

#forum-list::v-deep {
    .v-list-item__title a {
        color: #4baeff;
        text-decoration: none;
        white-space: normal;
    }

    .v-list-item__title a:visited {
        color: #748491;
    }

    .v-list-item:nth-child(odd) {
        background-color: #181a1b;
    }

    .v-list-item:nth-child(even) {
        background-color: #1e2021;
    }
}

#forum-table::v-deep {
    table tbody {
        tr:nth-child(odd) {
            background-color: #181a1b;
        }

        tr:nth-child(even) {
            background-color: #1e2021;
        }

        tr {
            td {
                border-bottom: 0;

                &:first-child {
                    padding: 0px 5px;
                }

                &:nth-child(2) {
                    padding: 0px 5px;
                    cursor: pointer;
                }

                &:nth-child(2) a,
                &:nth-child(5) a {
                    color: #4baeff;
                    text-decoration: none;

                    &:visited {
                        color: #748491;
                    }
                }

                &:nth-child(5) {
                    color: #4baeff;
                }
            }
        }
    }
}
</style>