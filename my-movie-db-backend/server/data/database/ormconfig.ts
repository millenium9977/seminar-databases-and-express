import {ConnectionOptions} from 'typeorm';
import {Collection}          from '../../cross-cutting/data_classes/collection';
import {Company}           from '../../cross-cutting/data_classes/company';
import {Country}           from '../../cross-cutting/data_classes/country';
import {Genre}               from '../../cross-cutting/data_classes/genre';
import {Language} from '../../cross-cutting/data_classes/language';
import {Movie}    from '../../cross-cutting/data_classes/movie';

const config: ConnectionOptions = {
    database: process.env.MARIA_DB,
    entities: [
        Collection,
        Company,
        Country,
        Genre,
        Language,
        Movie
    ],
    host: process.env.MARIA_HOST,
    password: process.env.MARIA_PASSWORD,
    port: Number(process.env.MARIA_PORT),
    synchronize: true,
    type: 'mariadb',
    username: process.env.MARIA_USER,
};

export default config;
