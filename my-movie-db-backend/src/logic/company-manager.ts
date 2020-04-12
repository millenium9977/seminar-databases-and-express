import {singleton} from 'tsyringe';
import {Company} from '../cross-cutting/data_classes/company';
import ogmneo from "ogmneo/index";
import logger from "../common/logger";

@singleton()
export class CompanyManager {
    public async GetCompanyByName(name: string): Promise<Company> {
        if(name.indexOf('\'') !== -1) {
            name = name.replace(/'/g, '') // database doesnt like ' inside their queries
        }
        let query = ogmneo.Query
            .create('company')
            .where(
                new ogmneo.Where('name', { $eq: name })
            );
        return await ogmneo.Node.findOne(query);
    }

    public async SaveOrGetCompany(name: string): Promise<Company> {
        if(name.indexOf('\'') !== -1) {
            name = name.replace(/'/g, ''); // database doesnt like ' inside their queries
        }
        let company: Company;
        try {
            company = await this.GetCompanyByName(name);
            if (company.name) {
                return company;
            }
        } catch (err) {
            company = await ogmneo.Node.create({
                name: name
            }, 'company');
        }
        return company;
    }

    public async GetCompanyByMovieByLanguageByCode(code: string): Promise<Array<Company>> {
        let query = ogmneo.RelationQuery.create('mov_lan')
            .endNodeWhere(
                new ogmneo.Where('code', { $eq: code })
            );
        let ids = (await ogmneo.Relation.findNodes(query, 'start') as Array<any>).map(node => node.start.id);
        let movies: Array<Company> = Array<Company>();
        for(let id of ids) {
            let q = ogmneo.RelationQuery.create('mov_com').startNode(id);
            movies = movies.concat((await ogmneo.Relation.findNodes(q, 'end') as Array<any>).map(node => node.end));
        }
        return movies.filter((thing, i, arr) => {
            return arr.indexOf(arr.find(t => t.id === thing.id)) === i;
        });
    }

    public async GetCompanyByMovieByLanguageByNameCypher(name: string): Promise<Array<Company>> {
        let movies = (await ogmneo.Cypher.transactionalRead('MATCH (n1:company)-[r:com_mov]->(n2:movie)-[r2:mov_lan]->(n3:language) WHERE n3.name = \'' + name + '\' RETURN n1')).records;
        return movies.map( movie => {
            return {
                name: movie._fields[0].properties.name,
                id: movie._fields[0].identity.low
            }
        }).filter((thing, i, arr) => {
            return arr.indexOf(arr.find(t => t.id === thing.id)) === i;
        });
    }

    public async DeleteCompanyByMovieByLanguageByNameCypher(name: string) {
        ogmneo.Cypher.transactionalWrite('MATCH (n1:company)-[r:com_mov]->(n2:movie)-[r2:mov_lan]->(n3:language) WHERE n3.name = \'' + name + '\' DETACH DELETE n1').catch( err =>
            logger.error(err)
        );
    }

    public async GetBudgetByCompanyName(name: string): Promise<number> {
        let query = ogmneo.RelationQuery.create('mov_com')
            .endNodeWhere(
                new ogmneo.Where('name', { $eq: name })
            );
        let movies = await ogmneo.Relation.findNodes(query, 'start');
        let sum = 0;
        movies.forEach(movie => sum += movie.start.budget);
        return sum;
    }

    public async Companies(): Promise<Array<Company>> {
        return await ogmneo.Node.find(ogmneo.Query.create('company'));
    }

}
