<template>
    <div>
        <v-card class="mb-4" outlined>
            <v-card-title>
                <v-item-group class="mr-4 mb-2 mb-lg-0 v-btn-toggle">
                    <v-btn @click="editorEmphasis('**')" small>
                        <v-icon small> fas fa-bold </v-icon>
                    </v-btn>
                    <v-btn @click="editorEmphasis('*')" small>
                        <v-icon small> fas fa-italic </v-icon>
                    </v-btn>
                    <v-btn @click="editorEmphasis('<ins>', '</ins>')" small>
                        <v-icon small> fas fa-underline </v-icon>
                    </v-btn>
                    <v-btn @click="editorEmphasis('~~')" small>
                        <v-icon small> fas fa-strikethrough </v-icon>
                    </v-btn>
                </v-item-group>

                <v-item-group class="mr-4 mb-2 mb-lg-0 v-btn-toggle">
                    <v-btn @click="editorPrepend('*')" small>
                        <v-icon small> fas fa-list-ul </v-icon>
                    </v-btn>
                    <v-btn @click="editorPrepend('1.')" small>
                        <v-icon small> fas fa-list-ol </v-icon>
                    </v-btn>
                    <v-btn @click="editorPrepend('>')" small>
                        <v-icon small> fas fa-quote-left </v-icon>
                    </v-btn>
                    <v-btn @click="editorEmphasis('```')" small>
                        <v-icon small> fas fa-code </v-icon>
                    </v-btn>
                    <v-btn @click="editorEmphasis('<spoil>', '</spoil>')" small>
                        <v-icon small> fas fa-eye-slash </v-icon>
                    </v-btn>
                </v-item-group>

                <v-item-group class="mr-4 mb-2 mb-lg-0 v-btn-toggle">
                    <v-btn small target="_blank" href="https://www.jeuxvideo.com/jvcode/documentation.php#smiley">
                        <v-icon small> fas fa-smile </v-icon>
                    </v-btn>
                    <v-btn small target="_blank" href="https://www.noelshack.com/">
                        <v-icon small> fas fa-image </v-icon>
                    </v-btn>
                    <v-btn small target="_blank" href="https://www.markdownguide.org/basic-syntax/">
                        <v-icon small> fas fa-question-circle </v-icon>
                    </v-btn>
                </v-item-group>

                <v-img src="@/assets/risibank.png" width="96.25" height="17.5" class="cursor-pointer" contain @click="risibankOpen = !risibankOpen" />
            </v-card-title>

            <v-expand-transition>
                <div v-show="risibankOpen">
                    <v-divider />

                    <v-tabs v-model="risibankTab" fixed-tabs>
                        <v-tab> Favoris </v-tab>
                        <v-tab> Populaire </v-tab>
                        <v-tab> Hasard </v-tab>
                        <v-tab> Récent </v-tab>
                        <v-tab> Hot </v-tab>
                        <v-tab> Recherche </v-tab>
                    </v-tabs>

                    <v-expand-transition>
                        <div v-show="risibankTab === 5">
                            <v-divider />

                            <v-row class="px-3">
                                <v-col>
                                    <v-text-field v-model="risibankSearch" @keydown.enter="fetchRisibankSearch()" outlined hide-details dense>
                                        <template v-slot:append-outer>
                                            <v-btn color="secondary" @click="fetchRisibankSearch()" small> Rechercher </v-btn>
                                        </template>
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </div>
                    </v-expand-transition>

                    <v-divider />

                    <v-row class="mx-0 stickers-container">
                        <v-col v-for="sticker of stickers" :key="sticker.id" cols="3" lg="2">
                            <v-hover v-slot:default="{ hover }">
                                <v-img v-if="risibankTab === 0" :src="sticker" width="70" height="55" @click.passive="addSticker(sticker)" class="mx-auto cursor-pointer">
                                    <v-row v-show="hover" align="end" class="fill-height">
                                        <v-col class="pb-0 mr-1 text-right">
                                            <v-tooltip top>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon @click.stop="removeSticker(sticker)" color="red" small v-on="on">
                                                        fas fa-trash
                                                    </v-icon>
                                                </template>
                                                Supprimer des favoris
                                            </v-tooltip>
                                        </v-col>
                                    </v-row>
                                </v-img>
                                <v-img v-else :src="sticker.risibank_link" width="70" height="55" @click.passive="addSticker(sticker.risibank_link)" class="mx-auto cursor-pointer">
                                    <v-row v-show="hover" align="end" class="fill-height">
                                        <v-col class="pb-0 mr-1 text-right">
                                            <v-tooltip top>
                                                <template v-slot:activator="{ on }">
                                                    <v-icon @click.stop="saveSticker(sticker)" color="yellow" small v-on="on">
                                                        fas fa-star
                                                    </v-icon>
                                                </template>
                                                Ajouter aux favoris
                                            </v-tooltip>
                                        </v-col>
                                    </v-row>
                                </v-img>
                            </v-hover>
                        </v-col>
                    </v-row>
                </div>
            </v-expand-transition>
        </v-card>

        <ValidationProvider v-slot="{ errors }" name="Message" :rules="required ? 'required' : null">
            <v-card v-if="quotedPost !== null" outlined style="border-bottom: 0; border-bottom-left-radius: 0; border-bottom-right-radius: 0;">
                <v-toolbar class="elevation-0" dense style="background-color: #303436;">
                    <v-toolbar-title>
                        Vous citez le

                        <v-menu offset-y top open-on-hover nudge-width="400">
                            <template v-slot:activator="{ on }">
                                <span v-on="on" class="primary--text">
                                    post
                                </span>
                            </template>
                            <QuotedPost :post="quotedPost" :originalPostId="quotedPost.Id" />
                        </v-menu>

                        de

                        <v-menu offset-y top open-on-hover nudge-width="400">
                            <template v-slot:activator="{ on }">
                                <span v-on="on" :class="getUserClass(quotedPost.User)">
                                    {{ quotedPost.User.Name }}
                                </span>
                            </template>
                            <AccountMenu :user="quotedPost.User" />
                        </v-menu>

                    </v-toolbar-title>
                    <v-btn class="ml-auto" icon small @click="quotedPost = null">
                        <v-icon small> fas fa-times </v-icon>
                    </v-btn>
                </v-toolbar>
            </v-card>

            <v-textarea v-model="content" @change="$emit('input', content)" ref="textarea" v-bind:class="{ 'textarea-quote': quotedPost !== null }" :error-messages="errors" hide-details outlined />
        </ValidationProvider>

        <v-row>
            <v-col cols="2" offset="10">
                <v-switch v-model="previewEnabled" label="Aperçu" class="mt-0 pt-0" hide-details inset dense />
            </v-col>
        </v-row>

        <v-expand-transition>
            <v-card v-show="previewEnabled" class=" mb-4" outlined>
                <div ref="preview" class="preview" v-html="preview"> </div>
            </v-card>
        </v-expand-transition>
    </div>
</template>

<script>
import { parse } from 'hidden-jvc-jvcode';

import QuotedPost from '../components/hidden/topic/QuotedPost';
import AccountMenu from '../components/hidden/topic/AccountMenu';

import initCode from '../helpers/initCode';
import initBlockquote from '../helpers/initBlockquote';
import initEmbedMedia from '../helpers/initEmbedMedia';


export default {
    name: 'TextEditor',

    components: {
        QuotedPost,
        AccountMenu
    },

    props: {
        value: { type: String, required: true },
        required: { type: Boolean, default: true }
    },

    data() {
        return {
            content: this.value,
            quotedPost: null,
            risibankTab: 1,
            risibank: null,
            risibankOpen: this.$store.state.settings.risibankOpen,
            risibankSearchResult: null,
            risibankSearch: '',
            previewEnabled: true
        };
    },

    computed: {
        stickers() {
            if (this.risibank === null) {
                return [];
            } else {
                switch (this.risibankTab) {
                    case 0:
                        return this.$store.state.user.favoriteStickers;
                    case 1:
                        return this.risibank.views;
                    case 2:
                        return this.risibank.random;
                    case 3:
                        return this.risibank.tms;
                    case 4:
                        return this.risibank.trending;
                    case 5:
                        return this.risibankSearchResult;
                    default:
                        return [];
                }
            }
        },

        preview() {
            return parse(this.content);
        },

        textarea() {
            return this.$refs.textarea.$refs.input;
        }
    },

    methods: {
        async fetchRisibank() {
            const response = await fetch('https://api.risibank.fr/api/v0/load');
            const result = await response.json();
            this.risibank = result.stickers;

            for (const key in this.risibank) {
                for (const sticker of this.risibank[key]) {
                    sticker.risibank_link = sticker.risibank_link.replace('http://', 'https://');
                }
            }
        },

        async fetchRisibankSearch() {
            try {
                this.setLoading(true);

                const response = await fetch('https://api.risibank.fr/api/v0/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ search: this.risibankSearch })
                });
                const result = await response.json();
                this.risibankSearchResult = result.stickers;
            } catch (err) {
                console.error(err);
            } finally {
                this.setLoading(false);
            }
        },

        appendText(text) {
            this.content += text;
            this.textarea.focus();
            this.textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        },

        addSticker(stickerUrl) {
            if (this.textarea.selectionStart || this.textarea.selectionStart == '0') {
                const start = this.textarea.selectionStart;
                const end = this.textarea.selectionEnd;

                const before = this.textarea.value.substring(0, start);
                // const selected = this.textarea.value.substring(start, end);
                const after = this.textarea.value.substring(end, this.textarea.value.length);

                this.content = `${before} ${stickerUrl} ${after}`;

                setTimeout(() => {
                    this.textarea.focus();
                    const cursorPosition = before.length + stickerUrl.length + 1;
                    this.textarea.setSelectionRange(cursorPosition, cursorPosition);
                }, 0);
            } else {
                this.content += stickerUrl;
                this.textarea.focus();
            }

            this.$emit('input', this.content);
        },

        saveSticker(sticker) {
            this.$store.commit('user/addFavoriteStickers', sticker.risibank_link);
        },

        removeSticker(stickerUrl) {
            this.$store.commit('user/removeFavoriteStickers', stickerUrl);
        },

        editorEmphasis(str, endStr) {
            if (!endStr) {
                endStr = str;
            }
            const start = this.textarea.selectionStart;
            const end = this.textarea.selectionEnd;

            const before = this.content.substring(0, start);
            const selected = this.content.substring(start, end);
            const after = this.content.substring(end, this.content.length);

            let cursorPosition = 0;

            if (this.textarea.selectionStart === this.textarea.selectionEnd) {
                this.content = `${before}${str}${endStr}${after}`;
                cursorPosition = before.length + str.length;
            } else {
                this.content = `${before}${str}${selected}${endStr}${after}`;
                cursorPosition = before.length + str.length + selected.length;
            }

            this.textarea.focus();
            setTimeout(() => {
                this.textarea.selectionEnd = cursorPosition;
            }, 0);
        },

        editorPrepend(str) {
            const contents = [];
            const cursorPosition = this.textarea.selectionStart;

            const lines = this.content.split('\n');
            let count = 0;
            var found = false;
            for (const line of lines) {
                count += line.length + 1;
                if (count >= cursorPosition + 1 && !found) {
                    found = true;
                    contents.push(`${str} ${line}`);
                } else {
                    contents.push(line);
                }
            }

            this.content = contents.join('\n');
        },

        quote(post) {
            this.quotedPost = post;
        },

        focus() {
            this.$refs.textarea.focus();
            this.$refs.textarea.$el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        },

        initJsEvents() {
            this.$nextTick(() => {
                initBlockquote(this.$refs.preview);
                initEmbedMedia(this.$refs.preview);
                initCode(this.$refs.preview);
            });
        }
    },

    watch: {
        content() {
            this.initJsEvents();
        }
    },

    created() {
        this.fetchRisibank();

        // display favorite stickers by default if there's is at least one
        if (this.$store.state.user.favoriteStickers.length > 0) {
            this.risibankTab = 0;
        }
        this.initJsEvents();
    }
};
</script>

<style lang="scss" scoped>
.textarea-quote ::v-deep.v-input__control {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

.stickers-container {
    overflow-y: scroll;
    overflow-x: hidden;
    height: 158px;
}

.preview {
    min-height: 158px;
    padding: 5px;
}
</style>