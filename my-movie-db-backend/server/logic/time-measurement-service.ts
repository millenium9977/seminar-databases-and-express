import {container, injectable} from 'tsyringe';
import logger                  from '../common/logger';
import {performance}           from 'perf_hooks';

@injectable()
export class TimeMeasurementService {

    private _start: number;
    private _end: number;
    public Result: number;

    /**
     * Starts the time measurement
     * @constructor
     */
    public Start(): number {
        this._start = performance.now();
        return this._start;
    }

    /**
     * Stops the time measurement and calculates the time in ms
     * @constructor
     */
    public Stop(): number {
        this._end = performance.now();
        this.Result = this._end - this._start;
        logger.debug(`Execution Time: ${this.Result}`);
        return this._end;
    }

    /**
     * Maybe we can save this to a database but no idea
     * @constructor
     */
    public SaveTime() {

    }
}

export class TestResult {
    public Time: string;
    public Result: any;
}

export async function measurementHandler(action: () => Promise<any>): Promise<TestResult> {
    const measurementService: TimeMeasurementService = container.resolve(TimeMeasurementService);
    measurementService.Start();
    const result = await action();
    measurementService.Stop();

    return {
        Time: `${measurementService.Result / 1000}s`,
        Result: '',
    };
}
