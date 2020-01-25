import logger from '../common/logger';

export const AsyncExceptionHandler = (middleware) => {
    return async (req, res, next) => {
        try {
            await middleware(req, res, next);
        } catch (error) {
            logger.error(error);
            next(error);
        }
    };
};