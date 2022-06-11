import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {ITracker} from "../interface/tracker.interface";
import {IWorkerTimes} from "../interface/worker-times.interface";

@Injectable()
export class TrackerService {
    constructor(
        private prismaService: PrismaService
    ) {
    }

    async getUserNotCompletedTasks(userId: string): Promise<ITracker[]> {
        return this.prismaService.tracker.findMany({
            where: {
                AND: [
                    {
                        userId,
                        isCompleted: false
                    }
                ]
            }
        });
    }

    async startTracking(description: string, userId: string): Promise<{
        description: string,
        userId: string,
        startTime: Date
    }> {
        const startedTracker = await this.getUserNotCompletedTasks(userId);
        if (startedTracker.length > 0) {
            throw new HttpException("First you have to stop tracking.", HttpStatus.BAD_REQUEST);
        }
        const allWorks: IWorkerTimes[] = await this.prismaService.workerTimes.findMany({
            where: {
                userId
            }
        })
        const day = new Date().getDate()
        const month = new Date().getMonth()
        const year = new Date().getFullYear()
        let hasWorkedToday = 0;
        for (let work of allWorks) {
            const [workYear, workMonth, workDay] = work.createdAt.split(':')
            if (+workYear === year &&
                +workMonth === month &&
                +workDay === day
            ) {
                hasWorkedToday = 1;
                break;
            }
        }
        if (hasWorkedToday === 0) {
            await this.prismaService.workerTimes.create({
                data: {
                    userId,
                    workedTime: 0,
                    createdAt: `${year}:${month}:${day}`
                }
            })
        }
        return this.prismaService.tracker.create({
            data: {
                description,
                userId,
                startTime: new Date().toISOString(),
                endTime: new Date().toISOString(),
                isCompleted: false
            },
            select: {
                description: true,
                userId: true,
                startTime: true
            }
        });
    }

    async endTracking(userId: string): Promise<Partial<IWorkerTimes>> {
        const startedTracker = await this.getUserNotCompletedTasks(userId);
        if (startedTracker.length === 0) {
            throw new HttpException("There is no task to stop.", HttpStatus.BAD_REQUEST);
        }
        const stopTrack: Partial<ITracker> = await this.prismaService.tracker.update({
            where: {id: startedTracker[0].id},
            data: {endTime: new Date().toISOString(), isCompleted: true},
            select: {
                description: true,
                startTime: true,
                endTime: true
            }
        });
        const startTime = stopTrack.startTime.getTime();
        const endTime = stopTrack.endTime.getTime();
        const workedTime = Math.round((endTime - startTime) / 60000);
        const day = new Date().getDate()
        const month = new Date().getMonth()
        const year = new Date().getFullYear()
        const userLastWorkedTime: IWorkerTimes[] = await this.prismaService.workerTimes.findMany({
            where: {
                userId,
                createdAt: `${year}:${month}:${day}`
            }
        })
        await this.prismaService.workerTimes.update({
            where: {
                id: userLastWorkedTime[0].id
            },
            data: {
                workedTime: userLastWorkedTime[0].workedTime + workedTime
            }
        })
        return {workedTime};
    }

    async getUserWorkedTime(userId: string): Promise<{}> {
        const allUserWork: IWorkerTimes[] = await this.prismaService.workerTimes.findMany({
            where: {
                userId
            }
        })
        const result = {}
        for (let work of allUserWork) {
            result[work.createdAt] = work.workedTime + ' minutes'
        }
        return result
    }
}

