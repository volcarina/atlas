CREATE TYPE "MarkType" AS ENUM ('completed', 'favorite', 'wantTo');
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "nick" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "calories" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewsCount" INTEGER NOT NULL DEFAULT 0,
    "completedCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "exercises" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "trainers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "clientsCount" INTEGER NOT NULL,
    "certificationsCount" INTEGER NOT NULL,
    "sports" TEXT [],
    CONSTRAINT "trainers_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "marks" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "mark" "MarkType" NOT NULL,
    "markedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "marks_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "programs_nick_key" ON "programs"("nick");
CREATE UNIQUE INDEX "exercises_programId_id_key" ON "exercises"("programId", "id");
CREATE UNIQUE INDEX "trainers_username_key" ON "trainers"("username");
CREATE UNIQUE INDEX "marks_userId_programId_key" ON "marks"("userId", "programId");
ALTER TABLE "exercises"
ADD CONSTRAINT "exercises_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "marks"
ADD CONSTRAINT "marks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "marks"
ADD CONSTRAINT "marks_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;