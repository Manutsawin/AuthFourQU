-- CreateEnum
CREATE TYPE "Carreer_types" AS ENUM ('education', 'financial', 'construction', 'innovation', 'electronics', 'agriculture', 'transportation');

-- CreateTable
CREATE TABLE "Accounts" (
    "id" TEXT NOT NULL,
    "LaserID" TEXT NOT NULL,
    "SSN" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "pictureProfile" TEXT,
    "BoD" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "citizenship" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "careerList" (
    "careerID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "Carreer_types" NOT NULL DEFAULT 'education'
);

-- CreateTable
CREATE TABLE "accountCareer" (
    "accountID" TEXT NOT NULL,
    "careerID" TEXT NOT NULL,
    "salary" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "userAdress" (
    "accountID" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "subDistrict" TEXT NOT NULL,
    "houseNo" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "lane" TEXT NOT NULL,
    "road" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "globalAddress" (
    "id" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "subDistrict" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "OTP" (
    "id" TEXT NOT NULL,
    "expiredTime" TIMESTAMP(3) NOT NULL,
    "OtpNumber" TEXT NOT NULL,
    "accountID" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "shop" (
    "id" TEXT NOT NULL,
    "accountID" TEXT NOT NULL,
    "shopName" TEXT NOT NULL,
    "bussinessType" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,
    "salesPerYear" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "shopAddress" (
    "shopID" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "subDistrict" TEXT NOT NULL,
    "houseNO" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "lane" TEXT NOT NULL,
    "road" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3)
);

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_id_key" ON "Accounts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_SSN_key" ON "Accounts"("SSN");

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_email_key" ON "Accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "careerList_careerID_key" ON "careerList"("careerID");

-- CreateIndex
CREATE UNIQUE INDEX "accountCareer_accountID_key" ON "accountCareer"("accountID");

-- CreateIndex
CREATE UNIQUE INDEX "userAdress_accountID_key" ON "userAdress"("accountID");

-- CreateIndex
CREATE UNIQUE INDEX "globalAddress_id_key" ON "globalAddress"("id");

-- CreateIndex
CREATE UNIQUE INDEX "OTP_id_key" ON "OTP"("id");

-- CreateIndex
CREATE UNIQUE INDEX "shop_id_key" ON "shop"("id");

-- CreateIndex
CREATE UNIQUE INDEX "shop_accountID_key" ON "shop"("accountID");

-- CreateIndex
CREATE UNIQUE INDEX "shopAddress_shopID_key" ON "shopAddress"("shopID");

-- CreateIndex
CREATE UNIQUE INDEX "admin_id_key" ON "admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");
