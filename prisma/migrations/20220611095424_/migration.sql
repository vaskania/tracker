-- CreateTable
CREATE TABLE "Tracker" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3) NOT NULL,
    "isCompleted" BOOLEAN NOT NULL,

    CONSTRAINT "Tracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workerTimes" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "workedTime" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "workerTimes_pkey" PRIMARY KEY ("id")
);
