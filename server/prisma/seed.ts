import bcrypt from "bcrypt";
import { Logger } from "borgen";
import { UserRole } from "../prisma/generated/prisma/client";
import { prisma } from "../database/prisma";

async function seedDatabase() {
  Logger.info({ message: "Initializing database..." });
  try {
    await seedAdmin();
    await seedSiteSettings();
    return true;
  } catch (err) {
    Logger.error({ message: "Database initialization failed : " + err });
    return false;
  }
}

export default seedDatabase;

// Seed admin
async function seedAdmin() {
  Logger.info({ message: "Initializing admin..." });

  try {
    // Check if admin exists in Db
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.ADMIN,
        email: "admin@admin.com",
      },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123^", 10);

      // Create admin
      await prisma.user.create({
        data: {
          name: "System Administrator",
          email: "admin@admin.com",
          password: hashedPassword,
          role: UserRole.ADMIN,
          isActive: true,
        },
      });

      Logger.info({
        message: "Admin seeded successfully",
        messageColor: "greenBright",
        infoColor: "gray",
      });
    } else {
      Logger.info({
        message: "Admin already exists in DB",
        messageColor: "magentaBright",
      });
    }
  } catch (err) {
    Logger.error({ message: "Error initializing Admin: " + err });
  }
}

// Seed site settings
async function seedSiteSettings() {
  Logger.info({ message: "Initializing site settings..." });

  try {
    // Get admin user for reference
    const admin = await prisma.user.findFirst({
      where: {
        role: UserRole.ADMIN,
      },
    });

    if (!admin) {
      Logger.error({ message: "Admin user not found, cannot seed settings" });
      return;
    }

    // Define default settings
    const defaultSettings = [
      { key: "maintenance_mode", value: "false" },
      { key: "allow_registration", value: "true" },
    ];

    // Create settings if they don't exist
    for (const setting of defaultSettings) {
      const existingSetting = await prisma.siteSetting.findUnique({
        where: { key: setting.key },
      });

      if (!existingSetting) {
        await prisma.siteSetting.create({
          data: {
            key: setting.key,
            value: setting.value,
            updatedById: admin.id, // Using the UUID field
          },
        });
      }
    }

    Logger.info({
      message: "Site settings initialized successfully",
      messageColor: "greenBright",
    });
  } catch (err) {
    Logger.error({ message: "Error initializing site settings: " + err });
  }
}
