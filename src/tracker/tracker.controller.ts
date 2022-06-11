import {Controller, Get, Post, Param, Body, Logger} from "@nestjs/common";
import {TrackerService} from "./tracker.service";
import {TrackerDto} from "../dto";

@Controller("tracker")
export class TrackerController {
    logger = new Logger()

    constructor(
        private readonly trackerService: TrackerService
    ) {
    }

    @Get("/:userId")
    async getTotalWorkingTime(@Param('userId') userId: string) {
        try {
            return this.trackerService.getUserWorkedTime(userId)
        } catch (error) {
            this.logger.error(error.message)
            throw error
        }
    }

    @Post("/start/:userId")
    async startTracking(
        @Body() tracker: TrackerDto,
        @Param("userId") userId: string
    ) {
        try {
            return this.trackerService.startTracking(tracker.description, userId);
        } catch (error) {
            this.logger.error(error.message)
            throw error
        }
    }

    @Post("/end/:userId")
    async endTracking(
        @Param("userId") userId: string
    ): Promise<any> {
        try {
            return this.trackerService.endTracking(userId);
        } catch (error) {
            this.logger.error(error.message)
            throw error;
        }
    }
}