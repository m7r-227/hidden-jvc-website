import Repository from './Repository.js';

class ForumRepository extends Repository {
    async getForum(forumId) {
        return await this.get(`jvc/forums/${forumId}`);
    }

    async getTopics(query) {
        return await this.get('hidden/topics', query);
    }

    async getTopic(topicId, page = 1, userId = null) {
        const query = {
            page
        };
        if (userId !== null) {
            query.userId = userId;
        }
        return await this.get(`hidden/topics/${topicId}`, query);
    }

    async getPostQuotes(postId) {
        return await this.get(`hidden/posts/${postId}/quotes`);
    }

    async createTopic(forumId, title, tags, content, username) {
        return await this.post('hidden/topics', { forumId, title, tags, content, username });
    }

    async updateTopic(topicId, { title, tags } = {}) {
        return await this.post(`hidden/topics/${topicId}`, { title, tags });
    }

    async createPost(topicId, content, postId, hcaptcha) {
        return await this.post('hidden/posts', { topicId, content, postId, hcaptcha });
    }

    async updatePost(topicId, postId, data) {
        return await this.post(`hidden/topics/${topicId}/posts/${postId}`, data);
    }

    async topicsModeration(action, ids) {
        return await this.post('hidden/moderation/topics', { action, ids });
    }

    async postsModeration(action, ids) {
        return await this.post('hidden/moderation/posts', { action, ids });
    }
}

export default new ForumRepository();
