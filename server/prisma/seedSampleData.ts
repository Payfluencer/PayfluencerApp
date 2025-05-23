import bcrypt from "bcryptjs";
import { Logger } from "borgen";
import { UserRole } from "../prisma/generated/prisma/client";
import { prisma } from "../database/prisma";

async function seedSampleData() {
  Logger.info({ message: "Seeding sample data..." });
  try {
    // Creating company manager first since company needs their ID
    const manager = await seedCompanyManager();
    if (manager) {
      await seedCompany(manager.id);
    }
    await seedUser();
    return true;
  } catch (err) {
    Logger.error({ message: "Sample data seeding failed: " + err });
    return false;
  }
}

// Seed a sample company
async function seedCompany(managerUserId?: string) {
  Logger.info({ message: "Creating sample company..." });

  try {
    const existingCompany = await prisma.company.findFirst({
      where: { name: "Sample Company" },
    });

    if (!existingCompany) {
      await prisma.company.create({
        data: {
          name: "Sample Company",
          logo: "https://example.com/logo.png",
          description: "This is a sample company for testing purposes",
          website: "https://example.com",
          address: "123 Sample St, Sample City, SC 12345",
          phone_number: "+1-234-567-8900",
          email: "info@example.com",
          manager_id: managerUserId, // Link to company manager if provided
        },
      });

      Logger.info({
        message: "Sample company created successfully",
        messageColor: "greenBright",
      });
    } else {
      Logger.info({
        message: "Sample company already exists",
        messageColor: "magentaBright",
      });
    }
  } catch (err) {
    Logger.error({ message: "Error creating sample company: " + err });
  }
}

// Seed a sample user
async function seedUser() {
  Logger.info({ message: "Creating sample user..." });

  try {
    const existingUser = await prisma.user.findFirst({
      where: { email: "user@example.com" },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("password123", 10);

      await prisma.user.create({
        data: {
          name: "Sample User",
          email: "user@example.com",
          password: hashedPassword,
          role: UserRole.USER,
          profile_picture: "https://example.com/profile.jpg",
          bio: "This is a sample user for testing purposes",
          evm_wallet_address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          isActive: true,
        },
      });

      Logger.info({
        message: "Sample user created successfully",
        messageColor: "greenBright",
      });
    } else {
      Logger.info({
        message: "Sample user already exists",
        messageColor: "magentaBright",
      });
    }
  } catch (err) {
    Logger.error({ message: "Error creating sample user: " + err });
  }
}

// Seed a sample company manager
async function seedCompanyManager() {
  Logger.info({ message: "Creating sample company manager..." });

  try {
    const existingManager = await prisma.user.findFirst({
      where: {
        email: "manager@example.com",
        role: UserRole.COMPANY_MANAGER,
      },
    });

    if (!existingManager) {
      const hashedPassword = await bcrypt.hash("manager123", 10);

      const manager = await prisma.user.create({
        data: {
          name: "Company Manager",
          email: "manager@example.com",
          password: hashedPassword,
          role: UserRole.COMPANY_MANAGER,
          profile_picture: "https://example.com/manager.jpg",
          bio: "Sample company manager for testing",
          phoneNumber: "+1-234-567-8901",
          isActive: true,
        },
      });

      Logger.info({
        message: "Sample company manager created successfully",
        messageColor: "greenBright",
      });

      return manager;
    } else {
      Logger.info({
        message: "Sample company manager already exists",
        messageColor: "magentaBright",
      });

      return existingManager;
    }
  } catch (err) {
    Logger.error({ message: "Error creating sample company manager: " + err });
    return null;
  }
}

export default seedSampleData;
