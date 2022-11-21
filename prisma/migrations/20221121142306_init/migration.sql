/*
  Warnings:

  - You are about to drop the column `gaID` on the `shopAddress` table. All the data in the column will be lost.
  - You are about to drop the column `gaID` on the `userAdress` table. All the data in the column will be lost.
  - Added the required column `district` to the `shopAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `shopAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `shopAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subDistrict` to the `shopAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `userAdress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `userAdress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `userAdress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subDistrict` to the `userAdress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shopAddress" DROP COLUMN "gaID",
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "subDistrict" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "userAdress" DROP COLUMN "gaID",
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "subDistrict" TEXT NOT NULL;
