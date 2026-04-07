[dotenv@17.3.1] injecting env (9) from .env.local -- tip: ⚙️  override existing env vars with { override: true }
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "tbl_attendance" (
    "id_attendance" BIGSERIAL NOT NULL,
    "id_student" BIGINT,
    "date" DATE NOT NULL,
    "time" VARCHAR(10),
    "status" VARCHAR(20),
    "remarks" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "method" VARCHAR(10),

    CONSTRAINT "tbl_attendance_pkey" PRIMARY KEY ("id_attendance")
);

-- CreateTable
CREATE TABLE "tbl_chart_data" (
    "id_data" BIGSERIAL NOT NULL,
    "month" INTEGER,
    "year" INTEGER,
    "id_class" BIGINT,
    "total_present" INTEGER DEFAULT 0,
    "total_menstruation" INTEGER DEFAULT 0,
    "total_warnings" INTEGER DEFAULT 0,

    CONSTRAINT "tbl_chart_data_pkey" PRIMARY KEY ("id_data")
);

-- CreateTable
CREATE TABLE "tbl_activity_logs" (
    "id_log" BIGSERIAL NOT NULL,
    "id_user" BIGINT,
    "activity" VARCHAR(255),
    "timestamp" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,

    CONSTRAINT "tbl_activity_logs_pkey" PRIMARY KEY ("id_log")
);

-- CreateTable
CREATE TABLE "tbl_notifications" (
    "id_notification" BIGSERIAL NOT NULL,
    "id_student" BIGINT,
    "message" TEXT,
    "read_status" VARCHAR(10),
    "sent_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_notifications_pkey" PRIMARY KEY ("id_notification")
);

-- CreateTable
CREATE TABLE "tbl_menstruation_settings" (
    "id_setting" BIGSERIAL NOT NULL,
    "min_normal_duration" INTEGER DEFAULT 5,
    "max_normal_duration" INTEGER DEFAULT 7,
    "auto_purification_limit" INTEGER DEFAULT 8,
    "is_notification_active" BOOLEAN DEFAULT true,
    "warning_message" VARCHAR(255),

    CONSTRAINT "tbl_menstruation_settings_pkey" PRIMARY KEY ("id_setting")
);

-- CreateTable
CREATE TABLE "tbl_warnings" (
    "id_warning" BIGSERIAL NOT NULL,
    "id_student" BIGINT,
    "warning_date" DATE,
    "warning_type" VARCHAR(50),
    "read_status" VARCHAR(10),
    "admin_action" TEXT,

    CONSTRAINT "tbl_warnings_pkey" PRIMARY KEY ("id_warning")
);

-- CreateTable
CREATE TABLE "tbl_menstruation_periods" (
    "id_period" BIGSERIAL NOT NULL,
    "id_student" BIGINT,
    "start_date" DATE,
    "end_date" DATE,
    "duration" INTEGER,
    "completion_status" VARCHAR(10),
    "remarks" VARCHAR(50),

    CONSTRAINT "tbl_menstruation_periods_pkey" PRIMARY KEY ("id_period")
);

-- CreateTable
CREATE TABLE "tbl_monthly_recaps" (
    "id_recap" BIGSERIAL NOT NULL,
    "id_student" BIGINT,
    "month" INTEGER,
    "year" INTEGER,
    "total_prayers" INTEGER DEFAULT 0,
    "total_menstruation" INTEGER DEFAULT 0,
    "total_present" INTEGER DEFAULT 0,
    "total_excused" INTEGER DEFAULT 0,
    "total_absent" INTEGER DEFAULT 0,
    "total_warnings" INTEGER DEFAULT 0,

    CONSTRAINT "tbl_monthly_recaps_pkey" PRIMARY KEY ("id_recap")
);

-- CreateTable
CREATE TABLE "tbl_classes" (
    "id_class" BIGSERIAL NOT NULL,
    "class_name" VARCHAR(50) NOT NULL,
    "advisor" VARCHAR(100),
    "description" TEXT,

    CONSTRAINT "tbl_classes_pkey" PRIMARY KEY ("id_class")
);

-- CreateTable
CREATE TABLE "tbl_students" (
    "id_student" BIGSERIAL NOT NULL,
    "nis" VARCHAR NOT NULL,
    "full_name" VARCHAR NOT NULL,
    "id_class" BIGINT,
    "period_status" VARCHAR,
    "notes" TEXT,
    "icode" VARCHAR(50) NOT NULL,
    "pancingan" TEXT,

    CONSTRAINT "tbl_students_pkey" PRIMARY KEY ("id_student")
);

-- CreateTable
CREATE TABLE "tbl_users" (
    "id_user" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(20),
    "last_login" TIMESTAMPTZ(6),
    "photo_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_users_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "tbl_connections" (
    "id_connection" BIGSERIAL NOT NULL,
    "id_user" BIGINT NOT NULL,
    "email" VARCHAR(150),
    "provider" VARCHAR(50),
    "provider_id" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tbl_connections_pkey" PRIMARY KEY ("id_connection")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_students_icode_key" ON "tbl_students"("icode");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_users_username_key" ON "tbl_users"("username");

-- AddForeignKey
ALTER TABLE "tbl_attendance" ADD CONSTRAINT "tbl_attendance_id_student_fkey" FOREIGN KEY ("id_student") REFERENCES "tbl_students"("id_student") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tbl_chart_data" ADD CONSTRAINT "tbl_chart_data_id_class_fkey" FOREIGN KEY ("id_class") REFERENCES "tbl_classes"("id_class") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tbl_notifications" ADD CONSTRAINT "tbl_notifications_id_student_fkey" FOREIGN KEY ("id_student") REFERENCES "tbl_students"("id_student") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tbl_warnings" ADD CONSTRAINT "tbl_warnings_id_student_fkey" FOREIGN KEY ("id_student") REFERENCES "tbl_students"("id_student") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tbl_menstruation_periods" ADD CONSTRAINT "tbl_menstruation_periods_id_student_fkey" FOREIGN KEY ("id_student") REFERENCES "tbl_students"("id_student") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tbl_monthly_recaps" ADD CONSTRAINT "tbl_monthly_recaps_id_student_fkey" FOREIGN KEY ("id_student") REFERENCES "tbl_students"("id_student") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tbl_students" ADD CONSTRAINT "tbl_students_id_class_fkey" FOREIGN KEY ("id_class") REFERENCES "tbl_classes"("id_class") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tbl_connections" ADD CONSTRAINT "tbl_connections_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "tbl_users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

