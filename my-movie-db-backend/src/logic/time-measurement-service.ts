import {injectable} from 'tsyringe';
import logger from '../common/logger';
import {performance} from "perf_hooks";

@injectable()
export class TimeMeasurementService {

    private start: number;
    private end: number;

    public Start() {
        this.start = performance.now();
        // console.time('Time needed for insertion: ');
    }

    public Stop() {
        this.end = performance.now();
        // console.timeEnd('Time needed for insertion: ');
        logger.debug('Time needed for insertion: ' + (this.end - this.start)/1000.0 + ' seconds');
    }

}
