-- CreateTable
CREATE TABLE "Doctor" (
    "doc_id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "phone" INTEGER,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("doc_id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "pa_id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "phone" INTEGER,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("pa_id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "apoint_id" SERIAL NOT NULL,
    "doc_id" INTEGER NOT NULL,
    "pa_id" INTEGER NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("apoint_id")
);

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "Doctor"("doc_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_pa_id_fkey" FOREIGN KEY ("pa_id") REFERENCES "Patient"("pa_id") ON DELETE RESTRICT ON UPDATE CASCADE;
