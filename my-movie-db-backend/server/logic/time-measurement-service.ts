import {injectable} from 'tsyringe';
import logger       from '../common/logger';
import {performance} from 'perf_hooks';

@injectable()
export class TimeMeasurementService {

    private _start: number;
    private _end: number;
    public Result: number;

    public Start(): number {
        this._start = performance.now();
        logger.debug(this._start.toString());
        return this._start;
    }

    public Stop(): number {
        this._end = performance.now();
        logger.debug(this._end.toString());
        this.Result = this._end - this._start;
        return this._end;
    }

    public SaveTime() {

    }
}
