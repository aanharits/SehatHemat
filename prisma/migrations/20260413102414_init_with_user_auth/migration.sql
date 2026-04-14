-- CreateTable
CREATE TABLE "ingridients" (
    "id" BIGINT NOT NULL,
    "name" TEXT,
    "category" TEXT,
    "price" BIGINT,
    "protein" DOUBLE PRECISION,
    "calories" BIGINT,
    "unit" TEXT,

    CONSTRAINT "ingridients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "active_meal_plans" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "weeklyPlan" JSONB NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "targetCalories" DOUBLE PRECISION NOT NULL,
    "targetProtein" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "active_meal_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_meal_plans" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "dayName" TEXT NOT NULL,
    "meals" JSONB NOT NULL,
    "totalProtein" DOUBLE PRECISION NOT NULL,
    "totalCalories" DOUBLE PRECISION NOT NULL,
    "dailyCost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_meal_plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "active_meal_plans_userId_key" ON "active_meal_plans"("userId");

-- AddForeignKey
ALTER TABLE "active_meal_plans" ADD CONSTRAINT "active_meal_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_meal_plans" ADD CONSTRAINT "saved_meal_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
