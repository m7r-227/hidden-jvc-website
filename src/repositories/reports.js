import Repository from './Repository.js';

class ReportsRepository extends Repository {
    async getReportTypes() {
        return await this.get('reports/types');
    }
}

export default new ReportsRepository();
