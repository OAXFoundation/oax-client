"use strict";
// ----------------------------------------------------------------------------
// Copyright (c) 2018,2019 OAX Foundation.
// https://www.oax.org/
// ----------------------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const { format, transports } = winston_1.default;
exports.loggers = new winston_1.default.Container();
/**
 * Logger for backend processes
 */
if (process.env.NODE_ENV === 'test') {
    exports.loggers.add('backend', {
        level: 'info',
        exitOnError: false,
        format: format.combine(format.timestamp(), format.json()),
        transports: [
            new transports.File({
                filename: 'logs/test.log'
            })
        ]
    });
    exports.loggers.add('frontend', {
        level: 'info',
        exitOnError: false,
        format: format.combine(format.timestamp(), format.json()),
        transports: [
            new transports.File({
                filename: 'logs/test.log'
            })
        ]
    });
}
else {
    exports.loggers.add('backend', {
        level: 'info',
        exitOnError: false,
        format: format.combine(format.timestamp(), format.json()),
        transports: [
            new transports.Console({
                format: format.simple()
            }),
            new transports.File({
                filename: 'logs/combined.log'
            })
        ]
    });
    exports.loggers.add('frontend', {
        level: 'info',
        exitOnError: false,
        format: format.combine(format.timestamp(), format.json()),
        transports: [
            new transports.Console({
                format: format.simple()
            })
        ]
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nZ2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9Mb2dnaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrRUFBK0U7QUFDL0UsMENBQTBDO0FBQzFDLHVCQUF1QjtBQUN2QiwrRUFBK0U7Ozs7O0FBRS9FLHNEQUE2QjtBQUU3QixNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLGlCQUFPLENBQUE7QUFFekIsUUFBQSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBRTlDOztHQUVHO0FBRUgsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxNQUFNLEVBQUU7SUFDbkMsZUFBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUU7UUFDckIsS0FBSyxFQUFFLE1BQU07UUFDYixXQUFXLEVBQUUsS0FBSztRQUNsQixNQUFNLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3pELFVBQVUsRUFBRTtZQUNWLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQztnQkFDbEIsUUFBUSxFQUFFLGVBQWU7YUFDMUIsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFBO0lBQ0YsZUFBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUU7UUFDdEIsS0FBSyxFQUFFLE1BQU07UUFDYixXQUFXLEVBQUUsS0FBSztRQUNsQixNQUFNLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3pELFVBQVUsRUFBRTtZQUNWLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQztnQkFDbEIsUUFBUSxFQUFFLGVBQWU7YUFDMUIsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFBO0NBQ0g7S0FBTTtJQUNMLGVBQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFO1FBQ3JCLEtBQUssRUFBRSxNQUFNO1FBQ2IsV0FBVyxFQUFFLEtBQUs7UUFDbEIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN6RCxVQUFVLEVBQUU7WUFDVixJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUM7Z0JBQ3JCLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFO2FBQ3hCLENBQUM7WUFDRixJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUM7Z0JBQ2xCLFFBQVEsRUFBRSxtQkFBbUI7YUFDOUIsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFBO0lBQ0YsZUFBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUU7UUFDdEIsS0FBSyxFQUFFLE1BQU07UUFDYixXQUFXLEVBQUUsS0FBSztRQUNsQixNQUFNLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3pELFVBQVUsRUFBRTtZQUNWLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQztnQkFDckIsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUU7YUFDeEIsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFBO0NBQ0gifQ==