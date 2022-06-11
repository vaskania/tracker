import { Module } from "@nestjs/common";
import { TrackerModule } from "./tracker/tracker.module";
import { PrismaModule } from "./prisma/prisma.module";


@Module({
  imports: [TrackerModule, PrismaModule]

})
export class AppModule {
}
