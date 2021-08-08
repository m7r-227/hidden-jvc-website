<template>
    <v-card :class="{ 'pinned': post.Pinned, 'owned': $store.state.settings.highlightUserMessages && isPostMadeByConnectedUser }" outlined>

        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn v-if="post.Pinned" x-small fab absolute top color="success" style="left: -16px" v-on="on">
                    <v-icon x-small> fas fa-thumbtack </v-icon>
                </v-btn>
            </template>
            Message épinglé
        </v-tooltip>

        <v-card-title class="py-0">
            <span class="mr-4">
                <router-link :to="`/users/${post.User.Name}`">
                    <v-menu offset-y offset-x top open-on-hover nudge-width="400">
                        <template v-slot:activator="{ on }">
                            <v-avatar v-on="on">
                                <v-img v-if="post.User.ProfilePicture === null" src="@/assets/larry.png" />
                                <v-img v-if="post.User.ProfilePicture !== null" :src="post.User.ProfilePicture" />
                            </v-avatar>
                        </template>
                        <AccountMenu :user="post.User" />
                    </v-menu>
                </router-link>
            </span>

            <span>
                <router-link :to="`/users/${post.User.Name}`" class="no-text-decoration">
                    <v-menu offset-y offset-x top open-on-hover nudge-width="400">
                        <template v-slot:activator="{ on }">
                            <span v-on="on" :class="getUserClass(post.User)">
                                {{ post.User.Name }}
                            </span>
                        </template>
                        <AccountMenu :user="post.User" />
                    </v-menu>
                </router-link>

                <br>

                <span class="caption" :class="{ 'grey--text': !isPemt, 'green--text': isPemt }">
                    {{ post.CreationDate | postDate() }}
                </span>
            </span>

            <template v-if="!notificationMode">
                <!-- Edit -->
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-icon v-if="showEdit" @click="toggleEdit()" class="ml-auto" color="blue" x-small v-on="on">
                            fas fa-edit
                        </v-icon>
                    </template>
                    Modifier
                </v-tooltip>

                <!-- Quote -->
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-icon @click="quote(post)" :class="showEdit ? 'ml-4' : 'ml-auto'" x-small v-on="on">
                            fas fa-quote-right
                        </v-icon>
                    </template>
                    Citer
                </v-tooltip>

                <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                        <v-icon class="ml-4" small v-on="on">
                            fas fa-ellipsis-h
                        </v-icon>
                    </template>

                    <v-list dense>
                        <v-list-item @click="$emit('fic-mode', post.User.Id)">
                            <v-list-item-title> Afficher les posts de cet utilisateur </v-list-item-title>
                        </v-list-item>

                        <ReportDialog :hidden-post-id="post.Id">
                            <template v-slot:activator="{ on }">
                                <v-list-item v-on="on">
                                    <v-list-item-title> Signaler </v-list-item-title>
                                </v-list-item>
                            </template>
                        </ReportDialog>

                        <v-list-item v-if="showEdit" @click="toggleEdit()">
                            <v-list-item-title> Modifier </v-list-item-title>
                        </v-list-item>

                        <v-list-item v-if="showPin" @click="pin()">
                            <v-list-item-title> {{ post.Pinned ? 'Désépingler' : 'Épingler' }} </v-list-item-title>
                        </v-list-item>

                        <v-list-item v-if="showDelete" @click="deletePost()">
                            <v-list-item-title> Supprimer </v-list-item-title>
                        </v-list-item>

                        <v-list-item v-if="showBanAccount" @click="banAccount(true)">
                            <v-list-item-title> Ban le compte </v-list-item-title>
                        </v-list-item>

                        <v-list-item v-if="showUnbanAccount" @click="banAccount(false)">
                            <v-list-item-title> Déban le compte </v-list-item-title>
                        </v-list-item>

                        <v-list-item v-if="showBanIp" @click="banIp(true)">
                            <v-list-item-title> Ban l'ip </v-list-item-title>
                        </v-list-item>

                        <v-list-item v-if="showUnbanIp" @click="banIp(false)">
                            <v-list-item-title> Déban l'ip </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
            <template v-else>
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-btn class="ml-auto" small icon v-on="on" @click="$emit('delete-notification')">
                            <v-icon small> fas fa-times </v-icon>
                        </v-btn>
                    </template>
                    Supprimer la notification de ce post
                </v-tooltip>
            </template>
        </v-card-title>

        <v-divider />

        <v-row v-if="post.QuotedPost !== null" class="px-5">
            <v-col>
                <QuotedPost :post="post.QuotedPost" :originalPostId="post.Id" />
            </v-col>
        </v-row>

        <v-row v-if="editMode" class="px-5">
            <v-col>
                <TextEditor v-model="editContent" />

                <v-btn @click="edit()" color="primary" depressed small>
                    Modifier
                </v-btn>

                <v-btn @click="editMode = false" color="secondary" class="float-right" depressed small>
                    Annuler
                </v-btn>
            </v-col>
        </v-row>

        <v-row class="px-5" style="margin-bottom: -16px" v-show="!editMode">
            <v-col>
                <div ref="postContent" v-html="parseJvcode(post.Content)"> </div>
            </v-col>
        </v-row>

        <v-row v-if="post.ModificationDate !== null" class="px-5 caption grey--text" v-show="!editMode">
            <v-col>
                Message édité le {{ post.ModificationDate | postDate() }}
            </v-col>
        </v-row>

        <v-divider v-if="post.User !== null && post.User.Signature !== null" />

        <v-row v-if="post.User !== null && post.User.Signature !== null" class="px-5 caption grey--text" style="margin-bottom: -16px">
            <v-col>
                <div v-html="parseJvcode(post.User.Signature)"> </div>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import TextEditor from '../../TextEditor.vue';
import AccountMenu from './AccountMenu.vue';
import QuotedPost from './QuotedPost.vue';
import ReportDialog from '../../dialogs/ReportDialog.vue';

import initBlockquote from '../../../helpers/initBlockquote';
import initEmbedMedia from '../../../helpers/initEmbedMedia';
import initCode from '../../../helpers/initCode';


export default {
    name: 'Post',

    components: {
        TextEditor,
        QuotedPost,
        AccountMenu,
        ReportDialog
    },

    props: {
        post: { required: true },
        forumId: { default: null },
        isPemt: { default: false },
        topicId: { default: null },
        authorId: { default: null },
        notificationMode: { type: Boolean, default: false }
    },

    data() {
        return {
            editContent: this.post.Content,
            editMode: false
        };
    },

    computed: {
        isPostMadeByConnectedUser() {
            return this.post.User !== null && this.$store.state.user.user !== null && this.post.User.Id === this.$store.state.user.user.Id;
        },

        showBanAccount() {
            return this.post.User !== null && !this.post.User.Banned && (
                this.isAdmin || this.$store.getters['user/hasRightOnForum'](this.forumId, 'BanAccount')
            );
        },

        showUnbanAccount() {
            return this.post.User !== null && this.post.User.Banned && (
                this.isAdmin || this.$store.getters['user/hasRightOnForum'](this.forumId, 'BanAccount')
            );
        },

        showBanIp() {
            return !this.post.IpBanned && (
                this.isAdmin || this.$store.getters['user/hasRightOnForum'](this.forumId, 'BanIp')
            );
        },

        showUnbanIp() {
            return this.post.IpBanned && (
                this.isAdmin || this.$store.getters['user/hasRightOnForum'](this.forumId, 'BanIp')
            );
        },

        showPin() {
            return !this.post.Op // can't pin first post
                && (this.authorId !== null && this.authorId === this.$store.state.user.user.Id); // author can pin posts
        },

        showEdit() {
            return this.isPostMadeByConnectedUser;
        },

        showDelete() {
            return this.isAdmin
                || this.$store.getters['user/hasRightOnForum'](this.forumId, 'Delete')
                || this.isPostMadeByConnectedUser;
        }
    },

    methods: {
        quote() {
            this.$emit('quote', this.post);
        },

        toggleEdit() {
            this.editMode = !this.editMode;
        },

        async edit() {
            try {
                this.setLoading(true);

                const { error } = await this.repos.hidden.updatePost(this.topicId, this.post.Id, { content: this.editContent });
                if (error) {
                    this.openErrorDialog(error);
                } else {
                    this.editMode = false;
                    this.$emit('reloadTopic');
                }
            } catch (err) {
                console.error(err);
            } finally {
                this.setLoading(false);
            }
        },

        async deletePost() {
            try {
                this.setLoading(true);

                const { error } = await this.repos.hidden.postsModeration('Delete', [this.post.Id]);
                if (error) {
                    this.openErrorDialog(error);
                } else {
                    this.editMode = false;
                    this.$emit('reloadTopic');
                }
            } catch (err) {
                console.error(err);
            } finally {
                this.setLoading(false);
            }
        },

        async pin() {
            try {
                this.setLoading(true);

                const { error } = await this.repos.hidden.updatePost(this.topicId, this.post.Id, { pinned: !this.post.Pinned });
                if (error) {
                    this.openErrorDialog(error);
                } else {
                    this.$emit('reloadTopic');
                }
            } catch (err) {
                console.error(err);
            } finally {
                this.setLoading(false);
            }
        },

        async banAccount(ban) {
            try {
                this.setLoading(true);

                const { error } = await this.repos.hidden.postsModeration(ban ? 'BanAccount' : 'UnBanAccount', [this.post.Id]);
                if (error) {
                    this.openErrorDialog(error);
                } else {
                    this.editMode = false;
                    this.$emit('reloadTopic');
                }
            } catch (err) {
                console.error(err);
            } finally {
                this.setLoading(false);
            }
        },

        async banIp(ban) {
            try {
                this.setLoading(true);

                const { error } = await this.repos.hidden.postsModeration(ban ? 'BanIp' : 'UnBanIp', [this.post.Id]);
                if (error) {
                    this.openErrorDialog(error);
                } else {
                    this.editMode = false;
                    this.$emit('reloadTopic');
                }
            } catch (err) {
                console.error(err);
            } finally {
                this.setLoading(false);
            }
        },

        getPostAuthorName() {
            if (this.post.User !== null) {
                return this.post.User.Name;
            } else {
                return this.post.Username;
            }
        }
    },

    created() {
        this.$nextTick(() => {
            initBlockquote(this.$refs.postContent);
            initEmbedMedia(this.$refs.postContent);
            initCode(this.$refs.postContent);
        });
    }
};
</script>

<style lang="scss" scoped>
.pinned {
    border-color: #060;
}

.owned {
    border-color: #2196f3;
}
</style>