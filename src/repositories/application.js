import Repository from './Repository.js';

class ApplicationRepository extends Repository {
    async getUser(userName) {
        return await this.get(`application/users/${userName}`);
    }

    async login(body) {
        return await this.post('application/users/login', body);
    }

    async register(body) {
        return await this.post('application/users/register', body);
    }

    async me() {
        return await this.get('application/users/me');
    }

    async getHiddenTopics(query) {
        return await this.get('application/hidden/topics', query);
    }

    async getHiddenTopic(topicId, query) {
        return await this.get(`application/hidden/topics/${topicId}`, query);
    }
}

export default new ApplicationRepository();
