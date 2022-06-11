export interface ITracker {
    id?: number
    userId: string
    description: string
    startTime: Date
    endTime: Date
    isCompleted: boolean
}